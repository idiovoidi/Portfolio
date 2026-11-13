/**
 * Commercial section filter tags.
 * Add new entries here to show a new filter pill; assign the same id on works via tags[].
 */
export type CommercialTagId =
  | "design"
  | "music-photography"
  | "photography"
  | "costume"
  | "video"
  | "video-reel";

export interface CommercialTagDefinition {
  id: CommercialTagId;
  label: string;
}

/** Tags available in the filter bar (order = pill order). */
export const commercialTagDefinitions: CommercialTagDefinition[] = [
  { id: "design", label: "Design & print" },
  { id: "music-photography", label: "Music photography" },
  { id: "photography", label: "Commercial photography" },
  { id: "costume", label: "Costume" },
  { id: "video", label: "Video" },
  { id: "video-reel", label: "Video Reel" },
];

export const commercialTagLabel = (id: CommercialTagId): string =>
  commercialTagDefinitions.find((t) => t.id === id)?.label ?? id;
