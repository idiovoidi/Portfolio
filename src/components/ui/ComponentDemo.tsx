import type React from "react";
import { useState } from "react";
import Button from "./Button";
import EmbeddedDemo from "./EmbeddedDemo";
import Lightbox from "./Lightbox";
import type { SocialLink } from "./SocialLinks";
import SocialLinks from "./SocialLinks";

/**
 * Demo component to showcase all UI components
 * This can be used for testing and development purposes
 */
const ComponentDemo: React.FC = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const sampleSocialLinks: SocialLink[] = [
    { platform: "github", url: "https://github.com", label: "GitHub" },
    { platform: "linkedin", url: "https://linkedin.com", label: "LinkedIn" },
    { platform: "twitter", url: "https://twitter.com", label: "Twitter" },
    { platform: "email", url: "contact@example.com", label: "Email" },
  ];

  const handleLoadingDemo = () => {
    setButtonLoading(true);
    setTimeout(() => setButtonLoading(false), 2000);
  };

  return (
    <div className="container-custom py-8 space-y-12">
      <h1 className="text-4xl font-bold text-gradient mb-8">
        UI Components Demo
      </h1>

      {/* Button Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Component</h2>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="small">
              Small Primary
            </Button>
            <Button variant="primary" size="medium">
              Medium Primary
            </Button>
            <Button variant="primary" size="large">
              Large Primary
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" size="medium">
              Secondary
            </Button>
            <Button variant="outline" size="medium">
              Outline
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button
              variant="primary"
              loading={buttonLoading}
              onClick={handleLoadingDemo}
            >
              {buttonLoading ? "Loading..." : "Click to Load"}
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </section>

      {/* SocialLinks Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Social Links Component</h2>
        <SocialLinks links={sampleSocialLinks} iconSize={28} />
      </section>

      {/* Lightbox Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Lightbox Component</h2>
        <Button variant="primary" onClick={() => setLightboxOpen(true)}>
          Open Lightbox
        </Button>
        <Lightbox
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          imageSrc="https://via.placeholder.com/1200x800"
          imageAlt="Sample artwork"
          title="Sample Artwork Title"
        />
      </section>

      {/* EmbeddedDemo Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Embedded Demo Component</h2>
        <Button variant="primary" onClick={() => setDemoOpen(true)}>
          Open Embedded Demo
        </Button>
        <EmbeddedDemo
          isOpen={demoOpen}
          onClose={() => setDemoOpen(false)}
          embedUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Sample Embedded Content"
          aspectRatio="16:9"
        />
      </section>
    </div>
  );
};

export default ComponentDemo;
