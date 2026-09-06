import asyncio

from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, ToolMessage

from tools.product_tools import (
    get_available_products,
    get_product,
)


# Load environment variables
load_dotenv()


# Create Gemini model
model = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash",
    temperature=0,
)


# Give our tools to Gemini
tools = [
    get_available_products,
    get_product,
]

model_with_tools = model.bind_tools(tools)


# Create a dictionary so we can find tools by name
tools_by_name = {
    tool.name: tool
    for tool in tools
}


async def main():

    question = "What dairy products are currently available?"

    messages = [
        HumanMessage(content=question)
    ]

    # -------------------------------------------------
    # STEP 1
    # Ask Gemini what it wants to do
    # -------------------------------------------------

    ai_message = await model_with_tools.ainvoke(messages)

    print("\n===== GEMINI TOOL REQUEST =====")
    print(ai_message.tool_calls)

    # Add Gemini's response to conversation
    messages.append(ai_message)

    # -------------------------------------------------
    # STEP 2
    # Execute requested tools
    # -------------------------------------------------

    for tool_call in ai_message.tool_calls:

        tool_name = tool_call["name"]
        tool_args = tool_call["args"]
        tool_call_id = tool_call["id"]

        print("\n===== EXECUTING TOOL =====")
        print("Tool:", tool_name)
        print("Arguments:", tool_args)

        # Find the requested Python tool
        tool = tools_by_name[tool_name]

        # IMPORTANT:
        # Our tools are async, so use ainvoke()
        tool_result = await tool.ainvoke(tool_args)

        print("\n===== TOOL RESULT =====")
        print(tool_result)

        # Add the tool result to the conversation
        messages.append(
            ToolMessage(
                content=str(tool_result),
                tool_call_id=tool_call_id,
            )
        )

    # -------------------------------------------------
    # STEP 3
    # Give tool result back to Gemini
    # -------------------------------------------------

    final_response = await model_with_tools.ainvoke(messages)

    print("\n===== FINAL GEMINI RESPONSE =====")
    print(final_response.content)


if __name__ == "__main__":
    asyncio.run(main())