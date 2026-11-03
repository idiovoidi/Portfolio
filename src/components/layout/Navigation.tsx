import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollSpy } from "../../hooks";
import { CursedText } from "../ui/CursedText";
import { navLinks, type NavGroup, type NavLink } from "../../data/navigation";

const GROUP_THEME: Record<
  NavGroup,
  {
    background: string;
    border: string;
    boxShadow: string;
    activeColor: string;
    inactiveColor: string;
    particleA: string;
    particleB: string;
    mobileLabel: string;
    mobileAccent: string;
  }
> = {
  art: {
    background:
      "linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(236, 72, 153, 0.08))",
    border: "1px solid rgba(168, 85, 247, 0.2)",
    boxShadow:
      "0 0 20px rgba(168, 85, 247, 0.15), inset 0 0 20px rgba(168, 85, 247, 0.05)",
    activeColor: "var(--color-primary)",
    inactiveColor: "var(--color-text-secondary)",
    particleA: "var(--color-primary)",
    particleB: "var(--color-accent)",
    mobileLabel: "Creative Works",
    mobileAccent: "var(--color-primary)",
  },
  commercial: {
    background:
      "linear-gradient(135deg, rgba(255, 251, 235, 0.28), rgba(253, 230, 138, 0.16))",
    border: "1px solid rgba(252, 211, 77, 0.45)",
    boxShadow:
      "0 0 18px rgba(253, 224, 165, 0.28), inset 0 0 16px rgba(255, 255, 255, 0.12)",
    activeColor: "#facc15",
    inactiveColor: "#fde68a",
    particleA: "#fef3c7",
    particleB: "#f8fafc",
    mobileLabel: "Commercial Work",
    mobileAccent: "#facc15",
  },
};

const collectConsecutiveGroups = (startIndex: number) => {
  const groups: { name: NavGroup; links: NavLink[] }[] = [];

  for (let i = startIndex; i < navLinks.length; i++) {
    const groupName = navLinks[i].group;
    if (!groupName) break;

    const last = groups[groups.length - 1];
    if (last?.name === groupName) {
      last.links.push(navLinks[i]);
    } else {
      groups.push({ name: groupName, links: [navLinks[i]] });
    }
  }

  return groups;
};

interface ConjoinedNavGroupsProps {
  groups: { name: NavGroup; links: NavLink[] }[];
  activeSection: string;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

const ConjoinedNavGroups: React.FC<ConjoinedNavGroupsProps> = ({
  groups,
  activeSection,
  onNavClick,
}) => (
  <div className="relative flex items-stretch">
    {groups.map((group, groupIndex) => {
      const theme = GROUP_THEME[group.name];
      const isFirst = groupIndex === 0;
      const isLast = groupIndex === groups.length - 1;
      const radiusClass =
        groups.length === 1
          ? "rounded-lg"
          : isFirst
            ? "rounded-l-lg rounded-r-none"
            : isLast
              ? "rounded-r-lg rounded-l-none"
              : "rounded-none";

      return (
        <div
          key={group.name}
          className={`relative px-3 py-2 ${radiusClass} ${!isFirst ? "-ml-px" : ""}`}
          style={{
            background: theme.background,
            border: theme.border,
            boxShadow: theme.boxShadow,
          }}
        >
          <motion.div
            className="absolute top-1 left-2 w-1 h-1 rounded-full pointer-events-none"
            style={{
              background: theme.particleA,
              boxShadow: `0 0 4px ${theme.particleA}`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-1 right-3 w-0.5 h-0.5 rounded-full pointer-events-none"
            style={{
              background: theme.particleB,
              boxShadow: `0 0 3px ${theme.particleB}`,
            }}
            animate={{
              opacity: [0.4, 0.9, 0.4],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />

          <div className="flex items-center gap-2">
            {group.links.map((groupLink) => (
              <a
                key={groupLink.id}
                href={groupLink.href}
                onClick={(e) => onNavClick(e, groupLink.href)}
                className={`nav-font relative text-xs font-medium whitespace-nowrap transition-all duration-300 focus-visible-ring px-2 py-1 rounded hover:scale-105 ${
                  activeSection === groupLink.id
                    ? "text-primary"
                    : "text-text-secondary hover:text-primary"
                }`}
                style={{
                  color:
                    activeSection === groupLink.id
                      ? theme.activeColor
                      : theme.inactiveColor,
                  textShadow:
                    activeSection === groupLink.id
                      ? `0 0 10px ${theme.activeColor}`
                      : "none",
                }}
              >
                {groupLink.label}
                {activeSection === groupLink.id && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full"
                    style={{
                      backgroundColor: theme.activeColor,
                      boxShadow: `0 0 8px ${theme.activeColor}`,
                    }}
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDarkModeError, setShowDarkModeError] = useState(false);
  const activeSection = useScrollSpy(navLinks.map((link) => link.id));

  const handleDarkModeClick = () => {
    setShowDarkModeError(true);
    setTimeout(() => setShowDarkModeError(false), 3000);
  };

  // Handle smooth scroll
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);

    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }

    setIsMobileMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="container-custom">
      <div className="flex items-center justify-between h-20">
        {/* Logo/Name */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, "#home")}
          className="text-2xl font-bold text-gradient focus-visible-ring"
          style={{
            fontFamily: "var(--font-glitch)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          idiovoidi
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5">
          {navLinks.map((link, index) => {
            const prevLink = navLinks[index - 1];
            const isFirstGroupedItem = Boolean(link.group) && !prevLink?.group;

            if (isFirstGroupedItem) {
              return (
                <ConjoinedNavGroups
                  key="nav-groups"
                  groups={collectConsecutiveGroups(index)}
                  activeSection={activeSection}
                  onNavClick={handleNavClick}
                />
              );
            }

            if (link.group) {
              return null;
            }

            // Render non-art items with special styling for Home and Contact
            const isHomeOrContact = link.id === "home" || link.id === "contact";

            return (
              <div key={link.id} className="relative">
                {isHomeOrContact && (
                  <>
                    {/* Lightweight glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg pointer-events-none"
                      style={{
                        background:
                          link.id === "home"
                            ? "radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%)"
                            : "radial-gradient(circle, rgba(34, 197, 94, 0.15), transparent 70%)",
                        filter: "blur(8px)",
                      }}
                      animate={{
                        opacity:
                          activeSection === link.id ? [0.5, 0.8, 0.5] : 0.3,
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </>
                )}

                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`nav-font relative text-sm font-medium whitespace-nowrap transition-all duration-300 focus-visible-ring px-3 py-1.5 rounded-lg ${
                    activeSection === link.id
                      ? "text-primary"
                      : "text-text-secondary hover:text-primary"
                  } ${isHomeOrContact ? "hover:scale-105" : ""}`}
                  style={{
                    color:
                      activeSection === link.id
                        ? link.id === "home"
                          ? "#3b82f6"
                          : link.id === "contact"
                          ? "#22c55e"
                          : "var(--color-primary)"
                        : "var(--color-text-secondary)",
                    textShadow:
                      isHomeOrContact && activeSection === link.id
                        ? link.id === "home"
                          ? "0 0 10px rgba(59, 130, 246, 0.6)"
                          : "0 0 10px rgba(34, 197, 94, 0.6)"
                        : "none",
                    border: isHomeOrContact
                      ? link.id === "home"
                        ? "1px solid rgba(59, 130, 246, 0.2)"
                        : "1px solid rgba(34, 197, 94, 0.2)"
                      : "none",
                    background:
                      isHomeOrContact && activeSection === link.id
                        ? link.id === "home"
                          ? "rgba(59, 130, 246, 0.1)"
                          : "rgba(34, 197, 94, 0.1)"
                        : "transparent",
                  }}
                >
                  {link.label}
                  {activeSection === link.id && !isHomeOrContact && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                      style={{
                        backgroundColor: "var(--color-primary)",
                      }}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              </div>
            );
          })}

          {/* Light Mode Toggle Button (Desktop) - Easter Egg */}
          <button
            onClick={handleDarkModeClick}
            className="relative px-2 py-1 text-xs opacity-40 hover:opacity-70 transition-opacity duration-300 focus-visible-ring rounded flex items-center gap-1"
            aria-label="Toggle light mode"
          >
            <span>☀️</span>
            <span className="text-text-secondary text-[10px]">
              <CursedText text="Light Mode" />
            </span>
          </button>
        </div>

        {/* Light Mode Toggle Button (Mobile) - Easter Egg */}
        <button
          onClick={handleDarkModeClick}
          className="md:hidden relative p-2 text-xs opacity-40 hover:opacity-70 transition-opacity duration-300 focus-visible-ring rounded mr-1"
          aria-label="Toggle light mode"
          title="Light Mode"
        >
          ☀️
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden relative w-10 h-10 flex items-center justify-center focus-visible-ring rounded"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <motion.span
              animate={
                isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.3 }}
              className="w-full h-0.5 bg-current origin-center"
              style={{ backgroundColor: "var(--color-text-primary)" }}
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full h-0.5 bg-current"
              style={{ backgroundColor: "var(--color-text-primary)" }}
            />
            <motion.span
              animate={
                isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
              }
              transition={{ duration: 0.3 }}
              className="w-full h-0.5 bg-current origin-center"
              style={{ backgroundColor: "var(--color-text-primary)" }}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden"
              style={{ top: "80px" }}
              onClick={() => setIsMobileMenuOpen(false)}
              role="button"
              tabIndex={-1}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Escape") setIsMobileMenuOpen(false);
              }}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-20 bottom-0 w-64 bg-surface shadow-2xl md:hidden"
              style={{
                backgroundColor: "var(--color-surface)",
                borderLeft: "1px solid var(--color-border)",
              }}
            >
              <div className="flex flex-col p-6 space-y-6">
                {navLinks.map((link, index) => {
                  const prevLink = navLinks[index - 1];
                  const nextLink = navLinks[index + 1];
                  const groupTheme = link.group
                    ? GROUP_THEME[link.group]
                    : null;
                  const isGroupStart =
                    Boolean(link.group) && prevLink?.group !== link.group;
                  const isGroupEnd =
                    Boolean(link.group) && nextLink?.group !== link.group;

                  return (
                    <div key={link.id} className="relative">
                      {isGroupStart && groupTheme && (
                        <div className="mb-3 pb-2 relative">
                          <div
                            className="text-xs uppercase tracking-wider mb-2 flex items-center gap-2"
                            style={{ color: groupTheme.mobileAccent }}
                          >
                            <motion.span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                background: groupTheme.particleA,
                                boxShadow: `0 0 6px ${groupTheme.particleA}`,
                              }}
                              animate={{
                                opacity: [0.4, 1, 0.4],
                                scale: [0.8, 1.2, 0.8],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            {groupTheme.mobileLabel}
                            <motion.span
                              className="w-1 h-1 rounded-full"
                              style={{
                                background: groupTheme.particleB,
                                boxShadow: `0 0 4px ${groupTheme.particleB}`,
                              }}
                              animate={{
                                opacity: [0.3, 0.9, 0.3],
                                scale: [0.7, 1.3, 0.7],
                              }}
                              transition={{
                                duration: 2.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5,
                              }}
                            />
                          </div>
                          <div
                            className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${groupTheme.particleA}, ${groupTheme.particleB}, ${groupTheme.particleA})`,
                              boxShadow: `0 0 6px ${groupTheme.particleA}`,
                              opacity: 0.5,
                            }}
                          />
                        </div>
                      )}

                      <motion.a
                        href={link.href}
                        onClick={(e) => handleNavClick(e, link.href)}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`block text-lg font-medium transition-all duration-200 focus-visible-ring rounded-lg px-3 py-2 ${
                          activeSection === link.id
                            ? "text-primary"
                            : "text-text-secondary hover:text-primary"
                        } ${link.group ? "pl-6 relative" : ""}`}
                        style={{
                          color:
                            activeSection === link.id
                              ? link.id === "home"
                                ? "#3b82f6"
                                : link.id === "contact"
                                ? "#22c55e"
                                : groupTheme?.activeColor ??
                                  "var(--color-primary)"
                              : groupTheme?.inactiveColor ??
                                "var(--color-text-secondary)",
                          textShadow:
                            link.group && activeSection === link.id
                              ? `0 0 8px ${groupTheme?.activeColor}`
                              : link.id === "home" && activeSection === link.id
                              ? "0 0 10px rgba(59, 130, 246, 0.6)"
                              : link.id === "contact" &&
                                activeSection === link.id
                              ? "0 0 10px rgba(34, 197, 94, 0.6)"
                              : "none",
                          border:
                            link.id === "home" || link.id === "contact"
                              ? link.id === "home"
                                ? "1px solid rgba(59, 130, 246, 0.2)"
                                : "1px solid rgba(34, 197, 94, 0.2)"
                              : "none",
                          background:
                            (link.id === "home" || link.id === "contact") &&
                            activeSection === link.id
                              ? link.id === "home"
                                ? "rgba(59, 130, 246, 0.1)"
                                : "rgba(34, 197, 94, 0.1)"
                              : "transparent",
                        }}
                      >
                        {link.group && groupTheme && (
                          <span
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                            style={{
                              background:
                                activeSection === link.id
                                  ? groupTheme.activeColor
                                  : groupTheme.inactiveColor,
                              boxShadow:
                                activeSection === link.id
                                  ? `0 0 6px ${groupTheme.activeColor}`
                                  : "none",
                              opacity: 0.7,
                            }}
                          />
                        )}

                        {link.id === "home" && (
                          <motion.span
                            className="inline-block mr-2"
                            animate={{
                              scale:
                                activeSection === link.id ? [1, 1.2, 1] : 1,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            🏠
                          </motion.span>
                        )}
                        {link.id === "contact" && (
                          <motion.span
                            className="inline-block mr-2"
                            animate={{
                              scale:
                                activeSection === link.id ? [1, 1.2, 1] : 1,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            💬
                          </motion.span>
                        )}

                        {link.label}
                        {activeSection === link.id && (
                          <motion.div
                            layoutId="activeSectionMobile"
                            className="h-0.5 bg-primary mt-1"
                            style={{
                              backgroundColor:
                                groupTheme?.activeColor ??
                                "var(--color-primary)",
                              boxShadow: link.group
                                ? `0 0 6px ${groupTheme?.activeColor}`
                                : "none",
                            }}
                          />
                        )}
                      </motion.a>

                      {isGroupEnd && <div className="h-4" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Glitchy Error Message Modal */}
      <AnimatePresence>
        {showDarkModeError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 100 }}
          >
            <motion.div
              className="relative bg-black border-2 border-red-500 rounded-lg p-8 shadow-2xl pointer-events-auto"
              style={{
                boxShadow:
                  "0 0 40px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(239, 68, 68, 0.2)",
              }}
              animate={{
                x: [0, -2, 2, -2, 2, 0],
                y: [0, 2, -2, 2, -2, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            >
              {/* Glitch overlay effect */}
              <motion.div
                className="absolute inset-0 bg-red-500 opacity-10 rounded-lg"
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 0.2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <motion.p
                className="text-2xl font-bold text-red-500 text-center relative z-10"
                style={{
                  fontFamily: "monospace",
                  textShadow:
                    "2px 2px 0 rgba(0, 255, 255, 0.3), -2px -2px 0 rgba(255, 0, 255, 0.3)",
                  letterSpacing: "0.1em",
                }}
                animate={{
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 0.15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                E̷R̴R̵O̴R̸:̸ ̶T̶H̴E̷R̴E̸ ̵I̶S̶ ̶O̷N̷L̶Y̴ ̶D̵A̴R̵K̷N̶E̸S̶S̴ ̸H̷E̷R̸E̶!
              </motion.p>

              {/* Scanline effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.1) 2px, rgba(255, 0, 0, 0.1) 4px)",
                }}
                animate={{
                  y: [0, 8],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
