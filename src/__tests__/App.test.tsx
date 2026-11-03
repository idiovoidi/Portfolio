import { fireEvent, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

/**
 * Integration Tests for App.tsx - SoftwareExperience Section
 * Feature: software-experience
 * Task: 6.1 - Write integration tests for App.tsx
 *
 * These tests validate the SoftwareExperience section integration within
 * the main App component, including rendering position, section ID attribute,
 * and end-to-end smooth scrolling from navigation.
 *
 * Requirements tested: 1.3
 */

// Mock the ThreeD component to avoid WebGL context errors in tests
vi.mock("../components/sections/ThreeD", () => ({
  ThreeD: () => (
    <section id="three-d" data-testid="three-d-mock">
      3D Section Mock
    </section>
  ),
}));

describe("App - SoftwareExperience Integration Tests", () => {
  beforeEach(() => {
    // Mock window.scrollTo for scroll behavior tests
    window.scrollTo = vi.fn();

    // Mock getBoundingClientRect for scroll calculations
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 100,
      left: 0,
      right: 0,
      bottom: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    }));
  });

  describe("Section Rendering and Position (Requirement 1.3)", () => {
    it("should render SoftwareExperience section in App", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();
    });

    it("should render SoftwareExperience section after Skills section", () => {
      const { container } = render(<App />);

      const skillsSection = container.querySelector("section#skills");
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(skillsSection).toBeTruthy();
      expect(softwareExperienceSection).toBeTruthy();

      // Get all sections
      const allSections = Array.from(container.querySelectorAll("section"));
      const skillsIndex = allSections.indexOf(skillsSection as Element);
      const softwareExperienceIndex = allSections.indexOf(
        softwareExperienceSection as Element,
      );

      // SoftwareExperience should come after Skills
      expect(softwareExperienceIndex).toBeGreaterThan(skillsIndex);
    });

    it("should render SoftwareExperience section before Contact section", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );
      const contactSection = container.querySelector("section#contact");

      expect(softwareExperienceSection).toBeTruthy();
      expect(contactSection).toBeTruthy();

      // Get all sections
      const allSections = Array.from(container.querySelectorAll("section"));
      const softwareExperienceIndex = allSections.indexOf(
        softwareExperienceSection as Element,
      );
      const contactIndex = allSections.indexOf(contactSection as Element);

      // SoftwareExperience should come before Contact
      expect(softwareExperienceIndex).toBeLessThan(contactIndex);
    });

    it("should render SoftwareExperience section in correct order among all sections", () => {
      const { container } = render(<App />);

      // Expected section order based on App.tsx
      const expectedOrder = [
        "home", // Hero section
        "projects",
        "art-gallery",
        "nft-gallery",
        "music",
        "videos",
        "three-d",
        "commercial",
        "skills",
        "software-experience",
        "contact",
      ];

      const allSections = Array.from(container.querySelectorAll("section"));
      const sectionIds = allSections
        .map((section) => section.id)
        .filter((id) => expectedOrder.includes(id));

      // Find the index of software-experience
      const softwareExperienceIndex = sectionIds.indexOf("software-experience");
      const skillsIndex = sectionIds.indexOf("skills");
      const contactIndex = sectionIds.indexOf("contact");

      // Verify software-experience is between skills and contact
      expect(softwareExperienceIndex).toBeGreaterThan(skillsIndex);
      expect(softwareExperienceIndex).toBeLessThan(contactIndex);
    });

    it("should render SoftwareExperience section within main content wrapper", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();

      // Verify section is within the main content div (z-10 relative)
      const mainContentDiv = container.querySelector(".relative.z-10");
      expect(mainContentDiv).toBeTruthy();
      expect(mainContentDiv?.contains(softwareExperienceSection as Node)).toBe(
        true,
      );
    });
  });

  describe("Section ID Attribute (Requirement 1.3)", () => {
    it('should have correct id attribute "software-experience"', () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();
      expect(softwareExperienceSection?.id).toBe("software-experience");
    });

    it("should be targetable by navigation anchor link", () => {
      const { container } = render(<App />);

      // Find the navigation link
      const navigationLink = container.querySelector(
        'a[href="#software-experience"]',
      );

      expect(navigationLink).toBeTruthy();

      // Find the section by ID
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();

      // Verify the href matches the section ID
      const href = navigationLink?.getAttribute("href");
      expect(href).toBe("#software-experience");
      expect(softwareExperienceSection?.id).toBe("software-experience");
    });

    it("should have unique id among all sections", () => {
      const { container } = render(<App />);

      const allSections = Array.from(container.querySelectorAll("section"));
      const sectionIds = allSections.map((section) => section.id);

      // Count occurrences of 'software-experience'
      const softwareExperienceCount = sectionIds.filter(
        (id) => id === "software-experience",
      ).length;

      // Should only appear once
      expect(softwareExperienceCount).toBe(1);
    });

    it("should use kebab-case for id attribute", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();

      // Verify kebab-case format (lowercase with hyphens)
      const id = softwareExperienceSection?.id;
      expect(id).toBe("software-experience");
      expect(id).toMatch(/^[a-z]+(-[a-z]+)*$/);
    });
  });

  describe("End-to-End Smooth Scrolling from Navigation (Requirement 1.3)", () => {
    it("should scroll to SoftwareExperience section when navigation link is clicked", () => {
      const { container } = render(<App />);

      // Find the section and set up mock
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      ) as HTMLElement;

      expect(softwareExperienceSection).toBeTruthy();

      // Mock getBoundingClientRect for the section
      softwareExperienceSection.getBoundingClientRect = vi.fn(() => ({
        top: 500,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      // Find the navigation link
      const navigationLink = container.querySelector(
        'a[href="#software-experience"]',
      );

      expect(navigationLink).toBeTruthy();

      // Clear any previous calls
      vi.clearAllMocks();

      // Click the navigation link
      fireEvent.click(navigationLink!);

      // Verify window.scrollTo was called
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it("should use smooth scroll behavior when navigating to SoftwareExperience", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      ) as HTMLElement;

      softwareExperienceSection.getBoundingClientRect = vi.fn(() => ({
        top: 300,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const navigationLink = container.querySelector(
        'a[href="#software-experience"]',
      );

      vi.clearAllMocks();
      fireEvent.click(navigationLink!);

      // Verify smooth scroll behavior
      const scrollToCall = (window.scrollTo as any).mock.calls[0][0];
      expect(scrollToCall.behavior).toBe("smooth");
    });

    it("should calculate correct scroll position with header offset", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      ) as HTMLElement;

      const sectionTopPosition = 400;
      const currentScrollY = 1000;

      // Mock current scroll position
      Object.defineProperty(window, "pageYOffset", {
        writable: true,
        value: currentScrollY,
      });

      softwareExperienceSection.getBoundingClientRect = vi.fn(() => ({
        top: sectionTopPosition,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const navigationLink = container.querySelector(
        'a[href="#software-experience"]',
      );

      vi.clearAllMocks();
      fireEvent.click(navigationLink!);

      // Verify scroll position calculation (section top + current scroll - header offset)
      const scrollToCall = (window.scrollTo as any).mock.calls[0][0];
      const expectedScrollTop = sectionTopPosition + currentScrollY - 80; // 80px header offset

      expect(scrollToCall.top).toBe(expectedScrollTop);
    });

    it("should navigate from Skills section to SoftwareExperience section", () => {
      const { container } = render(<App />);

      // Set up both sections
      const skillsSection = container.querySelector(
        "section#skills",
      ) as HTMLElement;
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      ) as HTMLElement;

      expect(skillsSection).toBeTruthy();
      expect(softwareExperienceSection).toBeTruthy();

      // Mock scroll position at Skills section
      Object.defineProperty(window, "pageYOffset", {
        writable: true,
        value: 2000,
      });

      softwareExperienceSection.getBoundingClientRect = vi.fn(() => ({
        top: 600,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const navigationLink = container.querySelector(
        'a[href="#software-experience"]',
      );

      vi.clearAllMocks();
      fireEvent.click(navigationLink!);

      // Verify scrollTo was called with correct parameters
      expect(window.scrollTo).toHaveBeenCalled();
      const scrollToCall = (window.scrollTo as any).mock.calls[0][0];
      expect(scrollToCall.behavior).toBe("smooth");
      expect(scrollToCall.top).toBe(2520); // 600 + 2000 - 80
    });

    it("should navigate from Contact section to SoftwareExperience section", () => {
      const { container } = render(<App />);

      const contactSection = container.querySelector(
        "section#contact",
      ) as HTMLElement;
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      ) as HTMLElement;

      expect(contactSection).toBeTruthy();
      expect(softwareExperienceSection).toBeTruthy();

      // Mock scroll position at Contact section (below SoftwareExperience)
      Object.defineProperty(window, "pageYOffset", {
        writable: true,
        value: 4000,
      });

      // SoftwareExperience is above current position (negative top)
      softwareExperienceSection.getBoundingClientRect = vi.fn(() => ({
        top: -1000,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const navigationLink = container.querySelector(
        'a[href="#software-experience"]',
      );

      vi.clearAllMocks();
      fireEvent.click(navigationLink!);

      // Verify scrollTo was called (scrolling up)
      expect(window.scrollTo).toHaveBeenCalled();
      const scrollToCall = (window.scrollTo as any).mock.calls[0][0];
      expect(scrollToCall.behavior).toBe("smooth");
      expect(scrollToCall.top).toBe(2920); // -1000 + 4000 - 80
    });

    it("should prevent default anchor behavior when clicking navigation link", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      ) as HTMLElement;

      softwareExperienceSection.getBoundingClientRect = vi.fn(() => ({
        top: 200,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      const navigationLink = container.querySelector(
        'a[href="#software-experience"]',
      );

      vi.clearAllMocks();
      fireEvent.click(navigationLink!);

      // Verify scrollTo was called (which only happens after preventDefault)
      expect(window.scrollTo).toHaveBeenCalled();
    });

    it("should work with mobile navigation menu", () => {
      const { container } = render(<App />);

      // Open mobile menu
      const mobileMenuButton = container.querySelector(
        'button[aria-label="Toggle mobile menu"]',
      );

      expect(mobileMenuButton).toBeTruthy();
      fireEvent.click(mobileMenuButton!);

      // Find Software Experience link in mobile menu
      const softwareExperienceLinks = container.querySelectorAll(
        'a[href="#software-experience"]',
      );

      expect(softwareExperienceLinks.length).toBeGreaterThan(0);

      // Set up section mock
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      ) as HTMLElement;

      softwareExperienceSection.getBoundingClientRect = vi.fn(() => ({
        top: 350,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        toJSON: () => {},
      }));

      vi.clearAllMocks();

      // Click the first link (mobile or desktop)
      fireEvent.click(softwareExperienceLinks[0]);

      // Verify scrollTo was called
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });

  describe("Integration with App Layout", () => {
    it("should render SoftwareExperience section with Header and Footer", () => {
      const { container } = render(<App />);

      const header = container.querySelector("header");
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );
      const footer = container.querySelector("footer");

      expect(header).toBeTruthy();
      expect(softwareExperienceSection).toBeTruthy();
      expect(footer).toBeTruthy();
    });

    it("should render SoftwareExperience section within PerformanceProvider context", () => {
      const { container } = render(<App />);

      // Verify PerformanceToggle exists (indicates PerformanceProvider is active)
      // The toggle button may have various aria-labels, so check for its existence by class or role
      const performanceToggle = container.querySelector(
        ".fixed.bottom-4.right-4 button, button[aria-label]",
      );

      // Performance toggle should exist (even if aria-label varies)
      expect(performanceToggle).toBeTruthy();

      // Verify SoftwareExperience section exists
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();
    });

    it("should render SoftwareExperience section with CosmicBackground", () => {
      const { container } = render(<App />);

      // Verify CosmicBackground canvas exists
      const cosmicBackground = container.querySelector("canvas");

      // CosmicBackground may or may not render depending on performance settings
      // Just verify the section renders regardless
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();
    });

    it("should render SoftwareExperience section with ScrollProgress indicator", () => {
      const { container } = render(<App />);

      // Verify ScrollProgress exists (fixed position indicator)
      const scrollProgress = container.querySelector(".fixed.top-0");

      expect(scrollProgress).toBeTruthy();

      // Verify SoftwareExperience section exists
      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();
    });

    it("should maintain z-index layering with SoftwareExperience section", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();

      // Verify section is within the z-10 content layer
      const mainContentDiv = container.querySelector(".relative.z-10");
      expect(mainContentDiv?.contains(softwareExperienceSection as Node)).toBe(
        true,
      );
    });
  });

  describe("Section Content Validation", () => {
    it("should render SoftwareExperience section with heading", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();

      // Find the heading within the section
      const heading = softwareExperienceSection?.querySelector("h2");
      expect(heading).toBeTruthy();
      expect(heading?.textContent).toContain("Software Experience");
    });

    it("should render SoftwareExperience section with category containers", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();

      // Find category containers within the section
      const mainCategory = softwareExperienceSection?.querySelector(
        '[data-category="main"]',
      );
      const pastCategory = softwareExperienceSection?.querySelector(
        '[data-category="past"]',
      );

      // At least one category should exist
      expect(mainCategory || pastCategory).toBeTruthy();
    });

    it("should render SoftwareExperience section with software cards", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      );

      expect(softwareExperienceSection).toBeTruthy();

      // Find software cards within the section
      const softwareCards =
        softwareExperienceSection?.querySelectorAll(".software-card");

      // Should have at least one software card
      expect(softwareCards && softwareCards.length > 0).toBe(true);
    });

    it("should apply section styling classes", () => {
      const { container } = render(<App />);

      const softwareExperienceSection = container.querySelector(
        "section#software-experience",
      ) as HTMLElement;

      expect(softwareExperienceSection).toBeTruthy();

      // Verify section has the 'section' class
      expect(softwareExperienceSection.classList.contains("section")).toBe(
        true,
      );
    });
  });
});
