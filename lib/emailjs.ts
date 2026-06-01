import emailjs from "@emailjs/browser";

// Initialize EmailJS with public key
const initEmailJS = () => {
  if (typeof window !== "undefined") {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    }
  }
};

interface EmailParams {
  from_name: string;
  from_email: string;
  message: string;
}

export const sendEmail = async (params: EmailParams): Promise<boolean> => {
  try {
    initEmailJS();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;

    if (!serviceId || !templateId) {
      console.error("EmailJS credentials not configured");
      return false;
    }

    const response = await emailjs.send(serviceId, templateId, params);
    return response.status === 200;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
