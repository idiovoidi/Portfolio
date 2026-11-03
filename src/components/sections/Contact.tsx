import { motion } from "framer-motion";
import type React from "react";
import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import { personalInfo } from "../../data/personal";
import { useInView } from "../../hooks";
import {
  isEmailServiceConfigured,
  mockSendEmail,
  sendContactEmail,
} from "../../utils";
import { createFadeInUp, revealState } from "../../utils/animations";
import ContactForm, { type ContactFormData } from "../ui/ContactForm";
import { Section } from "../ui/Section";
import SocialLinks from "../ui/SocialLinks";

export const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ref: formRef, inView: formInView } = useInView({ threshold: 0.1 });
  const { ref: infoRef, inView: infoInView } = useInView({ threshold: 0.1 });
  const settings = usePerformanceSettings();

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Use EmailJS if configured, otherwise use mock for development
      if (isEmailServiceConfigured()) {
        await sendContactEmail(data);
      } else {
        console.warn("EmailJS not configured. Using mock email service.");
        await mockSendEmail(data);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = personalInfo.social;

  return (
    <Section
      id="contact"
      tone="surface"
      title="Get In Touch"
      subtitle="Have a project in mind or want to collaborate? Feel free to reach out!"
      className="py-20"
      sectionStyle={{ minHeight: "100vh" }}
      headerClassName="text-center mb-16"
    >
      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Contact Form */}
        <motion.div
          ref={formRef}
          variants={createFadeInUp(0.2)}
          initial="initial"
          animate={revealState(formInView, settings.enableAnimations)}
          className="card p-8"
        >
          <h3
            className="text-2xl font-semibold mb-6"
            style={{ color: "var(--color-text-primary)" }}
          >
            Send a Message
          </h3>
          <ContactForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

          {/* EmailJS Configuration Notice */}
          {!isEmailServiceConfigured() && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-3 rounded-lg"
              style={{
                backgroundColor: "var(--color-warning)22",
                border: "1px solid var(--color-warning)",
              }}
            >
              <p className="text-xs" style={{ color: "var(--color-warning)" }}>
                ⚠️ Email service not configured. Messages will be logged to
                console. See .env.example for setup instructions.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          ref={infoRef}
          variants={createFadeInUp(0.4)}
          initial="initial"
          animate={revealState(infoInView, settings.enableAnimations)}
          className="space-y-8"
        >
          {/* Contact Details Card */}
          <div className="card p-8">
            <h3
              className="text-2xl font-semibold mb-6"
              style={{ color: "var(--color-text-primary)" }}
            >
              Contact Information
            </h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "var(--color-primary)22" }}
                >
                  <FaEnvelope
                    size={24}
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <div>
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Email
                  </p>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="hover:underline transition-all duration-300"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {personalInfo.email}
                  </a>
                </div>
              </div>

              {/* Location (if provided) */}
              {personalInfo.location && (
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "var(--color-primary)22" }}
                  >
                    <FaMapMarkerAlt
                      size={24}
                      style={{ color: "var(--color-primary)" }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      Location
                    </p>
                    <p style={{ color: "var(--color-text-primary)" }}>
                      {personalInfo.location}
                    </p>
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div>
                <p
                  className="text-sm font-medium mb-4"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Connect with me
                </p>
                <SocialLinks links={socialLinks} iconSize={28} />
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div
            className="card p-8"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary)11, var(--color-accent)11)",
              border: "1px solid var(--color-primary)33",
            }}
          >
            <h4
              className="text-lg font-semibold mb-3"
              style={{ color: "var(--color-text-primary)" }}
            >
              Let's Build Something Amazing
            </h4>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "var(--color-text-secondary)" }}
            >
              I'm always interested in hearing about new projects and
              opportunities. Whether you have a question or just want to say hi,
              I'll try my best to get back to you!
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
