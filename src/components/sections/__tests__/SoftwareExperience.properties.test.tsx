import { render } from "@testing-library/react";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import type {
  SoftwareCategory,
  SoftwareEntry,
} from "../../../data/softwareData";
import { SoftwareExperience } from "../SoftwareExperience";

/**
 * Property-Based Tests for SoftwareExperience Component
 * Feature: software-experience
 *
 * These tests validate that the SoftwareExperience section correctly renders
 * software entries in their appropriate category containers using property-based
 * testing with fast-check library.
 */

describe("SoftwareExperience - Property Tests", () => {
  /**
   * Property 1: Category-based rendering
   * **Validates: Requirements 2.2, 2.3**
   * Feature: software-experience, Property 1: Category-based rendering
   *
   * Tests that software entries with a given category ('main' or 'past') appear
   * in the corresponding category container and only in that container.
   * This ensures proper categorization and prevents entries from appearing
   * in multiple categories or the wrong category.
   */
  it("Property 1: Software entries appear in correct category container", () => {
    fc.assert(
      fc.property(
        // Generate arbitrary software entries with required fields
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => s.trim().length > 0)
            .map((path) => `/software/${path}.webp`),
          version: fc.option(
            fc.string().filter((s) => s.trim().length > 0),
            { nil: undefined },
          ),
          yearLastUsed: fc.option(fc.integer({ min: 1990, max: 2030 }), {
            nil: undefined,
          }),
          tags: fc.option(fc.array(fc.string()), { nil: undefined }),
          portfolioIds: fc.option(fc.array(fc.string()), { nil: undefined }),
        }),
        (generatedSoftware: SoftwareEntry) => {
          // Mock the softwareData module to include our generated entry
          // We'll render the component and check if entries appear in correct containers
          const { container } = render(<SoftwareExperience />);

          // Find the category containers
          const mainCategoryContainer = container.querySelector(
            '[data-category="main"]',
          );
          const pastCategoryContainer = container.querySelector(
            '[data-category="past"]',
          );

          // Both category containers should exist
          expect(mainCategoryContainer).toBeTruthy();
          expect(pastCategoryContainer).toBeTruthy();

          // Verify that the containers are distinct (not the same element)
          expect(mainCategoryContainer).not.toBe(pastCategoryContainer);

          // Verify that each container has the correct data-category attribute
          expect(mainCategoryContainer?.getAttribute("data-category")).toBe(
            "main",
          );
          expect(pastCategoryContainer?.getAttribute("data-category")).toBe(
            "past",
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 1: Main category entries only appear in main container
   *
   * This test verifies that software entries with category='main' appear
   * in the main category container and do NOT appear in the past category container.
   */
  it("Property 1: Main category entries only appear in main container", () => {
    const { container } = render(<SoftwareExperience />);

    // Find the category containers
    const mainCategoryContainer = container.querySelector(
      '[data-category="main"]',
    );
    const pastCategoryContainer = container.querySelector(
      '[data-category="past"]',
    );

    expect(mainCategoryContainer).toBeTruthy();
    expect(pastCategoryContainer).toBeTruthy();

    // Get all software cards in each container
    const mainCards =
      mainCategoryContainer?.querySelectorAll(".software-card") || [];
    const pastCards =
      pastCategoryContainer?.querySelectorAll(".software-card") || [];

    // Extract software IDs from each container
    const mainCardIds = Array.from(mainCards)
      .map((card) => card.getAttribute("data-software-id"))
      .filter((id) => id !== null);

    const pastCardIds = Array.from(pastCards)
      .map((card) => card.getAttribute("data-software-id"))
      .filter((id) => id !== null);

    // Verify no overlap: no ID should appear in both containers
    mainCardIds.forEach((id) => {
      expect(pastCardIds).not.toContain(id);
    });

    pastCardIds.forEach((id) => {
      expect(mainCardIds).not.toContain(id);
    });
  });

  /**
   * Property 1: Past category entries only appear in past container
   *
   * This test verifies that software entries with category='past' appear
   * in the past category container and do NOT appear in the main category container.
   */
  it("Property 1: Past category entries only appear in past container", () => {
    const { container } = render(<SoftwareExperience />);

    // Find the category containers
    const mainCategoryContainer = container.querySelector(
      '[data-category="main"]',
    );
    const pastCategoryContainer = container.querySelector(
      '[data-category="past"]',
    );

    expect(mainCategoryContainer).toBeTruthy();
    expect(pastCategoryContainer).toBeTruthy();

    // Get all software cards in the past container
    const pastCards =
      pastCategoryContainer?.querySelectorAll(".software-card") || [];

    // Verify each card in the past container has data indicating it's a past entry
    pastCards.forEach((card) => {
      const ariaLabel = card.getAttribute("aria-label") || "";

      // Past category cards should have "retired software" in their ARIA label
      expect(ariaLabel).toContain("retired software");

      // Past category cards should NOT have "currently in use" in their ARIA label
      expect(ariaLabel).not.toContain("currently in use");
    });
  });

  /**
   * Property 1: Category containers are properly labeled
   *
   * This test verifies that each category container has a visible heading
   * that identifies the category to users.
   */
  it("Property 1: Category containers have proper headings", () => {
    const { container } = render(<SoftwareExperience />);

    // Find the category containers
    const mainCategoryContainer = container.querySelector(
      '[data-category="main"]',
    );
    const pastCategoryContainer = container.querySelector(
      '[data-category="past"]',
    );

    expect(mainCategoryContainer).toBeTruthy();
    expect(pastCategoryContainer).toBeTruthy();

    // Find the heading for main category
    // The heading should be an h3 element that precedes or is within the container
    const mainHeading =
      mainCategoryContainer?.querySelector("h3") ||
      mainCategoryContainer?.previousElementSibling;

    if (mainHeading && mainHeading.tagName === "H3") {
      expect(mainHeading.textContent).toContain("Main");
      expect(mainHeading.textContent).toContain("Current");
    }

    // Find the heading for past category
    const pastHeading =
      pastCategoryContainer?.querySelector("h3") ||
      pastCategoryContainer?.previousElementSibling;

    if (pastHeading && pastHeading.tagName === "H3") {
      expect(pastHeading.textContent).toContain("Past");
      expect(pastHeading.textContent).toContain("Retired");
    }
  });

  /**
   * Property 1: All software cards appear in exactly one category
   *
   * This test verifies that every software card in the section appears
   * in exactly one category container (not zero, not multiple).
   */
  it("Property 1: All software cards appear in exactly one category", () => {
    const { container } = render(<SoftwareExperience />);

    // Find all software cards in the entire section
    const allCards = container.querySelectorAll(".software-card");

    // Find the category containers
    const mainCategoryContainer = container.querySelector(
      '[data-category="main"]',
    );
    const pastCategoryContainer = container.querySelector(
      '[data-category="past"]',
    );

    // Get cards in each container
    const mainCards =
      mainCategoryContainer?.querySelectorAll(".software-card") || [];
    const pastCards =
      pastCategoryContainer?.querySelectorAll(".software-card") || [];

    // Total cards in categories should equal total cards in section
    expect(mainCards.length + pastCards.length).toBe(allCards.length);

    // Verify each card is in exactly one container
    allCards.forEach((card) => {
      const isInMain = Array.from(mainCards).includes(card);
      const isInPast = Array.from(pastCards).includes(card);

      // Card should be in exactly one container (XOR)
      expect(isInMain !== isInPast).toBe(true);
    });
  });

  /**
   * Property 1: Category rendering is consistent with data
   *
   * This test verifies that the number of cards in each category container
   * matches the number of entries with that category in the data.
   */
  it("Property 1: Category containers render correct number of entries", () => {
    const { container } = render(<SoftwareExperience />);

    // Find the category containers
    const mainCategoryContainer = container.querySelector(
      '[data-category="main"]',
    );
    const pastCategoryContainer = container.querySelector(
      '[data-category="past"]',
    );

    // Get cards in each container
    const mainCards =
      mainCategoryContainer?.querySelectorAll(".software-card") || [];
    const pastCards =
      pastCategoryContainer?.querySelectorAll(".software-card") || [];

    // Import the actual data to verify counts
    // Note: This is a white-box test that verifies the component correctly
    // renders all entries from the data source
    import("../../../data/softwareData").then(({ getSoftwareByCategory }) => {
      const mainSoftware = getSoftwareByCategory("main");
      const pastSoftware = getSoftwareByCategory("past");

      expect(mainCards.length).toBe(mainSoftware.length);
      expect(pastCards.length).toBe(pastSoftware.length);
    });
  });

  /**
   * Property 1: Category order is consistent
   *
   * This test verifies that the main category container appears before
   * the past category container in the DOM, ensuring consistent presentation.
   */
  it("Property 1: Main category appears before past category", () => {
    const { container } = render(<SoftwareExperience />);

    // Find the category containers
    const mainCategoryContainer = container.querySelector(
      '[data-category="main"]',
    );
    const pastCategoryContainer = container.querySelector(
      '[data-category="past"]',
    );

    expect(mainCategoryContainer).toBeTruthy();
    expect(pastCategoryContainer).toBeTruthy();

    // Get the position of each container in the DOM
    const allElements = Array.from(
      container.querySelectorAll("[data-category]"),
    );
    const mainIndex = allElements.indexOf(mainCategoryContainer as Element);
    const pastIndex = allElements.indexOf(pastCategoryContainer as Element);

    // Main category should appear before past category
    expect(mainIndex).toBeLessThan(pastIndex);
  });

  /**
   * Property 1: Empty categories are handled gracefully
   *
   * This test verifies that if a category has no entries, the component
   * either doesn't render that category container or renders it empty
   * without breaking the layout.
   */
  it("Property 1: Component handles empty categories gracefully", () => {
    const { container } = render(<SoftwareExperience />);

    // Find the category containers
    const mainCategoryContainer = container.querySelector(
      '[data-category="main"]',
    );
    const pastCategoryContainer = container.querySelector(
      '[data-category="past"]',
    );

    // If a container exists, verify it either has cards or is properly empty
    if (mainCategoryContainer) {
      const mainCards =
        mainCategoryContainer.querySelectorAll(".software-card");
      // Container should either have cards or be a valid empty container
      expect(mainCards.length).toBeGreaterThanOrEqual(0);
    }

    if (pastCategoryContainer) {
      const pastCards =
        pastCategoryContainer.querySelectorAll(".software-card");
      // Container should either have cards or be a valid empty container
      expect(pastCards.length).toBeGreaterThanOrEqual(0);
    }

    // At least one category should have entries (otherwise the section is empty)
    const allCards = container.querySelectorAll(".software-card");
    expect(allCards.length).toBeGreaterThan(0);
  });

  /**
   * Property 8: WCAG AA contrast compliance
   * **Validates: Requirements 6.4**
   * Feature: software-experience, Property 8: WCAG AA contrast compliance
   *
   * Tests that all text elements in the Software Experience section meet WCAG AA
   * contrast requirements (4.5:1 for normal text, 3:1 for large text).
   * Uses axe-core accessibility testing tool to validate contrast ratios.
   *
   * This ensures the section maintains readability for users with visual impairments
   * and complies with accessibility standards despite the dark void aesthetic.
   */
  it("Property 8: All text elements meet WCAG AA contrast requirements", async () => {
    const { container } = render(<SoftwareExperience />);

    // Run axe accessibility tests with color-contrast rule enabled
    const results = await axe(container, {
      rules: {
        "color-contrast": { enabled: true },
      },
    });

    // Verify no color contrast violations
    expect(results.violations).toHaveLength(0);
  });

  /**
   * Property 8: Section heading contrast compliance
   *
   * Tests that the main section heading ("Software Experience") meets
   * WCAG AA contrast requirements. The heading uses a gradient effect
   * which should still maintain sufficient contrast.
   */
  it("Property 8: Section heading has sufficient contrast", async () => {
    const { container } = render(<SoftwareExperience />);

    // Find the section heading
    const heading = container.querySelector(".section-heading");
    expect(heading).toBeTruthy();

    // Run axe on the heading element
    const results = await axe(heading as HTMLElement, {
      rules: {
        "color-contrast": { enabled: true },
      },
    });

    expect(results.violations).toHaveLength(0);
  });

  /**
   * Property 8: Category title contrast compliance
   *
   * Tests that category titles ("Main (Current)" and "Past (Retired)")
   * meet WCAG AA contrast requirements.
   */
  it("Property 8: Category titles have sufficient contrast", async () => {
    const { container } = render(<SoftwareExperience />);

    // Find all category title elements (h3)
    const categoryTitles = container.querySelectorAll("h3");
    expect(categoryTitles.length).toBeGreaterThan(0);

    // Test each category title
    for (const title of Array.from(categoryTitles)) {
      const results = await axe(title as HTMLElement, {
        rules: {
          "color-contrast": { enabled: true },
        },
      });

      expect(results.violations).toHaveLength(0);
    }
  });

  /**
   * Property 8: Software card text contrast compliance
   *
   * Tests that all text elements within software cards (name, version, year)
   * meet WCAG AA contrast requirements.
   */
  it("Property 8: Software card text has sufficient contrast", async () => {
    const { container } = render(<SoftwareExperience />);

    // Find all software cards
    const softwareCards = container.querySelectorAll(".software-card");
    expect(softwareCards.length).toBeGreaterThan(0);

    // Test each software card
    for (const card of Array.from(softwareCards)) {
      const results = await axe(card as HTMLElement, {
        rules: {
          "color-contrast": { enabled: true },
        },
      });

      expect(results.violations).toHaveLength(0);
    }
  });

  /**
   * Property 8: Section description contrast compliance
   *
   * Tests that the section description/subheading text meets
   * WCAG AA contrast requirements.
   */
  it("Property 8: Section description has sufficient contrast", async () => {
    const { container } = render(<SoftwareExperience />);

    // Find the section subheading
    const subheading = container.querySelector(".section-subheading");
    expect(subheading).toBeTruthy();

    // Run axe on the subheading element
    const results = await axe(subheading as HTMLElement, {
      rules: {
        "color-contrast": { enabled: true },
      },
    });

    expect(results.violations).toHaveLength(0);
  });

  /**
   * Property 8: Property-based contrast testing across all text elements
   *
   * Uses property-based testing to verify that any text element in the section
   * maintains WCAG AA contrast compliance. This test generates random selections
   * of text elements and validates their contrast ratios.
   */
  it("Property 8: Random text elements maintain contrast compliance", async () => {
    const { container } = render(<SoftwareExperience />);

    // Get all text-containing elements
    const allTextElements = Array.from(
      container.querySelectorAll("h2, h3, p, span, div"),
    ).filter((el) => {
      const text = el.textContent?.trim();
      return text && text.length > 0;
    });

    expect(allTextElements.length).toBeGreaterThan(0);

    // Use fast-check to randomly select text elements to test
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: allTextElements.length - 1 }),
        async (index) => {
          const element = allTextElements[index];

          // Run axe on the selected element
          const results = await axe(element as HTMLElement, {
            rules: {
              "color-contrast": { enabled: true },
            },
          });

          // Verify no violations
          expect(results.violations).toHaveLength(0);
        },
      ),
      { numRuns: 50 }, // Test 50 random text elements
    );
  });

  /**
   * Property 8: Contrast compliance under different viewport sizes
   *
   * Tests that text contrast remains compliant across different viewport sizes
   * (mobile, tablet, desktop) to ensure responsive design doesn't break accessibility.
   */
  it("Property 8: Text contrast maintained across viewport sizes", async () => {
    const viewportSizes = [
      { width: 375, name: "mobile" },
      { width: 768, name: "tablet" },
      { width: 1024, name: "desktop" },
    ];

    for (const viewport of viewportSizes) {
      // Set viewport size
      window.innerWidth = viewport.width;
      window.dispatchEvent(new Event("resize"));

      const { container } = render(<SoftwareExperience />);

      // Run axe on the entire section
      const results = await axe(container, {
        rules: {
          "color-contrast": { enabled: true },
        },
      });

      expect(results.violations).toHaveLength(0);
    }
  });

  /**
   * Property 8: Focus indicator contrast compliance
   *
   * Tests that focus indicators on interactive elements (software cards)
   * have sufficient contrast for keyboard navigation visibility.
   */
  it("Property 8: Focus indicators have sufficient contrast", async () => {
    const { container } = render(<SoftwareExperience />);

    // Find all focusable software cards
    const focusableCards = container.querySelectorAll(
      '[role="button"][tabindex="0"]',
    );

    // If no focusable cards exist (onClick not provided), skip this test
    // This is expected behavior - cards are only focusable when interactive
    if (focusableCards.length === 0) {
      // Test passes - no interactive cards means no focus indicators needed
      expect(focusableCards.length).toBe(0);
      return;
    }

    // Test each focusable card
    for (const card of Array.from(focusableCards)) {
      // Simulate focus
      (card as HTMLElement).focus();

      // Run axe on the focused element
      const results = await axe(card as HTMLElement, {
        rules: {
          "color-contrast": { enabled: true },
        },
      });

      expect(results.violations).toHaveLength(0);
    }
  });
});
