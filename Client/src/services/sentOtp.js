import emailjs from "emailjs-com";

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendOtpEmail = async (email, otp) => {
  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      {
        otp: otp,
        email: email,
      },
      publicKey
    );
    return { success: true, otp: otp, response };
  } catch (error) {
    return { success: false, error };
  }
};