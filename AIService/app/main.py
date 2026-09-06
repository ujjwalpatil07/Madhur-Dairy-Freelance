from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.agents.graph import graph


app = FastAPI(
    title="MilkDairyProducts AI Service",
    description="AI support agent for MilkDairyProducts",
    version="1.0.0",
)


# =========================================================
# Request Model
# =========================================================

class ChatRequest(BaseModel):
    message: str
    user_id: str


# =========================================================
# Response Model
# =========================================================

class ChatResponse(BaseModel):
    response: str
    ui: dict | None = None


# =========================================================
# Build UI Data
# =========================================================

def build_ui_data(tool_result):
    """
    Convert trusted backend/tool data into structured UI data.

    The LLM does not control this structure.
    The application creates it deterministically.
    """

    if not tool_result:
        return None

    # =====================================================
    # Specific Order
    # =====================================================

    if (
        tool_result.get("success")
        and isinstance(tool_result.get("order"), dict)
    ):
        order = tool_result["order"]

        return {
            "type": "order",
            "order": {
                "id": order.get("id"),
                "status": order.get("status"),
                "totalAmount": order.get("totalAmount"),
                "paymentMode": order.get("paymentMode"),
                "createdAt": order.get("createdAt"),
                "updatedAt": order.get("updatedAt"),
            },
        }

    # =====================================================
    # User Orders
    # =====================================================

    if (
        tool_result.get("success")
        and isinstance(tool_result.get("orders"), list)
    ):
        latest_order = tool_result.get("latestOrder")

        orders = []

        for order in tool_result["orders"]:

            orders.append(
                {
                    "id": order.get("orderId"),
                    "status": order.get("status"),
                    "totalAmount": order.get("totalAmount"),
                    "paymentMode": order.get("paymentMode"),
                    "createdAt": order.get("createdAt"),
                    "updatedAt": order.get("updatedAt"),
                    "products": order.get("products", []),
                }
            )

        latest_order_data = None

        if latest_order:
            latest_order_data = {
                "id": latest_order.get("orderId"),
                "status": latest_order.get("status"),
                "totalAmount": latest_order.get("totalAmount"),
                "paymentMode": latest_order.get("paymentMode"),
                "createdAt": latest_order.get("createdAt"),
                "updatedAt": latest_order.get("updatedAt"),
                "products": latest_order.get("products", []),
            }

        return {
            "type": "orders",
            "displayMode": tool_result.get(
                "displayMode",
                "all",
            ),
            "statusFilter": tool_result.get(
                "statusFilter"
            ),
            "orders": orders,
            "latestOrder": latest_order_data,
        }
    # =====================================================
    # Single Product
    # =====================================================

    if (
        tool_result.get("success")
        and isinstance(tool_result.get("product"), dict)
    ):
        product = tool_result["product"]

        return {
            "type": "product",
            "product": {
                "id": product.get("id"),
                "name": product.get("name"),
                "price": product.get("price"),
                "stock": product.get("stock"),
                "quantityUnit": product.get("quantityUnit"),
                "category": product.get("category"),
                "description": product.get("description"),
                "discount": product.get("discount"),
                "inInventory": product.get("inInventory"),
            },
        }

    # =====================================================
    # Product List
    # =====================================================

    if isinstance(tool_result.get("products"), list):

        products = []

        for product in tool_result["products"]:

            products.append(
                {
                    "id": product.get("id"),
                    "name": product.get("name"),
                    "price": product.get("price"),
                    "stock": product.get("stock"),
                    "quantityUnit": product.get("quantityUnit"),
                    "category": product.get("category"),
                    "discount": product.get("discount"),
                    "inInventory": product.get("inInventory"),
                }
            )

        return {
            "type": "products",
            "products": products,
        }

    return None


# =========================================================
# Extract Final Text
# =========================================================

def extract_text(content):

    if isinstance(content, str):
        return content

    if isinstance(content, list):

        text_parts = []

        for block in content:

            if (
                isinstance(block, dict)
                and block.get("type") == "text"
            ):
                text_parts.append(
                    block.get("text", "")
                )

        return " ".join(
            part.strip()
            for part in text_parts
            if part.strip()
        )

    return str(content)


# =========================================================
# Health Check
# =========================================================

@app.get("/")
async def root():
    return {
        "message": "MilkDairyProducts AI Service is running"
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }


# =========================================================
# Chat Endpoint
# =========================================================

@app.post(
    "/chat",
    response_model=ChatResponse,
)
async def chat(request: ChatRequest):

    try:

        from langchain_core.messages import HumanMessage

        # -------------------------------------------------
        # Run LangGraph
        # -------------------------------------------------

        result = await graph.ainvoke(
            {
                "messages": [
                    HumanMessage(
                        content=request.message
                    )
                ],
                "user_id": request.user_id,
            }
        )

        # -------------------------------------------------
        # Final AI message
        # -------------------------------------------------

        final_message = result["messages"][-1]

        final_text = extract_text(
            final_message.content
        )

        # -------------------------------------------------
        # Structured UI data
        # -------------------------------------------------

        ui_data = build_ui_data(
            result.get("last_tool_result")
        )

        # -------------------------------------------------
        # Final response
        # -------------------------------------------------

        return ChatResponse(
            response=final_text,
            ui=ui_data,
        )

    except Exception as error:

        print("\n===== CHAT ERROR =====")
        print(error)

        raise HTTPException(
            status_code=500,
            detail="AI service failed to process the request."
        )