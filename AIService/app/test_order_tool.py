import asyncio

from app.tools.order_tools import get_order_status


async def main():

    result = await get_order_status.ainvoke({
        "order_id": "6a41019556f8d1d9fda69814",
        "user_id": "6875ffc2dd25cbf97e246ff5",
    })

    print("\n===== ORDER TOOL RESULT =====")
    print(result)


if __name__ == "__main__":
    asyncio.run(main())
    