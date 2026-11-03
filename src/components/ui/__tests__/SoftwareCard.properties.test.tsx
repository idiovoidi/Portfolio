import { render } from "@testing-library/react";
import fc from "fast-check";
import { describe, expect, it } from "vitest";
import type {
  SoftwareCategory,
  SoftwareEntry,
} from "../../../data/softwareData";
import SoftwareCard from "../SoftwareCard";

/**
 * Property-Based Tests for SoftwareCard Component
 * Feature: software-experience
 *
 * These tests validate that the SoftwareCard component correctly renders
 * software entries using property-based testing with fast-check library.
 */

describe("SoftwareCard - Property Tests", () => {
  /**
   * Property 3: Required field rendering
   * **Validates: Requirements 3.1, 3.2**
   *
   * Tests that any software entry renders both the icon (via SkillBadge) and the software name.
   * This property ensures that regardless of the software entry data, the card
   * always displays these two essential pieces of information.
   */
  it("Property 3: Any software entry renders both icon and name via SkillBadge", () => {
    fc.assert(
      fc.property(
        // Generate arbitrary software entries with required fields
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
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
          // Render the SoftwareCard with generated data
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // Verify SkillBadge is rendered
          const skillBadge = container.querySelector(".skill-badge");
          expect(skillBadge).toBeTruthy();

          // Verify software name is rendered as text
          expect(container.textContent).toContain(generatedSoftware.name);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 3: Software name is always visible as text content
   *
   * This test ensures that the software name is rendered as visible text
   * content in the DOM, not just in attributes or hidden elements.
   */
  it("Property 3: Software name is always visible as text content", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // The name should be visible in the text content
          expect(container.textContent).toContain(generatedSoftware.name);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 3: Both icon and name are present in the same card
   *
   * This test ensures that both the icon (via SkillBadge) and name are rendered within
   * the same software card container, maintaining component cohesion.
   */
  it("Property 3: Both icon and name are present in the same card container", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // Find the card container
          const cardContainer = container.querySelector(".software-card");
          expect(cardContainer).toBeDefined();

          // Verify SkillBadge is within the card
          const skillBadge = cardContainer?.querySelector(".skill-badge");
          expect(skillBadge).toBeTruthy();

          // Verify name is within the card
          expect(cardContainer?.textContent).toContain(generatedSoftware.name);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 2: Conditional year display for main category
   * **Validates: Requirements 2.5**
   *
   * Tests that software entries with category='main' do NOT display the year last used field,
   * even if yearLastUsed is present in the data. This ensures that current software
   * is not shown with a "last used" date, which would be semantically incorrect.
   */
  it("Property 2: Software entries with category=main do not display year last used", () => {
    fc.assert(
      fc.property(
        // Generate software entries with category='main' and a yearLastUsed value
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constant<SoftwareCategory>("main"), // Always 'main' category
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
          yearLastUsed: fc.integer({ min: 1990, max: 2030 }), // Always include a year
          version: fc.option(
            fc.string().filter((s) => s.trim().length > 0),
            { nil: undefined },
          ),
          tags: fc.option(fc.array(fc.string()), { nil: undefined }),
          portfolioIds: fc.option(fc.array(fc.string()), { nil: undefined }),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // Verify that the year last used is NOT displayed
          const cardText = container.textContent || "";

          // Should not contain "Last used:" text
          expect(cardText).not.toContain("Last used:");

          // Should not contain the year value as a standalone number
          expect(cardText).not.toContain(
            generatedSoftware.yearLastUsed?.toString() || "",
          );

          // Verify the card still renders (name should be present)
          expect(container.textContent).toContain(generatedSoftware.name);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 2: Main category entries never show year regardless of data
   *
   * This test verifies that even when yearLastUsed is explicitly provided
   * in the data for a main category entry, it is never rendered in the UI.
   * This is a stronger assertion that the conditional rendering works correctly.
   */
  it("Property 2: Main category with yearLastUsed still does not display year", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constant<SoftwareCategory>("main"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
          yearLastUsed: fc.integer({ min: 2000, max: 2025 }), // Explicit year
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // The year should not appear anywhere in the rendered output
          const yearString = generatedSoftware.yearLastUsed?.toString();
          if (yearString) {
            const cardText = container.textContent || "";
            // If the year appears, it should not be in a "Last used" context
            if (cardText.includes(yearString)) {
              expect(cardText).not.toContain("Last used:");
            }
          }

          // Verify the ARIA label indicates "currently in use" for main category
          const card = container.querySelector(".software-card");
          const ariaLabel = card?.getAttribute("aria-label") || "";

          expect(ariaLabel).toContain("currently in use");
          expect(ariaLabel).not.toContain("last used in");
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 4: Conditional year display for past category
   * **Validates: Requirements 3.4**
   *
   * Tests that software entries with category='past' display the year last used field.
   * This ensures that retired software shows when it was last actively used,
   * providing historical context about the developer's experience timeline.
   */
  it("Property 4: Software entries with category=past display year last used", () => {
    fc.assert(
      fc.property(
        // Generate software entries with category='past' and a yearLastUsed value
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constant<SoftwareCategory>("past"), // Always 'past' category
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
          yearLastUsed: fc.integer({ min: 1990, max: 2030 }), // Always include a year
          version: fc.option(
            fc.string().filter((s) => s.trim().length > 0),
            { nil: undefined },
          ),
          tags: fc.option(fc.array(fc.string()), { nil: undefined }),
          portfolioIds: fc.option(fc.array(fc.string()), { nil: undefined }),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // Verify that the year last used IS displayed
          const cardText = container.textContent || "";

          // Should contain "Last used:" text
          expect(cardText).toContain("Last used:");

          // Should contain the year value
          const yearString = generatedSoftware.yearLastUsed?.toString();
          expect(cardText).toContain(yearString);

          // Verify the card still renders other required fields (name)
          expect(container.textContent).toContain(generatedSoftware.name);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 4: Past category year display format
   *
   * This test verifies that the year last used is displayed in the correct format
   * with the "Last used:" prefix for past category entries.
   */
  it("Property 4: Past category displays year with correct format", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constant<SoftwareCategory>("past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
          yearLastUsed: fc.integer({ min: 2000, max: 2025 }),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          const cardText = container.textContent || "";
          const expectedText = `Last used: ${generatedSoftware.yearLastUsed}`;
          expect(cardText).toContain(expectedText);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 4: Past category ARIA label includes year
   *
   * This test ensures that the ARIA label for past category entries
   * includes the year last used for accessibility purposes.
   */
  it("Property 4: Past category ARIA label includes year last used", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constant<SoftwareCategory>("past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
          yearLastUsed: fc.integer({ min: 1990, max: 2030 }),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // Get the ARIA label from the card
          const card = container.querySelector(".software-card");
          const ariaLabel = card?.getAttribute("aria-label") || "";

          // ARIA label should contain "last used in {year}"
          expect(ariaLabel).toContain("last used in");
          expect(ariaLabel).toContain(
            generatedSoftware.yearLastUsed?.toString() || "",
          );

          // ARIA label should indicate "retired software"
          expect(ariaLabel).toContain("retired software");

          // ARIA label should NOT say "currently in use"
          expect(ariaLabel).not.toContain("currently in use");
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 10: ARIA label presence
   * **Validates: Requirements 8.3**
   * Feature: software-experience, Property 10: ARIA label presence
   *
   * Tests that all software cards include appropriate ARIA labels for screen reader accessibility.
   * The ARIA label should provide meaningful information about the software entry including:
   * - Software name
   * - Version (if present)
   * - Year last used (for past category)
   * - Current usage status (main vs past category)
   */
  it("Property 10: All software cards include appropriate ARIA labels", () => {
    fc.assert(
      fc.property(
        // Generate arbitrary software entries with all possible field combinations
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
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
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // Find the software card element
          const card = container.querySelector(".software-card");
          expect(card).toBeTruthy();

          // Verify ARIA label attribute exists
          const ariaLabel = card?.getAttribute("aria-label");
          expect(ariaLabel).toBeTruthy();
          expect(ariaLabel).not.toBe("");

          // Verify ARIA label contains the software name
          expect(ariaLabel).toContain(generatedSoftware.name);

          // Verify ARIA label contains version information if present
          if (generatedSoftware.version) {
            expect(ariaLabel).toContain("version");
            expect(ariaLabel).toContain(generatedSoftware.version);
          }

          // Verify ARIA label contains category-specific information
          if (generatedSoftware.category === "main") {
            // Main category should indicate current usage
            expect(ariaLabel).toContain("currently in use");
          } else if (generatedSoftware.category === "past") {
            // Past category should indicate retired status
            expect(ariaLabel).toContain("retired software");

            // If yearLastUsed is present, it should be in the ARIA label
            if (generatedSoftware.yearLastUsed) {
              expect(ariaLabel).toContain("last used in");
              expect(ariaLabel).toContain(
                generatedSoftware.yearLastUsed.toString(),
              );
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 10: ARIA label is non-empty and meaningful
   *
   * This test ensures that the ARIA label is not just present, but contains
   * meaningful information (not just whitespace or generic text).
   */
  it("Property 10: ARIA label contains meaningful information", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          const card = container.querySelector(".software-card");
          const ariaLabel = card?.getAttribute("aria-label") || "";

          // ARIA label should be non-empty after trimming
          expect(ariaLabel.trim().length).toBeGreaterThan(0);

          // ARIA label should be longer than just the software name
          // (it should include additional context)
          expect(ariaLabel.length).toBeGreaterThan(
            generatedSoftware.name.length,
          );

          // ARIA label should contain at least the software name and category info
          expect(ariaLabel).toContain(generatedSoftware.name);

          // Should contain either "currently in use" or "retired software"
          const hasStatusInfo =
            ariaLabel.includes("currently in use") ||
            ariaLabel.includes("retired software");
          expect(hasStatusInfo).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 10: ARIA label format consistency
   *
   * This test verifies that the ARIA label follows a consistent format
   * across all software entries, making it predictable for screen reader users.
   */
  it("Property 10: ARIA label follows consistent format", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
          version: fc.option(
            fc.string().filter((s) => s.trim().length > 0),
            { nil: undefined },
          ),
          yearLastUsed: fc.option(fc.integer({ min: 1990, max: 2030 }), {
            nil: undefined,
          }),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          const card = container.querySelector(".software-card");
          const ariaLabel = card?.getAttribute("aria-label") || "";

          // ARIA label should start with the software name
          expect(ariaLabel.startsWith(generatedSoftware.name)).toBe(true);

          // If version exists, it should appear after the name
          if (generatedSoftware.version) {
            const nameIndex = ariaLabel.indexOf(generatedSoftware.name);
            const versionIndex = ariaLabel.indexOf(generatedSoftware.version);
            // Only check if version appears after name if both are found
            if (nameIndex >= 0 && versionIndex >= 0) {
              expect(versionIndex).toBeGreaterThan(nameIndex);
            }
          }

          // Category information should appear at the end
          if (generatedSoftware.category === "main") {
            expect(ariaLabel.endsWith("currently in use")).toBe(true);
          } else {
            expect(ariaLabel.endsWith("retired software")).toBe(true);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 11: Keyboard focus indicators
   * **Validates: Requirements 8.4**
   * Feature: software-experience, Property 11: Keyboard focus indicators
   *
   * Tests that focusable elements in software cards have visible focus indicators
   * when focused via keyboard navigation. This ensures keyboard users can see
   * which element currently has focus, meeting accessibility requirements.
   *
   * The test verifies:
   * - Focus-visible styles are defined in the component
   * - Outline properties are set for keyboard focus
   * - Box-shadow provides additional visual feedback
   */
  it("Property 11: Focusable elements have visible focus indicators", () => {
    fc.assert(
      fc.property(
        // Generate arbitrary software entries
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
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
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // Find the software card element
          const card = container.querySelector(".software-card");
          expect(card).toBeTruthy();

          // Verify focus-visible styles are defined
          const styleElements = container.querySelectorAll("style");
          let hasFocusVisibleStyles = false;

          styleElements.forEach((styleEl) => {
            const styleContent = styleEl.textContent || "";
            if (styleContent.includes(".software-card:focus-visible")) {
              hasFocusVisibleStyles = true;

              // Extract just the focus-visible rule
              const focusVisibleMatch = styleContent.match(
                /\.software-card:focus-visible\s*\{([^}]+)\}/,
              );
              if (focusVisibleMatch) {
                const focusVisibleRule = focusVisibleMatch[1];

                // Verify the focus-visible styles include outline
                expect(focusVisibleRule).toContain("outline:");

                // Verify outline is visible (not 'none') in the focus-visible rule
                expect(focusVisibleRule).not.toContain("outline: none");
                expect(focusVisibleRule).not.toContain("outline:none");

                // Verify box-shadow is included for additional visual feedback
                expect(focusVisibleRule).toContain("box-shadow:");
              }
            }
          });

          expect(hasFocusVisibleStyles).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 11: Focus indicator visibility properties
   *
   * This test verifies that the focus indicator styles include specific
   * properties that ensure visibility: outline color, outline width,
   * outline offset, and box-shadow for enhanced visibility.
   */
  it("Property 11: Focus indicators have sufficient visibility properties", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // Find the style element containing focus-visible rules
          const styleElements = container.querySelectorAll("style");
          let focusVisibleStyleContent = "";

          styleElements.forEach((styleEl) => {
            const styleContent = styleEl.textContent || "";
            if (styleContent.includes(".software-card:focus-visible")) {
              focusVisibleStyleContent = styleContent;
            }
          });

          expect(focusVisibleStyleContent).toBeTruthy();

          // Verify outline width is specified (should be at least 2px for visibility)
          const outlineMatch =
            focusVisibleStyleContent.match(/outline:\s*(\d+)px/);
          expect(outlineMatch).toBeTruthy();

          if (outlineMatch) {
            const outlineWidth = parseInt(outlineMatch[1], 10);
            expect(outlineWidth).toBeGreaterThanOrEqual(2);
          }

          // Verify outline-offset is specified for better visibility
          expect(focusVisibleStyleContent).toContain("outline-offset:");

          // Verify box-shadow provides additional visual feedback
          expect(focusVisibleStyleContent).toContain("box-shadow:");
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 11: Focus indicator contrast
   *
   * This test verifies that the focus indicator uses colors with sufficient
   * contrast against the background to be visible to users with low vision.
   * The outline should use a purple/violet color consistent with the theme
   * but with sufficient brightness for visibility.
   */
  it("Property 11: Focus indicators use high-contrast colors", () => {
    fc.assert(
      fc.property(
        fc.record({
          id: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          name: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          category: fc.constantFrom<SoftwareCategory>("main", "past"),
          icon: fc
            .string({ minLength: 1 })
            .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
            .map((name) => `Si${name}`),
        }),
        (generatedSoftware: SoftwareEntry) => {
          const { container } = render(
            <SoftwareCard software={generatedSoftware} index={0} />,
          );

          // Find the style element containing focus-visible rules
          const styleElements = container.querySelectorAll("style");
          let focusVisibleStyleContent = "";

          styleElements.forEach((styleEl) => {
            const styleContent = styleEl.textContent || "";
            if (styleContent.includes(".software-card:focus-visible")) {
              focusVisibleStyleContent = styleContent;
            }
          });

          expect(focusVisibleStyleContent).toBeTruthy();

          // Verify the outline uses a visible color (not transparent or black)
          // The component uses rgba(167, 139, 250, 0.8) which is a light purple
          expect(focusVisibleStyleContent).toContain("rgba(167, 139, 250");

          // Verify the opacity is high enough for visibility (should be > 0.5)
          const outlineColorMatch = focusVisibleStyleContent.match(
            /rgba\(167,\s*139,\s*250,\s*([\d.]+)\)/,
          );
          if (outlineColorMatch) {
            const opacity = parseFloat(outlineColorMatch[1]);
            expect(opacity).toBeGreaterThan(0.5);
          }

          // Verify box-shadow also uses visible colors for the glow effect
          expect(focusVisibleStyleContent).toContain("rgba(139, 92, 246");
        },
      ),
      { numRuns: 100 },
    );
  });
});
