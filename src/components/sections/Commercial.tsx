import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { usePerformanceSettings } from "../../contexts/PerformanceContext";
import {
  type CommercialWork,
  commercialWorks,
  filterCommercialWorks,
} from "../../data/commercial";
import {
  type CommercialTagId,
  commercialTagDefinitions,
} from "../../data/commercialTags";
import { useInView } from "../../hooks";
import { createFadeInUp, fadeIn, revealState } from "../../utils/animations";
import { CommercialBackground } from "../ui/CommercialBackground";
import { CommercialCard } from "../ui/CommercialCard";
import Lightbox from "../ui/Lightbox";
import { Section } from "../ui/Section";

type CommercialFilter = "all" | CommercialTagId;

const filterOptions: { value: CommercialFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...commercialTagDefinitions.map((tag) => ({
    value: tag.id,
    label: tag.label,
  })),
];

export const Commercial = () => {
  const [activeFilter, setActiveFilter] = useState<CommercialFilter>("all");
  const [selectedWork, setSelectedWork] = useState<CommercialWork | null>(null);
  const { ref: filtersRef, inView: filtersInView } = useInView({
    threshold: 0.2,
  });
  const settings = usePerformanceSettings();

  const filteredWorks = useMemo(
    () => filterCommercialWorks(commercialWorks, activeFilter),
    [activeFilter],
  );

  const visibleTagFilters = useMemo(() => {
    const used = new Set<CommercialTagId>();
    commercialWorks.forEach((work) => {
      work.tags.forEach((tag) => used.add(tag));
    });
    return filterOptions.filter(
      (option) =>
        option.value === "all" || used.has(option.value as CommercialTagId),
    );
  }, []);

  return (
    <Section
      id="commercial"
      tone="light"
      className="overflow-hidden"
      background={<CommercialBackground />}
      title={
        <h2
          className="section-heading"
          style={{
            color: "#fff8e8",
            textShadow:
              "0 2px 18px rgba(0, 0, 0, 0.55), 0 0 36px rgba(255, 236, 179, 0.45)",
          }}
        >
          Commercial Work
        </h2>
      }
      subtitle={
        <p
          className="section-subheading mx-auto max-w-2xl"
          style={{
            color: "#f5e6c8",
            textShadow: "0 1px 12px rgba(0, 0, 0, 0.45)",
          }}
        >
          Photography and commissioned work, lit apart from the void.
        </p>
      }
    >
      {commercialWorks.length > 0 && (
        <motion.div
          ref={filtersRef}
          variants={createFadeInUp(0.15)}
          initial="initial"
          animate={revealState(filtersInView, settings.enableAnimations)}
          className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3"
        >
          {visibleTagFilters.map((option) => {
            const isActive = activeFilter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setActiveFilter(option.value)}
                className="rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 focus-visible-ring"
                style={{
                  background: isActive
                    ? "rgba(253, 230, 138, 0.95)"
                    : "rgba(20, 14, 10, 0.45)",
                  color: isActive ? "#1c1410" : "#f5e6c8",
                  border: `1px solid ${
                    isActive
                      ? "rgba(250, 204, 21, 0.8)"
                      : "rgba(253, 230, 138, 0.35)"
                  }`,
                  boxShadow: isActive
                    ? "0 0 20px rgba(253, 224, 165, 0.35)"
                    : "none",
                  transform: isActive ? "scale(1.03)" : "scale(1)",
                }}
                aria-label={`Filter by ${option.label}`}
                aria-pressed={isActive}
              >
                {option.label}
              </button>
            );
          })}
        </motion.div>
      )}

      {commercialWorks.length > 0 ? (
        <AnimatePresence mode="wait">
          {filteredWorks.length > 0 ? (
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="columns-1 gap-x-8 sm:columns-2 lg:columns-3 xl:columns-4 [column-fill:_balance] space-y-8 sm:space-y-10"
            >
              {filteredWorks.map((work, index) => (
                <CommercialCard
                  key={work.id}
                  work={work}
                  index={index}
                  onClick={() => setSelectedWork(work)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="text-center text-sm"
              style={{ color: "#e8d5a8" }}
            >
              No pieces in this category yet.
            </motion.p>
          )}
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-xl rounded-lg border px-8 py-16 text-center"
          style={{
            background: "rgba(20, 14, 10, 0.38)",
            borderColor: "rgba(253, 230, 138, 0.4)",
            boxShadow: "0 0 40px rgba(253, 224, 165, 0.18)",
          }}
        >
          <p className="text-lg font-medium" style={{ color: "#fff7e6" }}>
            Selected client work will live here.
          </p>
        </motion.div>
      )}

      {selectedWork && (
        <Lightbox
          isOpen={selectedWork !== null}
          onClose={() => setSelectedWork(null)}
          imageSrc={selectedWork.fullImage || selectedWork.image}
          imageAlt={selectedWork.title}
          videoSrc={selectedWork.videoSrc}
          title={
            selectedWork.client
              ? `${selectedWork.title} — ${selectedWork.client}`
              : selectedWork.title
          }
        />
      )}
    </Section>
  );
};
