import axios from "axios";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // User identity comes from the verified JWT.
    const userId = req.user.userId;

    const response = await axios.post(`${process.env.AI_SERVICE_URL}/chat`, {
      message: message.trim(),
      user_id: userId,
    });

    return res.status(200).json({
      success: true,

      // AI's natural language response
      response: response.data.response,

      // Structured data used by React to render cards
      ui: response.data.ui || null,
    });
  } catch (error) {
    console.error(
      "AI Controller Error:",
      error.response?.data || error.message,
    );

    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: "AI usage limit has been reached.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "AI service is unavailable",
    });
  }
};
