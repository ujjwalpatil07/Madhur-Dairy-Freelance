from typing import Annotated, Any

from langchain.messages import AnyMessage
from langgraph.graph.message import add_messages
from typing_extensions import TypedDict


class AgentState(TypedDict, total=False):
    messages: Annotated[list[AnyMessage], add_messages]
    user_id: str

    # Stores the latest trusted tool result.
    # This is used by the application to build structured UI data.
    last_tool_result: Any