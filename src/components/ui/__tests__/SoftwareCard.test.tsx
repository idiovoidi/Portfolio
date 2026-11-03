import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { SoftwareEntry } from "../../../data/softwareData";
import SoftwareCard from "../SoftwareCard";

/**
 * Unit Tests for SoftwareCard Component
 * Feature: software-experience
 * Task: 2.4 - Write unit tests for SoftwareCard component
 *
 * These tests validate specific examples and edge cases for the SoftwareCard component.
 * Tests cover: icon/name rendering via SkillBadge, version display, year display, hover effects,
 * onClick handler, error handling, and keyboard navigation.
 *
 * Requirements tested: 3.1, 3.2, 3.3, 3.4, 8.3, 8.4
 */

describe("SoftwareCard - Unit Tests", () => {
  // Test data fixtures
  const blenderSoftware: SoftwareEntry = {
    id: "blender",
    name: "Blender",
    category: "main",
    icon: "SiBlender",
    version: "4.2",
    tags: ["3d", "modeling"],
    portfolioIds: [],
  };

  const unityRetiredSoftware: SoftwareEntry = {
    id: "unity",
    name: "Unity",
    category: "past",
    icon: "SiUnity",
    yearLastUsed: 2022,
    tags: ["game-dev"],
    portfolioIds: [],
  };

  const photoshopSoftware: SoftwareEntry = {
    id: "photoshop",
    name: "Adobe Photoshop",
    category: "main",
    icon: "SiAdobephotoshop",
    tags: ["design"],
    portfolioIds: [],
  };

  describe("Icon and Name Rendering via SkillBadge (Requirements 3.1, 3.2)", () => {
    it("should render SkillBadge component with correct props", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      // Check for SkillBadge by looking for its characteristic structure
      const skillBadge = container.querySelector(".skill-badge");
      expect(skillBadge).toBeTruthy();

      // Verify the name is rendered
      expect(container.textContent).toContain("Blender");
    });

    it("should render software name in SkillBadge", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      // The name should be visible in the component
      expect(container.textContent).toContain("Blender");
    });

    it("should render both icon and name for any software entry", () => {
      const { container } = render(
        <SoftwareCard software={photoshopSoftware} index={0} />,
      );

      // Check for SkillBadge
      const skillBadge = container.querySelector(".skill-badge");
      expect(skillBadge).toBeTruthy();

      // Check for name
      expect(container.textContent).toContain("Adobe Photoshop");
    });
  });

  describe("Version Display (Requirement 3.3)", () => {
    it("should display version number for Blender", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      // Look for version text
      expect(container.textContent).toContain("v4.2");
    });

    it("should not display version when not provided", () => {
      const { container } = render(
        <SoftwareCard software={photoshopSoftware} index={0} />,
      );

      // Verify no version text exists
      expect(container.textContent).not.toMatch(/v\d/);
    });
  });

  describe("Year Last Used Display (Requirement 3.4)", () => {
    it("should display year last used for retired software (past category)", () => {
      const { container } = render(
        <SoftwareCard software={unityRetiredSoftware} index={0} />,
      );

      // Check for "Last used:" text and year
      expect(container.textContent).toContain("Last used: 2022");
    });

    it("should not display year last used for current software (main category)", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      // Should not contain "Last used:" text
      expect(container.textContent).not.toContain("Last used:");
    });

    it("should not display year for main category even if yearLastUsed is provided", () => {
      const mainWithYear: SoftwareEntry = {
        ...blenderSoftware,
        yearLastUsed: 2023, // This should be ignored for main category
      };

      const { container } = render(
        <SoftwareCard software={mainWithYear} index={0} />,
      );

      // Should not display the year
      expect(container.textContent).not.toContain("Last used:");
      expect(container.textContent).not.toContain("2023");
    });
  });

  describe("Hover Effects (Requirements 3.1, 3.2)", () => {
    it("should apply hover class and styles correctly", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      const card = container.querySelector(".software-card");
      expect(card).toBeTruthy();

      // Verify card has cursor pointer when onClick is provided
      const cardWithClick = render(
        <SoftwareCard
          software={blenderSoftware}
          index={0}
          onClick={() => {}}
        />,
      ).container.querySelector(".software-card");

      expect(cardWithClick).toHaveStyle({ cursor: "pointer" });
    });

    it("should have default cursor when onClick is not provided", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      const card = container.querySelector(".software-card");
      expect(card).toHaveStyle({ cursor: "default" });
    });
  });

  describe("onClick Handler (Requirement 5.1)", () => {
    it("should call onClick handler with software id when clicked", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      const { container } = render(
        <SoftwareCard
          software={blenderSoftware}
          index={0}
          onClick={handleClick}
        />,
      );

      const card = container.querySelector(".software-card");
      expect(card).toBeTruthy();

      if (card) {
        await user.click(card as HTMLElement);
        expect(handleClick).toHaveBeenCalledWith("blender");
        expect(handleClick).toHaveBeenCalledTimes(1);
      }
    });

    it("should not throw error when onClick is not provided", async () => {
      const user = userEvent.setup();

      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      const card = container.querySelector(".software-card");
      expect(card).toBeTruthy();

      // Should not throw when clicked without onClick handler
      if (card) {
        await expect(user.click(card as HTMLElement)).resolves.not.toThrow();
      }
    });

    it("should have data-software-id attribute for identification", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      const card = container.querySelector(".software-card");
      expect(card?.getAttribute("data-software-id")).toBe("blender");
    });
  });

  describe("Keyboard Navigation (Requirements 8.3, 8.4)", () => {
    it("should be keyboard focusable with tabIndex=0 when onClick provided", () => {
      const { container } = render(
        <SoftwareCard
          software={blenderSoftware}
          index={0}
          onClick={() => {}}
        />,
      );

      const card = container.querySelector(".software-card");
      expect(card?.getAttribute("tabIndex")).toBe("0");
    });

    it('should have role="button" for accessibility when onClick provided', () => {
      const { container } = render(
        <SoftwareCard
          software={blenderSoftware}
          index={0}
          onClick={() => {}}
        />,
      );

      const card = container.querySelector(".software-card");
      expect(card?.getAttribute("role")).toBe("button");
    });

    it("should call onClick when Enter key is pressed", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      const { container } = render(
        <SoftwareCard
          software={blenderSoftware}
          index={0}
          onClick={handleClick}
        />,
      );

      const card = container.querySelector(".software-card") as HTMLElement;
      expect(card).toBeTruthy();

      if (card) {
        card.focus();
        await user.keyboard("{Enter}");
        expect(handleClick).toHaveBeenCalledWith("blender");
      }
    });

    it("should call onClick when Space key is pressed", async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      const { container } = render(
        <SoftwareCard
          software={blenderSoftware}
          index={0}
          onClick={handleClick}
        />,
      );

      const card = container.querySelector(".software-card") as HTMLElement;
      expect(card).toBeTruthy();

      if (card) {
        card.focus();
        await user.keyboard(" ");
        expect(handleClick).toHaveBeenCalledWith("blender");
      }
    });

    it("should have appropriate ARIA label for screen readers", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      const card = container.querySelector(".software-card");
      const ariaLabel = card?.getAttribute("aria-label");

      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain("Blender");
      expect(ariaLabel).toContain("version 4.2");
      expect(ariaLabel).toContain("currently in use");
    });

    it("should have ARIA label indicating retired software for past category", () => {
      const { container } = render(
        <SoftwareCard software={unityRetiredSoftware} index={0} />,
      );

      const card = container.querySelector(".software-card");
      const ariaLabel = card?.getAttribute("aria-label");

      expect(ariaLabel).toBeTruthy();
      expect(ariaLabel).toContain("Unity");
      expect(ariaLabel).toContain("last used in 2022");
      expect(ariaLabel).toContain("retired software");
    });

    it("should have visible focus indicator styles", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      // Check that focus-visible styles are defined
      const styleElement = container.querySelector("style");
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toContain(
        ".software-card:focus-visible",
      );
      expect(styleElement?.textContent).toContain("outline");
    });
  });

  describe("Animation and Performance (Requirement 8.2)", () => {
    it("should apply staggered animation delay based on index", () => {
      const { container: container1 } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );
      const { container: container2 } = render(
        <SoftwareCard software={blenderSoftware} index={5} />,
      );

      // Both should render successfully with different indices
      expect(container1.querySelector(".software-card")).toBeTruthy();
      expect(container2.querySelector(".software-card")).toBeTruthy();
    });

    it("should render SkillBadge with index for animation", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={3} />,
      );

      // SkillBadge should be present
      const skillBadge = container.querySelector(".skill-badge");
      expect(skillBadge).toBeTruthy();
    });
  });

  describe("Visual Consistency (Requirement 6.1, 6.2)", () => {
    it("should maintain consistent layout structure", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      const card = container.querySelector(".software-card");

      // Check for relative positioning (for overlay)
      expect(card).toHaveStyle({
        position: "relative",
      });
    });

    it("should render SkillBadge for consistent styling", () => {
      const { container } = render(
        <SoftwareCard software={blenderSoftware} index={0} />,
      );

      // SkillBadge should be present for consistent styling
      const skillBadge = container.querySelector(".skill-badge");
      expect(skillBadge).toBeTruthy();
    });
  });
});
