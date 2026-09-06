import asyncio

from tools.product_tools import (
    get_available_products,
    get_product,
)


async def main():

    print("========== AVAILABLE PRODUCTS ==========")

    products = await get_available_products.ainvoke({})

#     print(products)

    print("\n========== SINGLE PRODUCT ==========")

    product = await get_product.ainvoke({
        "product_name": "Milk"
    })

    print(product)


if __name__ == "__main__":
    asyncio.run(main())