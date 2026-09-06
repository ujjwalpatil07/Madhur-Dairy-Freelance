import asyncio

from langchain_core.messages import HumanMessage

from app.agents.graph import graph


async def main():

    # -------------------------------------------------
    # Trusted authenticated user ID
    # -------------------------------------------------

    user_id = "6875ffc2dd25cbf97e246ff5"

    # -------------------------------------------------
    # Order
    # -------------------------------------------------

    order_id = "6a41019556f8d1d9fda69814"

    question = "Where is my order ?"  

    # -------------------------------------------------
    # Run graph
    # -------------------------------------------------

    result = await graph.ainvoke(
        {
            "messages": [
                HumanMessage(content=question)
            ],

            # Trusted application information
            "user_id": user_id,
        }
    )

    print("\n===== FINAL MESSAGE =====")

    final_message = result["messages"][-1]

    print(final_message.content)


if __name__ == "__main__":
    asyncio.run(main())