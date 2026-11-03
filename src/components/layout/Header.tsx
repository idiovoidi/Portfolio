import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";

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
    </header>
  );
};

export default Header;
