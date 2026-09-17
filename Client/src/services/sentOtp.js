import emailjs from "emailjs-com";

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendOtpEmail = async (email, otp) => {
  try {
    if (!serviceId || !templateId || !publicKey) {
      throw new Error("EmailJS environment variables are missing.");
    }

    if (!email || !otp) {
      throw new Error("Email and OTP are required.");
    }

    const templateParams = {
      email: email,
      otp: otp,
    };

    console.log("Sending OTP email:", {
      serviceId,
      templateId,
      email,
      otp,
    });

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log("EmailJS success:", response.status, response.text);

    return {
      success: true,
      response,
    };
  } catch (error) {
    console.error("EmailJS failed:", error);

    return {
      success: false,
      error:
        error?.text ||
        error?.message ||
        "Failed to send OTP email.",
    };
  }
};

