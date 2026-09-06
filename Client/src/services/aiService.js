import api from "./api";

export const sendAIMessage = async (message) => {
  const res = await api.post("/ai/chat", {
    message,
  });

  return res?.data;
};
