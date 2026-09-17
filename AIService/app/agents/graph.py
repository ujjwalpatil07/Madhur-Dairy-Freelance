import os
import json

from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, ToolMessage

from langgraph.graph import StateGraph, START, END
from langchain_core.messages import (
    SystemMessage,
    ToolMessage,
)
from app.agents.state import AgentState

from app.tools.product_tools import (
    get_available_products,
    get_product,
    search_products
)

from app.tools.order_tools import (
    get_my_orders,
    get_order_status,
    fetch_user_orders,
    fetch_order_status,
)


# =========================================================
# Environment
# =========================================================

load_dotenv()


# =========================================================
# Gemini
# =========================================================

model = ChatGoogleGenerativeAI(
    model=os.getenv(
        "GEMINI_MODEL",
        "gemini-3.5-flash"
    ),
)


# =========================================================
# Tools available to Gemini
# =========================================================

tools = [
    get_available_products,
    get_product,
    get_my_orders,
    get_order_status,
    search_products,
]


model_with_tools = model.bind_tools(tools)


# =========================================================
# System Prompt
# =========================================================

SYSTEM_PROMPT = """
You are the AI customer support assistant for a dairy products ecommerce application.

GENERAL RULES:

1. Never invent product information or order information.

2. Always use the appropriate tool for product or order questions.

3. Use only information returned by the tools.

4. Never ask the user for their user ID.

5. The authenticated user's identity is provided by the application.

6. Currency is Indian Rupees (₹).

7. When structured UI data is available, do not repeat detailed
   fields in the text response when those details will be shown
   in the UI card.


PRODUCT RULES:

8. For general product/catalog questions, use get_available_products.

9. Use get_product only when the user clearly identifies ONE specific product.

10. Use search_products when the product name is:
    - partial
    - generic
    - ambiguous
    - a category or broad product term

Examples:

    "What is the price of Cow Milk?"
    → get_product with "Cow Milk"

    "How much is Almond Milk?"
    → get_product with "Almond Milk"

    "Tell me the price of milk?"
    → search_products with "milk"

    "How much does cheese cost?"
    → search_products with "cheese"

11. If search_products returns multiple matching products:
    - DO NOT choose one product arbitrarily.
    - DO NOT use the first result.
    - DO NOT answer the price for only one product.
    - Ask the customer which specific product they mean.
    - Mention the matching product names when useful.

12. If any product tool returns ambiguous=true:
    - Do not provide a price or product-specific answer yet.
    - Ask the customer to specify which product they mean.
    - Do not guess which product they intended.

13. If search_products returns exactly one matching product:
    - You may answer using that product's information.

14. If get_product returns ambiguous=true:
    - Ask the customer to specify the exact product.
    - Never select the first result.


ORDER RULES:

15. For order questions without a specific order ID, use get_my_orders.

16. For a specific order ID, use get_order_status.

17. For questions such as:
    - "Where is my order?"
    - "What's the status of my order?"
    - "How is my latest order?"
    use get_my_orders with view="latest".

18. For questions such as:
    - "Show my orders"
    - "Show all my orders"
    - "What orders have I placed?"
    use get_my_orders with view="all".

19. For questions containing an order-status filter:
    - "Show my pending orders"
    - "What delivered orders do I have?"
    - "Show my cancelled orders"
    use get_my_orders with view="all" and the appropriate status.

20. For an order list, keep the text response to a short summary,
    for example:
    "You have 2 pending orders:".

21. For a single latest order, provide only a short status summary,
    for example:
    "Your latest order has been delivered."

22. Do not list order IDs, product quantities, prices, payment methods,
    or other detailed order fields in the text response when those
    details will be shown in the UI card.

23. Never expose payment signatures, payment IDs, or private address
    information to the user unless explicitly required by the application.
"""


# =========================================================
# Agent Node
# =========================================================

async def agent_node(state: AgentState):

    messages = state["messages"]

    messages_with_system_prompt = [
        SystemMessage(content=SYSTEM_PROMPT),
        *messages,
    ]

    response = await model_with_tools.ainvoke(
        messages_with_system_prompt
    )

    return {
        "messages": [response]
    }


# =========================================================
# Tool Registry
# =========================================================

tools_by_name = {
    tool.name: tool
    for tool in tools
}


# =========================================================
# Custom Tool Node
# =========================================================

async def tool_node(state: AgentState):
    messages = state["messages"]
    last_message = messages[-1]

    user_id = state["user_id"]

    tool_messages = []

    last_tool_result = None

    for tool_call in last_message.tool_calls:

        tool_name = tool_call["name"]
        tool_args = tool_call.get("args", {})

        print("\n===== TOOL EXECUTION =====")
        print(f"Tool: {tool_name}")
        print(f"Arguments: {tool_args}")
        print(f"Trusted User ID: {user_id}")

        if tool_name == "get_order_status":

            order_id = tool_args.get("order_id")

            print(f"Order ID: {order_id}")

            result = await fetch_order_status(
                order_id=order_id,
                user_id=user_id,
            )

        elif tool_name == "get_my_orders":

          view = tool_args.get("view", "all")
          status = tool_args.get("status")

          result = await fetch_user_orders(
               user_id=user_id,
               view=view,
               status=status,
          )

        elif tool_name == "get_available_products":

            result = await get_available_products.ainvoke(
                tool_args
            )

        elif tool_name == "get_product":

            result = await get_product.ainvoke(
                tool_args
            )
            
        elif tool_name == "search_products":

            result = await search_products.ainvoke(
                tool_args
            )

        else:

            result = {
                "success": False,
                "message": f"Unknown tool: {tool_name}",
            }

        print(f"Tool Result: {result}")

        # Save the structured result for the application layer.
        last_tool_result = result

        tool_messages.append(
            ToolMessage(
                content=str(result),
                tool_call_id=tool_call["id"],
            )
        )

    return {
        "messages": tool_messages,
        "last_tool_result": last_tool_result,
    }

# =========================================================
# Routing
# =========================================================

def should_continue(state: AgentState):

    last_message = state["messages"][-1]

    if last_message.tool_calls:
        return "tools"

    return END


# =========================================================
# Build Graph
# =========================================================

builder = StateGraph(AgentState)


builder.add_node(
    "agent",
    agent_node,
)

builder.add_node(
    "tools",
    tool_node,
)


builder.add_edge(
    START,
    "agent",
)


builder.add_conditional_edges(
    "agent",
    should_continue,
    {
        "tools": "tools",
        END: END,
    },
)


builder.add_edge(
    "tools",
    "agent",
)


graph = builder.compile()