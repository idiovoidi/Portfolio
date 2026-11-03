import type React from "react";
import { useEffect, useState } from "react";
import Navigation from "./Navigation";

// "idiovo" tiles into idiovoidiovoidi…, so each word shares its "i" with the next
const DIVIDER_TEXT = "idiovo".repeat(40);

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      style={{
        backgroundColor: isScrolled ? "rgba(6, 6, 12, 0.94)" : "transparent",
      }}
    >
      <div className="nav-texture" aria-hidden="true" />
      <Navigation />
      <div className="nav-divider" aria-hidden="true">
        <div className="nav-divider-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="nav-divider-run">
              {DIVIDER_TEXT}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
