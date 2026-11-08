export type NavGroup = "art" | "commercial";

export interface NavLink {
  id: string;
  label: string;
  href: string;
  group?: NavGroup;
}

export const navLinks: NavLink[] = [
  { id: "home", label: "Home", href: "#home" },
  { id: "projects", label: "Projects", href: "#projects" },
  { id: "art-gallery", label: "Art", href: "#art-gallery", group: "art" },
  { id: "nft-gallery", label: "NFTs", href: "#nft-gallery", group: "art" },
  { id: "music", label: "Music", href: "#music", group: "art" },
  { id: "videos", label: "Videos", href: "#videos", group: "art" },
  { id: "three-d", label: "3D", href: "#three-d", group: "art" },
  {
    id: "commercial",
    label: "Commercial",
    href: "#commercial",
    group: "commercial",
  },
  // Skills section hidden for now: { id: "skills", label: "Skills", href: "#skills" },
  {
    id: "software-experience",
    label: "Software Experience",
    href: "#software-experience",
  },
  { id: "contact", label: "Contact", href: "#contact" },
];
