import { Suspense } from "react";
import { Footer, Header } from "./components/layout";
import { Contact } from "./components/sections/Contact";
import { Hero } from "./components/sections/Hero";
import { Projects } from "./components/sections/Projects";
import { Skills } from "./components/sections/Skills";
import { SoftwareExperience } from "./components/sections/SoftwareExperience";
import { CosmicBackground } from "./components/ui/CosmicBackground";
import { PerformanceToggle } from "./components/ui/PerformanceToggle";
import { ScrollProgress } from "./components/ui/ScrollProgress";
import {
  PerformanceProvider,
  usePerformance,
} from "./contexts/PerformanceContext";
import { lazySection } from "./utils/lazySection";

const ArtGallery = lazySection(
  () => import("./components/sections/ArtGallery"),
  "ArtGallery",
);
const NFTGallery = lazySection(
  () => import("./components/sections/NFTGallery"),
  "NFTGallery",
);
const Music = lazySection(() => import("./components/sections/Music"), "Music");
const Videos = lazySection(
  () => import("./components/sections/Videos"),
  "Videos",
);
const ThreeD = lazySection(
  () => import("./components/sections/ThreeD"),
  "ThreeD",
);
const Commercial = lazySection(
  () => import("./components/sections/Commercial"),
  "Commercial",
);

const SectionFallback = ({ id }: { id: string }) => (
  <section
    id={id}
    className="section"
    style={{ minHeight: "40rem" }}
    aria-busy="true"
  />
);

function AppContent() {
  const { settings } = usePerformance();

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundColor: "var(--color-background)",
        color: "var(--color-text-primary)",
      }}
    >
      {settings.enableParticles && <CosmicBackground />}

      <ScrollProgress />
      <PerformanceToggle />

      <div className="relative z-10">
        <Header />
        <Hero />
        <Projects />
        <Suspense fallback={<SectionFallback id="art-gallery" />}>
          <ArtGallery />
        </Suspense>
        <Suspense fallback={<SectionFallback id="nft-gallery" />}>
          <NFTGallery />
        </Suspense>
        <Suspense fallback={<SectionFallback id="music" />}>
          <Music />
        </Suspense>
        <Suspense fallback={<SectionFallback id="videos" />}>
          <Videos />
        </Suspense>
        <Suspense fallback={<SectionFallback id="three-d" />}>
          <ThreeD />
        </Suspense>
        <Suspense fallback={<SectionFallback id="commercial" />}>
          <Commercial />
        </Suspense>
        <Skills />
        <SoftwareExperience />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <PerformanceProvider>
      <AppContent />
    </PerformanceProvider>
  );
}

export default App;
