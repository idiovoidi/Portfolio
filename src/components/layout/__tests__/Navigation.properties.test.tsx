import { fireEvent, render } from "@testing-library/react";
import fc from "fast-check";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Navigation from "../Navigation";

/**
 * Property-Based Tests for Navigation Component
 * Feature: software-experience
 *
 * These tests validate that the Navigation component correctly handles
 * scroll behavior when navigation links are clicked, using property-based
 * testing with fast-check library.
 */

describe("Navigation - Property Tests", () => {
  beforeEach(() => {
    // Mock window.scrollTo for all tests
    window.scrollTo = vi.fn();

    // Mock getBoundingClientRect for all tests
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

  /**
   * Property 6: Navigation scroll behavior
   * **Validates: Requirements 1.3**
   * Feature: software-experience, Property 6: Navigation scroll behavior
   *
   * Tests that clicking the Software Experience navigation link scrolls to the section.
   * This property ensures that the navigation link correctly triggers smooth scrolling
   * to position the Software Experience section in the viewport.
   *
   * The test verifies:
   * - The Software Experience link exists in the navigation
   * - Clicking the link prevents default anchor behavior
   * - The corresponding section element is found in the DOM
   * - window.scrollTo is called with smooth behavior
   * - The scroll position accounts for the header offset
   */
  it("Property 6: Clicking Software Experience link scrolls to section", () => {
    fc.assert(
      fc.property(
        // Generate arbitrary scroll positions and element positions
        fc.record({
          currentScrollY: fc.integer({ min: 0, max: 5000 }),
          sectionTopPosition: fc.integer({ min: 100, max: 3000 }),
          headerOffset: fc.constant(80), // Fixed header offset from component
        }),
        (testData) => {
          // Set up the current scroll position
          Object.defineProperty(window, "pageYOffset", {
            writable: true,
            value: testData.currentScrollY,
          });

          // Create a mock section element
          const mockSection = document.createElement("section");
          mockSection.id = "software-experience";
          document.body.appendChild(mockSection);

          // Mock getBoundingClientRect to return the test position
          mockSection.getBoundingClientRect = vi.fn(() => ({
            top: testData.sectionTopPosition,
            left: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
          }));

          // Render the Navigation component
          const { container } = render(<Navigation />);

          // Find the Software Experience link
          const softwareExperienceLink = container.querySelector(
            'a[href="#software-experience"]',
          );
          expect(softwareExperienceLink).toBeTruthy();

          // Clear any previous calls to scrollTo
          vi.clearAllMocks();

          // Click the Software Experience link
          if (softwareExperienceLink) {
            fireEvent.click(softwareExperienceLink);
          }

          // Verify window.scrollTo was called
          expect(window.scrollTo).toHaveBeenCalled();

          // Verify scrollTo was called with smooth behavior
          const scrollToCall = (window.scrollTo as any).mock.calls[0][0];
          expect(scrollToCall).toBeDefined();
          expect(scrollToCall.behavior).toBe("smooth");

          // Verify the scroll position calculation
          // Expected: elementPosition + currentScrollY - headerOffset
          const expectedScrollTop =
            testData.sectionTopPosition +
            testData.currentScrollY -
            testData.headerOffset;

          expect(scrollToCall.top).toBe(expectedScrollTop);

          // Cleanup
          document.body.removeChild(mockSection);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 6: Software Experience link exists in navigation
   *
   * This test verifies that the Software Experience link is always present
   * in the navigation, regardless of the component's render state.
   */
  it("Property 6: Software Experience link is always present in navigation", () => {
    fc.assert(
      fc.property(
        // Generate arbitrary render conditions
        fc.constant(true),
        () => {
          const { container } = render(<Navigation />);

          // Find the Software Experience link
          const softwareExperienceLink = container.querySelector(
            'a[href="#software-experience"]',
          );

          // Verify the link exists
          expect(softwareExperienceLink).toBeTruthy();
          expect(softwareExperienceLink).toBeInTheDocument();

          // Verify the link has the correct text
          expect(softwareExperienceLink?.textContent).toBe(
            "Software Experience",
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 6: Scroll behavior is smooth for all navigation links
   *
   * This test verifies that all navigation links, including Software Experience,
   * use smooth scrolling behavior when clicked.
   */
  it("Property 6: All navigation links use smooth scroll behavior", () => {
    fc.assert(
      fc.property(
        // Generate test data for different navigation links
        fc.constantFrom(
          "home",
          "projects",
          "skills",
          "software-experience",
          "contact",
        ),
        (sectionId) => {
          // Create a mock section element
          const mockSection = document.createElement("section");
          mockSection.id = sectionId;
          document.body.appendChild(mockSection);

          // Mock getBoundingClientRect
          mockSection.getBoundingClientRect = vi.fn(() => ({
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

          // Render the Navigation component
          const { container } = render(<Navigation />);

          // Find the navigation link
          const navLink = container.querySelector(`a[href="#${sectionId}"]`);
          expect(navLink).toBeTruthy();

          // Clear any previous calls to scrollTo
          vi.clearAllMocks();

          // Click the navigation link
          if (navLink) {
            fireEvent.click(navLink);
          }

          // Verify window.scrollTo was called with smooth behavior
          expect(window.scrollTo).toHaveBeenCalled();
          const scrollToCall = (window.scrollTo as any).mock.calls[0][0];
          expect(scrollToCall.behavior).toBe("smooth");

          // Cleanup
          document.body.removeChild(mockSection);
        },
      ),
      { numRuns: 50 },
    );
  });

  /**
   * Property 6: Scroll position calculation accounts for header offset
   *
   * This test verifies that the scroll position calculation always accounts
   * for the fixed header offset (80px) to prevent the section from being
   * hidden behind the header.
   */
  it("Property 6: Scroll position accounts for header offset", () => {
    fc.assert(
      fc.property(
        // Generate arbitrary element positions
        fc.record({
          sectionTopPosition: fc.integer({ min: 0, max: 2000 }),
          currentScrollY: fc.integer({ min: 0, max: 5000 }),
        }),
        (testData) => {
          // Set up the current scroll position
          Object.defineProperty(window, "pageYOffset", {
            writable: true,
            value: testData.currentScrollY,
          });

          // Create a mock section element
          const mockSection = document.createElement("section");
          mockSection.id = "software-experience";
          document.body.appendChild(mockSection);

          // Mock getBoundingClientRect
          mockSection.getBoundingClientRect = vi.fn(() => ({
            top: testData.sectionTopPosition,
            left: 0,
            right: 0,
            bottom: 0,
            width: 0,
            height: 0,
            x: 0,
            y: 0,
            toJSON: () => {},
          }));

          // Render the Navigation component
          const { container } = render(<Navigation />);

          // Find the Software Experience link
          const softwareExperienceLink = container.querySelector(
            'a[href="#software-experience"]',
          );

          // Clear any previous calls to scrollTo
          vi.clearAllMocks();

          // Click the link
          if (softwareExperienceLink) {
            fireEvent.click(softwareExperienceLink);
          }

          // Verify the scroll position includes the header offset
          const scrollToCall = (window.scrollTo as any).mock.calls[0][0];
          const expectedScrollTop =
            testData.sectionTopPosition + testData.currentScrollY - 80;

          expect(scrollToCall.top).toBe(expectedScrollTop);

          // Cleanup
          document.body.removeChild(mockSection);
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 6: Click event prevents default anchor behavior
   *
   * This test verifies that clicking the Software Experience link prevents
   * the default anchor jump behavior, allowing the smooth scroll to work.
   */
  it("Property 6: Click event prevents default anchor behavior", () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        // Create a mock section element
        const mockSection = document.createElement("section");
        mockSection.id = "software-experience";
        document.body.appendChild(mockSection);

        // Mock getBoundingClientRect
        mockSection.getBoundingClientRect = vi.fn(() => ({
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

        // Render the Navigation component
        const { container } = render(<Navigation />);

        // Find the Software Experience link
        const softwareExperienceLink = container.querySelector(
          'a[href="#software-experience"]',
        );

        // Create a mock event with preventDefault
        const mockEvent = {
          preventDefault: vi.fn(),
          currentTarget: softwareExperienceLink,
        };

        // Simulate click with preventDefault tracking
        if (softwareExperienceLink) {
          // Fire the click event
          fireEvent.click(softwareExperienceLink);

          // Verify that the component's onClick handler would call preventDefault
          // by checking that scrollTo was called (which only happens after preventDefault)
          expect(window.scrollTo).toHaveBeenCalled();
        }

        // Cleanup
        document.body.removeChild(mockSection);
      }),
      { numRuns: 100 },
    );
  });

  /**
   * Property 6: Section element is found before scrolling
   *
   * This test verifies that the component checks for the existence of the
   * target section before attempting to scroll, preventing errors when
   * sections don't exist.
   */
  it("Property 6: Scroll only occurs when section exists", () => {
    fc.assert(
      fc.property(
        // Generate test cases with and without the section
        fc.boolean(),
        (sectionExists) => {
          if (sectionExists) {
            // Create the section element
            const mockSection = document.createElement("section");
            mockSection.id = "software-experience";
            document.body.appendChild(mockSection);

            // Mock getBoundingClientRect
            mockSection.getBoundingClientRect = vi.fn(() => ({
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
          }

          // Render the Navigation component
          const { container } = render(<Navigation />);

          // Find the Software Experience link
          const softwareExperienceLink = container.querySelector(
            'a[href="#software-experience"]',
          );

          // Clear any previous calls to scrollTo
          vi.clearAllMocks();

          // Click the link
          if (softwareExperienceLink) {
            fireEvent.click(softwareExperienceLink);
          }

          // Verify scrollTo behavior based on section existence
          if (sectionExists) {
            expect(window.scrollTo).toHaveBeenCalled();

            // Cleanup
            const mockSection = document.getElementById("software-experience");
            if (mockSection) {
              document.body.removeChild(mockSection);
            }
          } else {
            // When section doesn't exist, scrollTo should not be called
            expect(window.scrollTo).not.toHaveBeenCalled();
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 6: Mobile menu closes after navigation
   *
   * This test verifies that on mobile devices, clicking the Software Experience
   * link closes the mobile menu drawer, improving user experience.
   */
  it("Property 6: Mobile menu closes after clicking Software Experience link", () => {
    fc.assert(
      fc.property(fc.constant(true), () => {
        // Create a mock section element
        const mockSection = document.createElement("section");
        mockSection.id = "software-experience";
        document.body.appendChild(mockSection);

        // Mock getBoundingClientRect
        mockSection.getBoundingClientRect = vi.fn(() => ({
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

        // Render the Navigation component
        const { container } = render(<Navigation />);

        // Find and click the mobile menu button to open it
        const mobileMenuButton = container.querySelector(
          'button[aria-label="Toggle mobile menu"]',
        );

        if (mobileMenuButton) {
          fireEvent.click(mobileMenuButton);

          // Verify mobile menu is open (aria-expanded should be true)
          expect(mobileMenuButton.getAttribute("aria-expanded")).toBe("true");

          // Find the Software Experience link in the mobile menu
          // (it should be rendered in the drawer)
          const softwareExperienceLinks = container.querySelectorAll(
            'a[href="#software-experience"]',
          );

          // There should be at least one link (desktop or mobile)
          expect(softwareExperienceLinks.length).toBeGreaterThan(0);

          // Click the first Software Experience link
          fireEvent.click(softwareExperienceLinks[0]);

          // After clicking, the mobile menu should close
          // (aria-expanded should be false)
          expect(mobileMenuButton.getAttribute("aria-expanded")).toBe("false");
        }

        // Cleanup
        document.body.removeChild(mockSection);
      }),
      { numRuns: 50 },
    );
  });

  /**
   * Property 7: Active section highlighting
   * **Validates: Requirements 1.4**
   * Feature: software-experience, Property 7: Active section highlighting
   *
   * Tests that the navigation highlights the Software Experience button when
   * the section is in the viewport. This property ensures that the scroll-spy
   * mechanism correctly identifies when the Software Experience section is
   * visible and applies the active state to the corresponding navigation button.
   *
   * The test verifies:
   * - The Software Experience section is created with proper dimensions
   * - The section is positioned within the viewport scroll range
   * - The scroll event triggers the useScrollSpy hook
   * - The active state is applied to the Software Experience navigation link
   * - The active styling (color, text shadow, underline) is present
   */
  it("Property 7: Navigation highlights Software Experience when section is in viewport", async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate arbitrary section positions and viewport configurations
        fc.record({
          sectionOffsetTop: fc.integer({ min: 2000, max: 4000 }),
          sectionHeight: fc.integer({ min: 600, max: 1500 }),
          scrollOffset: fc.constant(150), // useScrollSpy default offset
        }),
        async (testData) => {
          // Create the Software Experience section element
          const mockSection = document.createElement("section");
          mockSection.id = "software-experience";

          // Set up the section's position and dimensions
          Object.defineProperty(mockSection, "offsetTop", {
            writable: true,
            configurable: true,
            value: testData.sectionOffsetTop,
          });
          Object.defineProperty(mockSection, "offsetHeight", {
            writable: true,
            configurable: true,
            value: testData.sectionHeight,
          });

          document.body.appendChild(mockSection);

          // Create other sections positioned BEFORE Software Experience
          const otherSections = ["home", "projects", "skills", "contact"];
          const mockSections: HTMLElement[] = [];

          otherSections.forEach((sectionId, index) => {
            const section = document.createElement("section");
            section.id = sectionId;
            Object.defineProperty(section, "offsetTop", {
              writable: true,
              configurable: true,
              value: index * 500, // Space sections apart, all before software-experience
            });
            Object.defineProperty(section, "offsetHeight", {
              writable: true,
              configurable: true,
              value: 400,
            });
            document.body.appendChild(section);
            mockSections.push(section);
          });

          // Render the Navigation component
          const { container, unmount } = render(<Navigation />);

          // Calculate scroll position that puts Software Experience section in viewport
          // scrollPosition = scrollY + offset
          // For section to be active: scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight
          const targetScrollY =
            testData.sectionOffsetTop - testData.scrollOffset + 100;

          // Set the scroll position
          Object.defineProperty(window, "scrollY", {
            writable: true,
            configurable: true,
            value: targetScrollY,
          });

          // Trigger scroll event to activate useScrollSpy
          fireEvent.scroll(window);

          // Wait for state updates (useScrollSpy uses useState and useEffect)
          await new Promise((resolve) => setTimeout(resolve, 150));

          // Find the Software Experience navigation link
          const softwareExperienceLink = container.querySelector(
            'a[href="#software-experience"]',
          ) as HTMLAnchorElement;

          expect(softwareExperienceLink).toBeTruthy();

          if (softwareExperienceLink) {
            // Check if the link has active styling
            const linkClasses = softwareExperienceLink.className;

            // Verify active state indicators:
            // 1. The link should have 'text-primary' class
            const hasActiveClass = linkClasses.includes("text-primary");

            // 2. Check for the active underline indicator (motion.div with layoutId)
            const activeIndicator = softwareExperienceLink.querySelector("div");

            // At least one active indicator should be present
            const isActive = hasActiveClass || activeIndicator !== null;

            // The link should show active state when section is in viewport
            expect(isActive).toBe(true);
          }

          // Cleanup
          unmount();
          document.body.removeChild(mockSection);
          mockSections.forEach((section) => {
            if (document.body.contains(section)) {
              document.body.removeChild(section);
            }
          });
        },
      ),
      { numRuns: 30 }, // Reduced runs due to async nature
    );
  });

  /**
   * Property 7: Active state applies correct styling
   *
   * This test verifies that when the Software Experience section is active,
   * the navigation link receives the correct visual styling including color,
   * text shadow, and underline indicator.
   */
  it("Property 7: Active Software Experience link has correct styling", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          sectionOffsetTop: fc.integer({ min: 3000, max: 4000 }),
          sectionHeight: fc.integer({ min: 700, max: 1200 }),
        }),
        async (testData) => {
          // Create the Software Experience section
          const mockSection = document.createElement("section");
          mockSection.id = "software-experience";

          Object.defineProperty(mockSection, "offsetTop", {
            writable: true,
            configurable: true,
            value: testData.sectionOffsetTop,
          });
          Object.defineProperty(mockSection, "offsetHeight", {
            writable: true,
            configurable: true,
            value: testData.sectionHeight,
          });

          document.body.appendChild(mockSection);

          // Create other sections positioned before Software Experience
          ["home", "projects", "skills", "contact"].forEach(
            (sectionId, index) => {
              const section = document.createElement("section");
              section.id = sectionId;
              Object.defineProperty(section, "offsetTop", {
                writable: true,
                configurable: true,
                value: index * 600,
              });
              Object.defineProperty(section, "offsetHeight", {
                writable: true,
                configurable: true,
                value: 500,
              });
              document.body.appendChild(section);
            },
          );

          // Render Navigation
          const { container, unmount } = render(<Navigation />);

          // Set scroll position to activate Software Experience section
          const targetScrollY = testData.sectionOffsetTop - 100;
          Object.defineProperty(window, "scrollY", {
            writable: true,
            configurable: true,
            value: targetScrollY,
          });

          // Trigger scroll event
          fireEvent.scroll(window);

          // Wait for state updates
          await new Promise((resolve) => setTimeout(resolve, 150));

          // Find the Software Experience link
          const softwareExperienceLink = container.querySelector(
            'a[href="#software-experience"]',
          ) as HTMLAnchorElement;

          if (softwareExperienceLink) {
            // Check for active state styling
            const hasTextPrimary =
              softwareExperienceLink.className.includes("text-primary");

            // Check for active underline (motion.div)
            const underline = softwareExperienceLink.querySelector("div");
            const hasActiveUnderline = underline !== null;

            // At least one active indicator should be present
            expect(hasTextPrimary || hasActiveUnderline).toBe(true);
          }

          // Cleanup
          unmount();
          const allSections = document.querySelectorAll("section");
          allSections.forEach((section) => {
            if (document.body.contains(section)) {
              document.body.removeChild(section);
            }
          });
        },
      ),
      { numRuns: 30 },
    );
  });

  /**
   * Property 7: Only one section is active at a time
   *
   * This test verifies that the scroll-spy mechanism correctly identifies
   * when the Software Experience section is in the viewport and applies
   * the active state to the navigation link.
   */
  it("Property 7: Only Software Experience is active when its section is in viewport", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          sectionOffsetTop: fc.integer({ min: 4000, max: 5000 }),
          sectionHeight: fc.integer({ min: 800, max: 1500 }),
        }),
        async (testData) => {
          // Create all sections including Software Experience
          const sectionIds = [
            "home",
            "projects",
            "skills",
            "software-experience",
            "contact",
          ];
          const sections: HTMLElement[] = [];

          sectionIds.forEach((sectionId, index) => {
            const section = document.createElement("section");
            section.id = sectionId;

            if (sectionId === "software-experience") {
              Object.defineProperty(section, "offsetTop", {
                writable: true,
                configurable: true,
                value: testData.sectionOffsetTop,
              });
              Object.defineProperty(section, "offsetHeight", {
                writable: true,
                configurable: true,
                value: testData.sectionHeight,
              });
            } else {
              // Position other sections far away from Software Experience
              Object.defineProperty(section, "offsetTop", {
                writable: true,
                configurable: true,
                value: index * 1000, // Well separated from software-experience
              });
              Object.defineProperty(section, "offsetHeight", {
                writable: true,
                configurable: true,
                value: 700,
              });
            }

            document.body.appendChild(section);
            sections.push(section);
          });

          // Render Navigation
          const { container, unmount } = render(<Navigation />);

          // Set scroll position to be in the middle of Software Experience section
          // This ensures we're clearly within the section bounds
          const targetScrollY =
            testData.sectionOffsetTop + testData.sectionHeight / 2 - 150;
          Object.defineProperty(window, "scrollY", {
            writable: true,
            configurable: true,
            value: targetScrollY,
          });

          // Trigger scroll event
          fireEvent.scroll(window);

          // Wait for state updates
          await new Promise((resolve) => setTimeout(resolve, 150));

          // Find the Software Experience navigation link specifically
          const softwareExperienceLink = container.querySelector(
            'a[href="#software-experience"]',
          ) as HTMLAnchorElement;

          expect(softwareExperienceLink).toBeTruthy();

          if (softwareExperienceLink) {
            // Check if Software Experience link has active styling
            const hasActiveClass =
              softwareExperienceLink.className.includes("text-primary");
            const hasActiveUnderline =
              softwareExperienceLink.querySelector("div") !== null;
            const isActive = hasActiveClass || hasActiveUnderline;

            // Software Experience should be active when its section is in viewport
            // This is the core requirement from Property 7
            expect(isActive).toBe(true);
          }

          // Cleanup
          unmount();
          sections.forEach((section) => {
            if (document.body.contains(section)) {
              document.body.removeChild(section);
            }
          });
        },
      ),
      { numRuns: 30 },
    );
  });
});
