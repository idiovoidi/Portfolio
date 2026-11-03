import { motion } from "framer-motion";
import type React from "react";
import { navLinks } from "../../data/navigation";
import { personalInfo } from "../../data/personal";
import SocialLinks from "../ui/SocialLinks";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = personalInfo.social;

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-background to-surface border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
              {personalInfo.name}
            </h3>
            <p className="text-text-secondary text-sm">{personalInfo.title}</p>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <h4 className="text-lg font-semibold text-text-primary mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-wrap justify-center gap-4">
              {navLinks.map((section) => (
                <a
                  key={section.href}
                  href={section.href}
                  onClick={(e) => handleNavClick(e, section.href)}
                  className="text-text-secondary hover:text-primary transition-colors duration-300 text-sm hover:underline underline-offset-4"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center md:text-right"
          >
            <h4 className="text-lg font-semibold text-text-primary mb-4">
              Connect
            </h4>
            <div className="flex justify-center md:justify-end">
              <SocialLinks links={socialLinks} iconSize={24} />
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/20 mb-6"></div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-text-secondary text-sm"
        >
          <p>
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
          <p className="mt-2 text-xs">
            Built with React, TypeScript, and Tailwind CSS
          </p>
        </motion.div>
      </div>

      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
