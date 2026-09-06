import os
import httpx

from langchain_core.tools import tool
from typing import Literal, Optional

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:9000")


async def fetch_user_orders(
    user_id: str,
    view: Literal["latest", "all"] = "all",
    status: Optional[str] = None,
):
    """
    Fetch orders for the authenticated user.

    view:
        latest -> return only the latest order for UI purposes
        all    -> return all matching orders

    status:
        Optional order status filter such as Pending, Delivered,
        Processing, Shipped, Cancelled, or Confirmed.
    """

    url = f"{BACKEND_URL}/order/get-user-orders"

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            url,
            json={
                "userId": user_id,
            },
        )

        response.raise_for_status()
        data = response.json()

    if not data.get("success"):
        return {
            "success": False,
            "message": data.get(
                "message",
                "Unable to fetch orders",
            ),
            "orders": [],
            "latestOrder": None,
            "displayMode": view,
            "statusFilter": status,
        }

    orders = data.get("orders", [])

    simplified_orders = []

    for order in orders:
        products = []

        for item in order.get("productsData", []):
            product = item.get("productId") or {}

            products.append(
                {
                    "productId": product.get("_id"),
                    "name": product.get("name"),
                    "quantity": item.get("productQuantity"),
                    "price": item.get("productPrice"),
                    "quantityUnit": product.get("quantityUnit"),
                }
            )

        simplified_orders.append(
            {
                "orderId": order.get("_id"),
                "status": order.get("status"),
                "totalAmount": order.get("totalAmount"),
                "paymentMode": order.get("paymentMode"),
                "createdAt": order.get("createdAt"),
                "updatedAt": order.get("updatedAt"),
                "products": products,
            }
        )

    # ---------------------------------------------
    # Filter by status
    # ---------------------------------------------

    if status:
        normalized_status = status.strip().lower()

        simplified_orders = [
            order
            for order in simplified_orders
            if str(order.get("status", "")).lower()
            == normalized_status
        ]

    # ---------------------------------------------
    # No matching orders
    # ---------------------------------------------

    if not simplified_orders:
        return {
            "success": True,
            "orders": [],
            "latestOrder": None,
            "displayMode": view,
            "statusFilter": status,
        }

    # ---------------------------------------------
    # Determine latest order
    # ---------------------------------------------

    latest_order = max(
        simplified_orders,
        key=lambda order: order.get(
            "createdAt",
            "",
        ),
    )

    # ---------------------------------------------
    # Latest view
    # ---------------------------------------------

    if view == "latest":
        return {
            "success": True,
            "orders": [latest_order],
            "latestOrder": latest_order,
            "displayMode": "latest",
            "statusFilter": status,
        }

    # ---------------------------------------------
    # All view
    # ---------------------------------------------

    return {
        "success": True,
        "orders": simplified_orders,
        "latestOrder": latest_order,
        "displayMode": "all",
        "statusFilter": status,
    }


@tool
async def get_my_orders(
    view: Literal["latest", "all"] = "all",
    status: Optional[str] = None,
):
    """
    Get orders belonging to the authenticated user.

    view:
    - latest: use when the user asks about their latest/current order.
    - all: use when the user asks to see multiple/all orders.

    status:
    - optional order status filter.
    - examples: Pending, Delivered, Processing, Shipped, Cancelled,
      Confirmed.
    """

    return {
        "success": True,
        "message": (
            "This tool must be executed by the application "
            "with the authenticated user's ID."
        ),
        "view": view,
        "status": status,
    }


async def fetch_order_status(order_id: str, user_id: str):
    """
    Internal function.

    Fetch a specific order's status through the Express backend.
    """

    url = f"{BACKEND_URL}/order/get-order-status"

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            url,
            json={
                "userId": user_id,
                "orderId": order_id,
            },
        )

        response.raise_for_status()

        data = response.json()

    return data


@tool
async def get_order_status(order_id: str):
    """
    Get the status of a specific order.

    Use this when the user provides a specific order ID.
    """

    return {
        "success": True,
        "message": "This tool must be executed by the application with the authenticated user's ID.",
        "orderId": order_id,
    }