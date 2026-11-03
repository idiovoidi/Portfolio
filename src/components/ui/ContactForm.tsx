import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  isSubmitting = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const onSubmitForm = async (data: ContactFormData) => {
    try {
      setSubmitStatus("idle");
      await onSubmit(data);
      setSubmitStatus("success");
      reset();

      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (error) {
      setSubmitStatus("error");

      // Clear error message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 2,
              message: "Name must be at least 2 characters",
            },
          })}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--color-background)",
            borderColor: errors.name ? "#ef4444" : "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
          placeholder="Your name"
          disabled={isSubmitting}
        />
        {errors.name && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {errors.name.message}
          </motion.p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2"
          style={{
            backgroundColor: "var(--color-background)",
            borderColor: errors.email ? "#ef4444" : "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={6}
          {...register("message", {
            required: "Message is required",
            minLength: {
              value: 10,
              message: "Message must be at least 10 characters",
            },
          })}
          className="w-full px-4 py-3 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 resize-none"
          style={{
            backgroundColor: "var(--color-background)",
            borderColor: errors.message ? "#ef4444" : "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
          placeholder="Your message..."
          disabled={isSubmitting}
        />
        {errors.message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {errors.message.message}
          </motion.p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
        style={{
          backgroundColor: isSubmitting
            ? "var(--color-text-secondary)"
            : "var(--color-primary)",
          color: "#ffffff",
          cursor: isSubmitting ? "not-allowed" : "pointer",
          opacity: isSubmitting ? 0.7 : 1,
        }}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </motion.button>

      {/* Success/Error Messages */}
      {submitStatus === "success" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg"
          style={{ backgroundColor: "#10b98133", border: "1px solid #10b981" }}
        >
          <p className="text-sm" style={{ color: "#10b981" }}>
            ✓ Message sent successfully! I'll get back to you soon.
          </p>
        </motion.div>
      )}

      {submitStatus === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-lg"
          style={{ backgroundColor: "#ef444433", border: "1px solid #ef4444" }}
        >
          <p className="text-sm" style={{ color: "#ef4444" }}>
            ✗ Failed to send message. Please try again or email me directly.
          </p>
        </motion.div>
      )}
    </form>
  );
};

export default ContactForm;
