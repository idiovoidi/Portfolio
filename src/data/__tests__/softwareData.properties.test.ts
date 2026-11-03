import fc from "fast-check";
import { describe, expect, it } from "vitest";
import {
  type SoftwareCategory,
  type SoftwareEntry,
  softwareData,
} from "../softwareData";

/**
 * Property-Based Tests for Software Experience Data Structure
 * Feature: software-experience
 *
 * These tests validate that the software data structure meets all requirements
 * using property-based testing with fast-check library.
 */

describe("Software Experience - Property Tests", () => {
  /**
   * Property 5: Data structure completeness
   * **Validates: Requirements 4.1, 4.2, 4.3, 4.4**
   *
   * Tests that all software entries have required fields (id, name, category, icon)
   * and that category values are valid.
   * Optional fields (tags, portfolioIds, language) must be correct types when present.
   */
  it("Property 5: All software entries have valid data structure", () => {
    const validCategories: SoftwareCategory[] = [
      "music",
      "digital-media",
      "3d-game",
      "coding-languages",
      "databases",
      "other",
    ];

    // Test each entry in the actual software data
    softwareData.forEach((entry: SoftwareEntry) => {
      // Required field: id (must be a non-empty string)
      expect(entry.id).toBeDefined();
      expect(typeof entry.id).toBe("string");
      expect(entry.id.length).toBeGreaterThan(0);

      // Required field: name (must be a non-empty string)
      expect(entry.name).toBeDefined();
      expect(typeof entry.name).toBe("string");
      expect(entry.name.length).toBeGreaterThan(0);

      // Required field: category (must be a valid category)
      expect(entry.category).toBeDefined();
      expect(validCategories).toContain(entry.category);

      // Required field: icon (must be a non-empty string)
      expect(entry.icon).toBeDefined();
      expect(typeof entry.icon).toBe("string");
      expect(entry.icon.length).toBeGreaterThan(0);

      // Optional field: version (if present, must be a string)
      if (entry.version !== undefined) {
        expect(typeof entry.version).toBe("string");
      }

      // Optional field: language (if present, must be a string)
      if (entry.language !== undefined) {
        expect(typeof entry.language).toBe("string");
      }

      // Optional field: tags (if present, must be an array)
      if (entry.tags !== undefined) {
        expect(Array.isArray(entry.tags)).toBe(true);
        // All tags must be strings
        entry.tags.forEach((tag) => {
          expect(typeof tag).toBe("string");
        });
      }

      // Optional field: portfolioIds (if present, must be an array)
      if (entry.portfolioIds !== undefined) {
        expect(Array.isArray(entry.portfolioIds)).toBe(true);
        // All portfolioIds must be strings
        entry.portfolioIds.forEach((id) => {
          expect(typeof id).toBe("string");
        });
      }
    });
  });

  /**
   * Property-based test: Generated software entries should validate correctly
   *
   * This test generates random software entries and validates they would be
   * accepted by the data structure requirements.
   */
  it("Property 5: Generated software entries with required fields are valid", () => {
    const validCategories: SoftwareCategory[] = [
      "music",
      "digital-media",
      "3d-game",
      "coding-languages",
      "databases",
      "other",
    ];

    fc.assert(
      fc.property(
        // Generate arbitrary software entries
        fc.record({
          id: fc.string({ minLength: 1 }),
          name: fc.string({ minLength: 1 }),
          category: fc.constantFrom<SoftwareCategory>(
            "music",
            "digital-media",
            "3d-game",
            "coding-languages",
            "databases",
            "other",
          ),
          icon: fc.string({ minLength: 1 }),
          version: fc.option(fc.string(), { nil: undefined }),
          language: fc.option(fc.string(), { nil: undefined }),
          tags: fc.option(fc.array(fc.string()), { nil: undefined }),
          portfolioIds: fc.option(fc.array(fc.string()), { nil: undefined }),
        }),
        (generatedEntry) => {
          // Validate required fields
          expect(generatedEntry.id).toBeDefined();
          expect(typeof generatedEntry.id).toBe("string");
          expect(generatedEntry.id.length).toBeGreaterThan(0);

          expect(generatedEntry.name).toBeDefined();
          expect(typeof generatedEntry.name).toBe("string");
          expect(generatedEntry.name.length).toBeGreaterThan(0);

          expect(generatedEntry.category).toBeDefined();
          expect(validCategories).toContain(generatedEntry.category);

          expect(generatedEntry.icon).toBeDefined();
          expect(typeof generatedEntry.icon).toBe("string");
          expect(generatedEntry.icon.length).toBeGreaterThan(0);

          // Validate optional fields when present
          if (generatedEntry.version !== undefined) {
            expect(typeof generatedEntry.version).toBe("string");
          }

          if (generatedEntry.language !== undefined) {
            expect(typeof generatedEntry.language).toBe("string");
          }

          if (generatedEntry.tags !== undefined) {
            expect(Array.isArray(generatedEntry.tags)).toBe(true);
          }

          if (generatedEntry.portfolioIds !== undefined) {
            expect(Array.isArray(generatedEntry.portfolioIds)).toBe(true);
          }
        },
      ),
      { numRuns: 100 },
    );
  });

  /**
   * Property 5: Category values are valid
   *
   * This test ensures no invalid category values exist in the data.
   */
  it("Property 5: All category values are valid", () => {
    const validCategories: SoftwareCategory[] = [
      "music",
      "digital-media",
      "3d-game",
      "coding-languages",
      "databases",
      "other",
    ];

    softwareData.forEach((entry: SoftwareEntry) => {
      expect(validCategories).toContain(entry.category);
    });
  });

  /**
   * Property 5: Optional array fields are arrays when present
   *
   * This test validates that tags and portfolioIds are proper arrays
   * when they are defined (not undefined).
   */
  it("Property 5: Optional array fields (tags, portfolioIds) are arrays when present", () => {
    softwareData.forEach((entry: SoftwareEntry) => {
      if (entry.tags !== undefined) {
        expect(Array.isArray(entry.tags)).toBe(true);
        // Ensure all elements are strings
        entry.tags.forEach((tag) => {
          expect(typeof tag).toBe("string");
        });
      }

      if (entry.portfolioIds !== undefined) {
        expect(Array.isArray(entry.portfolioIds)).toBe(true);
        // Ensure all elements are strings
        entry.portfolioIds.forEach((id) => {
          expect(typeof id).toBe("string");
        });
      }
    });
  });

  /**
   * Property 5: IDs are unique across all entries
   *
   * This test ensures no duplicate IDs exist in the software data.
   */
  it("Property 5: All software entry IDs are unique", () => {
    const ids = softwareData.map((entry) => entry.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  /**
   * Property 9: Simple Icons format
   * **Validates: Requirements 8.1**
   *
   * Tests that all software entry icon names follow the Simple Icons format (SiIconName).
   * This ensures consistent icon usage from react-icons/si library.
   */
  it("Property 9: All software entry icons use Simple Icons format", () => {
    softwareData.forEach((entry: SoftwareEntry) => {
      expect(entry.icon).toBeDefined();
      expect(typeof entry.icon).toBe("string");
      // Icon should start with 'Si' (Simple Icons prefix)
      expect(entry.icon.startsWith("Si")).toBe(true);
      // Icon should be in PascalCase format (e.g., SiBlender, SiReact)
      expect(entry.icon).toMatch(/^Si[A-Z][a-zA-Z0-9]*$/);
    });
  });

  /**
   * Property-based test: Generated icon names should follow Simple Icons format
   *
   * This test generates random icon names and validates they would be
   * accepted by the Simple Icons format requirement.
   */
  it("Property 9: Generated icon names with Si prefix are valid", () => {
    fc.assert(
      fc.property(
        // Generate arbitrary icon names that start with 'Si' and follow PascalCase
        fc
          .string({ minLength: 1 })
          .filter((s) => /^[A-Z][a-zA-Z0-9]*$/.test(s))
          .map((name) => `Si${name}`),
        (iconName) => {
          expect(iconName.startsWith("Si")).toBe(true);
          expect(iconName).toMatch(/^Si[A-Z][a-zA-Z0-9]*$/);
        },
      ),
      { numRuns: 100 },
    );
  });
});
