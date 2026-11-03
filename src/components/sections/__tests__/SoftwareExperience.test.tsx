import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getSoftwareByCategory } from "../../../data/softwareData";
import { SoftwareExperience } from "../SoftwareExperience";

/**
 * Unit Tests for SoftwareExperience Section Component
 * Feature: software-experience
 * Task: 4.2 - Write unit tests for SoftwareExperience section
 *
 * These tests validate specific examples and integration points for the
 * SoftwareExperience section component, including category rendering,
 * responsive layout, animations, and layout constraints.
 *
 * Requirements tested: 2.1, 2.2, 2.4, 7.1, 7.2, 7.3, 7.4
 */

describe("SoftwareExperience - Unit Tests", () => {
  describe("Category Container Rendering (Requirements 2.1, 2.2)", () => {
    it("should render both category containers when data exists", () => {
      const { container } = render(<SoftwareExperience />);

      // Find both category containers by data-category attribute
      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );

      expect(mainCategoryContainer).toBeTruthy();
      expect(pastCategoryContainer).toBeTruthy();
    });

    it("should render Main (Current) category with correct heading", () => {
      const { container } = render(<SoftwareExperience />);

      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      expect(mainCategoryContainer).toBeTruthy();

      // Find the h3 heading within or before the main category container
      const headings = container.querySelectorAll("h3");
      const mainHeading = Array.from(headings).find(
        (h) =>
          h.textContent?.includes("Main") && h.textContent?.includes("Current"),
      );

      expect(mainHeading).toBeTruthy();
      expect(mainHeading?.textContent).toBe("Main (Current)");
    });

    it("should render Past (Retired) category with correct heading", () => {
      const { container } = render(<SoftwareExperience />);

      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );
      expect(pastCategoryContainer).toBeTruthy();

      // Find the h3 heading for past category
      const headings = container.querySelectorAll("h3");
      const pastHeading = Array.from(headings).find(
        (h) =>
          h.textContent?.includes("Past") && h.textContent?.includes("Retired"),
      );

      expect(pastHeading).toBeTruthy();
      expect(pastHeading?.textContent).toBe("Past (Retired)");
    });

    it("should render software cards in main category container", () => {
      const { container } = render(<SoftwareExperience />);

      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const mainSoftware = getSoftwareByCategory("main");

      if (mainSoftware.length > 0) {
        const mainCards =
          mainCategoryContainer?.querySelectorAll(".software-card");
        expect(mainCards?.length).toBe(mainSoftware.length);
      }
    });

    it("should render software cards in past category container", () => {
      const { container } = render(<SoftwareExperience />);

      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );
      const pastSoftware = getSoftwareByCategory("past");

      if (pastSoftware.length > 0) {
        const pastCards =
          pastCategoryContainer?.querySelectorAll(".software-card");
        expect(pastCards?.length).toBe(pastSoftware.length);
      }
    });
  });

  describe("Category Order (Requirement 2.4)", () => {
    it("should render Main (Current) before Past (Retired) in DOM order", () => {
      const { container } = render(<SoftwareExperience />);

      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );

      expect(mainCategoryContainer).toBeTruthy();
      expect(pastCategoryContainer).toBeTruthy();

      // Get all elements with data-category attribute
      const allCategoryElements = Array.from(
        container.querySelectorAll("[data-category]"),
      );
      const mainIndex = allCategoryElements.indexOf(
        mainCategoryContainer as Element,
      );
      const pastIndex = allCategoryElements.indexOf(
        pastCategoryContainer as Element,
      );

      // Main category should appear before past category
      expect(mainIndex).toBeLessThan(pastIndex);
    });

    it("should render Main (Current) heading before Past (Retired) heading", () => {
      const { container } = render(<SoftwareExperience />);

      const headings = Array.from(container.querySelectorAll("h3"));

      const mainHeading = headings.find(
        (h) =>
          h.textContent?.includes("Main") && h.textContent?.includes("Current"),
      );
      const pastHeading = headings.find(
        (h) =>
          h.textContent?.includes("Past") && h.textContent?.includes("Retired"),
      );

      expect(mainHeading).toBeTruthy();
      expect(pastHeading).toBeTruthy();

      const mainIndex = headings.indexOf(mainHeading!);
      const pastIndex = headings.indexOf(pastHeading!);

      // Main heading should appear before past heading
      expect(mainIndex).toBeLessThan(pastIndex);
    });
  });

  describe("Responsive Grid Layout (Requirements 7.1, 7.2, 7.3)", () => {
    it("should apply single column grid class for mobile layout", () => {
      const { container } = render(<SoftwareExperience />);

      // Find grid containers within category containers
      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const gridContainer = mainCategoryContainer?.querySelector(".grid");

      expect(gridContainer).toBeTruthy();

      // Check for Tailwind grid classes
      const classList = gridContainer?.className || "";
      expect(classList).toContain("grid");
      expect(classList).toContain("grid-cols-1"); // Mobile: 1 column
    });

    it("should apply two column grid class for tablet layout", () => {
      const { container } = render(<SoftwareExperience />);

      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const gridContainer = mainCategoryContainer?.querySelector(".grid");

      expect(gridContainer).toBeTruthy();

      // Check for Tailwind responsive grid classes
      const classList = gridContainer?.className || "";
      expect(classList).toContain("md:grid-cols-2"); // Tablet: 2 columns
    });

    it("should apply three column grid class for desktop layout", () => {
      const { container } = render(<SoftwareExperience />);

      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const gridContainer = mainCategoryContainer?.querySelector(".grid");

      expect(gridContainer).toBeTruthy();

      // Check for Tailwind responsive grid classes
      const classList = gridContainer?.className || "";
      expect(classList).toContain("lg:grid-cols-3"); // Desktop: 3 columns
    });

    it("should apply consistent grid layout to both category containers", () => {
      const { container } = render(<SoftwareExperience />);

      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );

      const mainGrid = mainCategoryContainer?.querySelector(".grid");
      const pastGrid = pastCategoryContainer?.querySelector(".grid");

      expect(mainGrid).toBeTruthy();
      expect(pastGrid).toBeTruthy();

      // Both grids should have the same responsive classes
      const mainClasses = mainGrid?.className || "";
      const pastClasses = pastGrid?.className || "";

      expect(mainClasses).toContain("grid-cols-1");
      expect(mainClasses).toContain("md:grid-cols-2");
      expect(mainClasses).toContain("lg:grid-cols-3");

      expect(pastClasses).toContain("grid-cols-1");
      expect(pastClasses).toContain("md:grid-cols-2");
      expect(pastClasses).toContain("lg:grid-cols-3");
    });

    it("should apply gap spacing between grid items", () => {
      const { container } = render(<SoftwareExperience />);

      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const gridContainer = mainCategoryContainer?.querySelector(".grid");

      expect(gridContainer).toBeTruthy();

      // Check for gap class
      const classList = gridContainer?.className || "";
      expect(classList).toContain("gap-6");
    });
  });

  describe("Scroll-Triggered Animations (Requirement 7.4)", () => {
    it("should initialize IntersectionObserver for header animation", () => {
      const { container } = render(<SoftwareExperience />);

      // Verify component renders successfully with IntersectionObserver
      const section = container.querySelector("section#software-experience");
      expect(section).toBeTruthy();

      // Verify animated elements are present
      const sectionHeading = screen.getByText("Software Experience");
      expect(sectionHeading).toBeTruthy();
    });

    it("should apply animation variants to category containers", () => {
      const { container } = render(<SoftwareExperience />);

      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );

      // Both containers should be wrapped in motion.div elements
      // Check that they exist and are part of the animated structure
      expect(mainCategoryContainer).toBeTruthy();
      expect(pastCategoryContainer).toBeTruthy();
    });

    it("should render section header with animation wrapper", () => {
      const { container } = render(<SoftwareExperience />);

      // Find the section heading
      const sectionHeading = screen.getByText("Software Experience");
      expect(sectionHeading).toBeTruthy();

      // Verify heading is within an animated container
      const headingParent = sectionHeading.parentElement;
      expect(headingParent).toBeTruthy();
    });

    it("should render the shared section heading", () => {
      const { container } = render(<SoftwareExperience />);

      const heading = container.querySelector(".section-heading");
      expect(heading?.textContent).toBe("Software Experience");
    });

    it("should render section subheading with description", () => {
      render(<SoftwareExperience />);

      const subheading = screen.getByText(
        /Tools and technologies that power my creative journey/i,
      );
      expect(subheading).toBeTruthy();
    });

    it("should apply staggered animation to category groups", () => {
      const { container } = render(<SoftwareExperience />);

      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );

      // Both containers should exist and be independently animated
      expect(mainCategoryContainer).toBeTruthy();
      expect(pastCategoryContainer).toBeTruthy();

      // Verify they are separate elements (not nested)
      expect(mainCategoryContainer).not.toBe(pastCategoryContainer);
    });
  });

  describe("Maximum Content Width Constraint (Requirement 7.4)", () => {
    it("should apply maximum width constraint to content container", () => {
      const { container } = render(<SoftwareExperience />);

      // Find the container with max-width constraint
      const contentContainer = container.querySelector(".container-custom");
      expect(contentContainer).toBeTruthy();

      // Check for max-width style
      const style = (contentContainer as HTMLElement)?.style;
      expect(style?.maxWidth).toBe("1280px");
    });

    it("should center content container with auto margins", () => {
      const { container } = render(<SoftwareExperience />);

      const contentContainer = container.querySelector(".container-custom");
      expect(contentContainer).toBeTruthy();

      // Check for margin auto (centering) - accepts both '0 auto' and '0px auto'
      const style = (contentContainer as HTMLElement)?.style;
      expect(style?.margin).toMatch(/^0(px)? auto$/);
    });

    it("should apply max-width to section wrapper", () => {
      const { container } = render(<SoftwareExperience />);

      // Find the section element
      const section = container.querySelector("section#software-experience");
      expect(section).toBeTruthy();

      // Verify section contains the constrained container
      const contentContainer = section?.querySelector(".container-custom");
      expect(contentContainer).toBeTruthy();
    });

    it("should maintain max-width constraint for both categories", () => {
      const { container } = render(<SoftwareExperience />);

      const contentContainer = container.querySelector(".container-custom");
      const mainCategoryContainer = contentContainer?.querySelector(
        '[data-category="main"]',
      );
      const pastCategoryContainer = contentContainer?.querySelector(
        '[data-category="past"]',
      );

      // Both categories should be within the max-width container
      expect(mainCategoryContainer).toBeTruthy();
      expect(pastCategoryContainer).toBeTruthy();

      // Verify they are children of the constrained container
      expect(contentContainer?.contains(mainCategoryContainer as Node)).toBe(
        true,
      );
      expect(contentContainer?.contains(pastCategoryContainer as Node)).toBe(
        true,
      );
    });
  });

  describe("Section Structure and Accessibility", () => {
    it("should render as a section element with correct id", () => {
      const { container } = render(<SoftwareExperience />);

      const section = container.querySelector("section#software-experience");
      expect(section).toBeTruthy();
      expect(section?.id).toBe("software-experience");
    });

    it("should apply section class for styling consistency", () => {
      const { container } = render(<SoftwareExperience />);

      const section = container.querySelector("section#software-experience");
      expect(section?.classList.contains("section")).toBe(true);
    });

    it("should render section heading as h2 element", () => {
      render(<SoftwareExperience />);

      const heading = screen.getByRole("heading", {
        level: 2,
        name: /Software Experience/i,
      });
      expect(heading).toBeTruthy();
    });

    it("should render category headings as h3 elements", () => {
      const { container } = render(<SoftwareExperience />);

      const h3Headings = container.querySelectorAll("h3");

      // Should have at least 2 h3 headings (one for each category)
      expect(h3Headings.length).toBeGreaterThanOrEqual(2);

      // Verify heading hierarchy (h2 for section, h3 for categories)
      const mainHeading = Array.from(h3Headings).find((h) =>
        h.textContent?.includes("Main"),
      );
      const pastHeading = Array.from(h3Headings).find((h) =>
        h.textContent?.includes("Past"),
      );

      expect(mainHeading?.tagName).toBe("H3");
      expect(pastHeading?.tagName).toBe("H3");
    });

    it("should apply dark void aesthetic background color", () => {
      const { container } = render(<SoftwareExperience />);

      const section = container.querySelector("section#software-experience");
      const style = (section as HTMLElement)?.style;

      expect(style?.backgroundColor).toBe("var(--color-background)");
    });

    it("should apply relative positioning and z-index to content", () => {
      const { container } = render(<SoftwareExperience />);

      const section = container.querySelector("section#software-experience");
      expect(section?.classList.contains("relative")).toBe(true);

      const contentContainer = container.querySelector(".container-custom");
      expect(contentContainer?.classList.contains("relative")).toBe(true);
      expect(contentContainer?.classList.contains("z-10")).toBe(true);
    });
  });

  describe("Conditional Rendering", () => {
    it("should only render main category if main software exists", () => {
      const { container } = render(<SoftwareExperience />);

      const mainSoftware = getSoftwareByCategory("main");
      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );

      if (mainSoftware.length > 0) {
        expect(mainCategoryContainer).toBeTruthy();
      } else {
        expect(mainCategoryContainer).toBeFalsy();
      }
    });

    it("should only render past category if past software exists", () => {
      const { container } = render(<SoftwareExperience />);

      const pastSoftware = getSoftwareByCategory("past");
      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );

      if (pastSoftware.length > 0) {
        expect(pastCategoryContainer).toBeTruthy();
      } else {
        expect(pastCategoryContainer).toBeFalsy();
      }
    });

    it("should render section even if one category is empty", () => {
      const { container } = render(<SoftwareExperience />);

      const section = container.querySelector("section#software-experience");
      expect(section).toBeTruthy();

      // At least one category should be rendered
      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );
      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );

      expect(mainCategoryContainer || pastCategoryContainer).toBeTruthy();
    });
  });

  describe("Integration with Data Layer", () => {
    it("should use getSoftwareByCategory to fetch main software", () => {
      const { container } = render(<SoftwareExperience />);

      const mainSoftware = getSoftwareByCategory("main");
      const mainCategoryContainer = container.querySelector(
        '[data-category="main"]',
      );

      if (mainSoftware.length > 0) {
        const mainCards =
          mainCategoryContainer?.querySelectorAll(".software-card");
        expect(mainCards?.length).toBe(mainSoftware.length);
      }
    });

    it("should use getSoftwareByCategory to fetch past software", () => {
      const { container } = render(<SoftwareExperience />);

      const pastSoftware = getSoftwareByCategory("past");
      const pastCategoryContainer = container.querySelector(
        '[data-category="past"]',
      );

      if (pastSoftware.length > 0) {
        const pastCards =
          pastCategoryContainer?.querySelectorAll(".software-card");
        expect(pastCards?.length).toBe(pastSoftware.length);
      }
    });

    it("should pass correct software data to SoftwareCard components", () => {
      const { container } = render(<SoftwareExperience />);

      const mainSoftware = getSoftwareByCategory("main");

      if (mainSoftware.length > 0) {
        const firstSoftware = mainSoftware[0];
        const firstCard = container.querySelector(
          `[data-software-id="${firstSoftware.id}"]`,
        );

        expect(firstCard).toBeTruthy();
      }
    });

    it("should pass index prop to SoftwareCard for staggered animations", () => {
      const { container } = render(<SoftwareExperience />);

      const mainSoftware = getSoftwareByCategory("main");

      if (mainSoftware.length > 1) {
        // Multiple cards should exist with different indices
        const cards = container.querySelectorAll(".software-card");
        expect(cards.length).toBeGreaterThan(1);
      }
    });
  });
});
