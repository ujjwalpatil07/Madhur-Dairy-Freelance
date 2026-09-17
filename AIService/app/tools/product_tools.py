import os

import httpx
from dotenv import load_dotenv
from langchain_core.tools import tool

# Load environment variables from .env
load_dotenv()


# Existing Express backend URL
BACKEND_URL = os.getenv(
    "BACKEND_URL",
)


@tool
async def get_available_products():
    """
    Get all dairy products that are currently available
    in the store inventory.

    Use this tool when the customer asks:
    - What products are available?
    - What dairy products do you sell?
    - Show me the available products.
    - What can I buy?
    - Show me the product catalog.
    """

    url = f"{BACKEND_URL}/products"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)

        response.raise_for_status()

        data = response.json()

        products = data.get("products", [])

        # Return only useful information to the LLM.
        simplified_products = [
            {
                "id": str(product.get("_id")),
                "name": product.get("name"),
                "price": product.get("price"),
                "stock": product.get("stock"),
                "quantityUnit": product.get("quantityUnit"),
                "category": product.get("category"),
                "description": product.get("description"),
                "inInventory": product.get("inInventory"),
            }
            for product in products
        ]

        return {
            "success": True,
            "products": simplified_products,
        }

    except httpx.HTTPStatusError as error:
        return {
            "success": False,
            "message": (
                f"Backend returned HTTP "
                f"{error.response.status_code}"
            ),
        }

    except httpx.RequestError as error:
        return {
            "success": False,
            "message": (
                f"Could not connect to backend: {str(error)}"
            ),
        }

    except Exception as error:
        return {
            "success": False,
            "message": f"Unexpected error: {str(error)}",
        }


@tool
async def get_product(product_name: str):
    """
    Get information about a specific dairy product.

    Use this tool when the customer asks about:
    - the price of a specific product
    - the stock of a specific product
    - details about a specific product
    - whether a specific product is available

    Example:
    Customer: "What is the price of Cow Milk?"
    Tool input: "Cow Milk"
    """

    product_name = product_name.strip()

    if not product_name:
        return {
            "success": False,
            "message": "Product name cannot be empty.",
        }

    url = (
        f"{BACKEND_URL}/products/"
        f"search/{product_name}"
    )

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)

        if response.status_code == 404:
            return {
                "success": False,
                "message": (
                    f"Product '{product_name}' "
                    f"was not found."
                ),
            }

        response.raise_for_status()

        data = response.json()

        print("\n===== RAW BACKEND RESPONSE =====")
        print(data)

        # Your backend returns "products", not "product"
        products = data.get("products", [])

        if not products:
            return {
                "success": False,
                "message": (
                    f"No product data was returned "
                    f"for '{product_name}'."
                ),
            }

        if len(products) > 1:
            return {
                "success": False,
                "ambiguous": True,
                "message": (
                    f"Multiple products matched '{product_name}'. "
                    "Please specify the exact product name."
                ),
                "products": [
                    {
                        "id": str(product.get("_id")),
                        "name": product.get("name"),
                        "price": product.get("price"),
                        "quantityUnit": product.get("quantityUnit"),
                    }
                    for product in products
                ],
            }

        product = products[0]

        simplified_product = {
            "id": str(product.get("_id")),
            "name": product.get("name"),
            "price": product.get("price"),
            "stock": product.get("stock"),
            "quantityUnit": product.get("quantityUnit"),
            "category": product.get("category"),
            "description": product.get("description"),
            "inInventory": product.get("inInventory"),
            "discount": product.get("discount"),
        }

        return {
            "success": True,
            "product": simplified_product,
        }

    except httpx.HTTPStatusError as error:
        return {
            "success": False,
            "message": (
                f"Backend returned HTTP "
                f"{error.response.status_code}"
            ),
        }

    except httpx.RequestError as error:
        return {
            "success": False,
            "message": (
                f"Could not connect to backend: {str(error)}"
            ),
        }

    except Exception as error:
        return {
            "success": False,
            "message": f"Unexpected error: {str(error)}",
        }


@tool
async def search_products(product_query: str):
    """
    Search for products matching a user's query.

    Use this when the customer refers to a product category,
    partial name, or ambiguous product name.

    Examples:
    - "milk"
    - "cheese"
    - "bread"
    - "chocolate"

    If multiple products match, return all matches so the
    assistant can ask the customer to choose one.
    """

    product_query = product_query.strip()

    if not product_query:
        return {
            "success": False,
            "message": "Product search query cannot be empty.",
            "products": [],
        }

    url = f"{BACKEND_URL}/products/search/{product_query}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url)

        if response.status_code == 404:
            return {
                "success": True,
                "products": [],
                "query": product_query,
            }

        response.raise_for_status()

        data = response.json()

        products = data.get("products", [])

        simplified_products = [
            {
                "id": str(product.get("_id")),
                "name": product.get("name"),
                "price": product.get("price"),
                "stock": product.get("stock"),
                "quantityUnit": product.get("quantityUnit"),
                "category": product.get("category"),
                "description": product.get("description"),
                "inInventory": product.get("inInventory"),
                "discount": product.get("discount"),
            }
            for product in products
        ]

        return {
            "success": True,
            "query": product_query,
            "products": simplified_products,
        }

    except httpx.HTTPStatusError as error:
        return {
            "success": False,
            "message": (
                f"Backend returned HTTP "
                f"{error.response.status_code}"
            ),
            "products": [],
        }

    except httpx.RequestError as error:
        return {
            "success": False,
            "message": (
                f"Could not connect to backend: {str(error)}"
            ),
            "products": [],
        }

    except Exception as error:
        return {
            "success": False,
            "message": f"Unexpected error: {str(error)}",
            "products": [],
        }