/** Relative paths under public/commercial/ (use forward slashes). */

export const MUSIC_PHOTOGRAPHY_DIR = "Music Photography (Commercial)";

export const musicPhotographyFiles = [
  "_DSC2592a.JPG",
  "_DSC2639a_1.JPG",
  "Band-Group-Picture-At-End.jpg",
  "Bruthen Blues Saturday_DSC7606.jpg",
  "Bruthen Blues Saturday_DSC8575.jpg",
  "Bruthen Blues Sunday 15.jpg",
  "Dark-Moody-Diploid.jpg",
  "Drummer-duo.jpg",
  "John-Pink2.jpg",
  "Lara_Travis08c.jpg",
  "LDG003.jpg",
  "LDG006.jpg",
  "LDG008.jpg",
  "LDG066.jpg",
  "Sony_A7_1419.jpg",
  "Sony_A7_2568.jpg",
  "Sony_A7_2578.jpg",
  "Sony_A7_2629.jpg",
  "Sony_A7_3767.jpg",
  "Tayla-Singing-with-Band2'.jpg",
  "The_Black_Sorrow_The Wedge__A7_0824.jpg",
  "The_Black_Sorrow_The Wedge__A7_1420.jpg",
  "The_Black_Sorrow_The Wedge__A7_1527.jpg",
] as const;

const PHOTO_ROOT = "Photography Commercial";

/** General commercial photography (excludes duplicate nested folder copies). */
export const commercialPhotographyPaths = [
  `${PHOTO_ROOT}/_A7_9023.jpg`,
  `${PHOTO_ROOT}/_DSC4534.jpeg`,
  `${PHOTO_ROOT}/275482677_328568362644851_3592396281760749002_n.jpg`,
  `${PHOTO_ROOT}/Bruthen Blues Sunday 16.jpg`,
  `${PHOTO_ROOT}/Bruthen Blues Sunday 4.jpg`,
  `${PHOTO_ROOT}/BShirt_Alley_Standing_MiddleS.jpg`,
  `${PHOTO_ROOT}/Bug Blitz_DSC02695.jpg`,
  `${PHOTO_ROOT}/Conga-Line.jpg`,
  `${PHOTO_ROOT}/Crafts 7077.jpg`,
  `${PHOTO_ROOT}/David-Sitting-Painting.jpg`,
  `${PHOTO_ROOT}/Entertainer 6521.jpg`,
  `${PHOTO_ROOT}/Face Painting04.jpg`,
  `${PHOTO_ROOT}/Fire Department 21.jpg`,
  `${PHOTO_ROOT}/Iseppi_Marriage_048.jpeg`,
  `${PHOTO_ROOT}/Jenga 5968.jpg`,
  `${PHOTO_ROOT}/Karavana Flamenca02 Quick Crop (Redo).jpg`,
  `${PHOTO_ROOT}/Long-Sleeve-standing-hands-together-w-lake.jpg`,
  `${PHOTO_ROOT}/Main Street005.jpg`,
  `${PHOTO_ROOT}/Nick-Standing-Graffiti-Wall.jpg`,
  `${PHOTO_ROOT}/ri3wG-iF.jpeg`,
  `${PHOTO_ROOT}/Rock Climbing30.jpg`,
  `${PHOTO_ROOT}/Sale Music Festival Crowd01.JPG`,
  `${PHOTO_ROOT}/Tayla-Bridgee.jpg`,
  `${PHOTO_ROOT}/Workshop-man.jpg`,
  `${PHOTO_ROOT}/Costume/Batman2.jpg`,
  `${PHOTO_ROOT}/Costume/Blackwidow.jpg`,
  `${PHOTO_ROOT}/Costume/The-King.jpg`,
  `${PHOTO_ROOT}/Costume/Watchman3-sfx.jpg`,
] as const;

export const VIDEO_DIR = "Video";

/**
 * Commercial video section mix:
 * - Images: stills / promo cards (poster art for a project)
 * - Videos: playable mp4/webm with poster thumb under thumbs/Video/
 */
export type CommercialVideoManifestItem = {
  file: string;
  kind: "image" | "video";
  title?: string;
  medium?: string;
  tools?: string[];
  client?: string;
  date?: string;
  description?: string;
};

export const commercialVideoItems: CommercialVideoManifestItem[] = [
  {
    file: "Wedding Videography Adobe Premiere.png",
    kind: "image",
    title: "Wedding Videography",
    medium: "Video editing",
    tools: ["Adobe Premiere"],
    description: "Wedding highlight edit workflow in Premiere",
  },
  {
    file: "Drone Footage Nestbox Installation (On-going project).png",
    kind: "image",
    title: "Nestbox Installation — Drone Footage",
    medium: "Drone / documentary",
    tools: ["Drone", "Premiere"],
    description: "On-going nestbox installation documentation",
  },
  {
    file: "C0668_Misty Thank You.mp4",
    kind: "video",
    title: "Misty — Thank You",
    medium: "Music video",
    client: "Misty Harlowe",
    tools: ["Premiere", "After Effects"],
  },
];
