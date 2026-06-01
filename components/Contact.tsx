"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Mail, Loader } from "lucide-react";
import emailjs from "@emailjs/browser";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const onSubmit = async (data: FormData) => {
    if (!process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) {
      setSubmitStatus("error");
      return;
    }

    setIsSubmitting(true);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        {
          from_name: data.name,
          from_email: data.email,
          message: data.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
      );
      setSubmitStatus("success");
      reset();
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section
      id="contact"
      className="section-container px-4 py-20 max-w-2xl mx-auto w-full"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-full"
      >
        <motion.h2 variants={itemVariants} className="text-center gradient-text mb-4">
          Get In Touch
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-center text-muted mb-12"
        >
          Have a project in mind? Let's collaborate and create something amazing
          together.
        </motion.p>

        <motion.form
          variants={itemVariants}
          onSubmit={handleSubmit(onSubmit)}
          className="glass-card space-y-6"
        >
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Name
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-3 bg-white/5 border border-gold/30 rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Email
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 bg-white/5 border border-gold/30 rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
            />
          </div>

          {/* Message Input */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Message
            </label>
            <textarea
              {...register("message", { required: true, minLength: 4 })}
              placeholder="Tell me about your project..."
              rows={5}
              className="w-full px-4 py-3 bg-white/5 border border-gold/30 rounded-lg text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader size={20} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail size={20} />
                Send Message
              </>
            )}
          </motion.button>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm"
            >
              ✓ Message sent successfully! I'll get back to you soon.
            </motion.div>
          )}

          {submitStatus === "error" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              ✕ Error sending message. Please try again.
            </motion.div>
          )}
        </motion.form>

        {/* Social Links */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-muted mb-6">Or connect with me on social media</p>
          <div className="flex justify-center gap-6">
            {[
              { label: "GitHub", url: "https://github.com" },
              { label: "LinkedIn", url: "https://linkedin.com" },
              { label: "Twitter", url: "https://twitter.com" },
            ].map((social, idx) => (
              <motion.a
                key={idx}
                whileHover={{ scale: 1.1, color: "#F0C96A" }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold-light transition-colors"
              >
                {social.label}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;
