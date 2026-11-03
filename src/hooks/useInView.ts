import { useInView as useInViewLib } from "react-intersection-observer";

/**
 * Custom hook for viewport detection with sensible defaults
 * Wraps react-intersection-observer with portfolio-specific configuration
 *
 * @param options - Configuration options for intersection observer
 * @returns Object containing ref and inView state
 */
export const useInView = (options?: {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
}) => {
  const { ref, inView } = useInViewLib({
    threshold: options?.threshold ?? 0.1,
    triggerOnce: options?.triggerOnce ?? true,
    rootMargin: options?.rootMargin ?? "-50px",
  });

  return { ref, inView };
};

export default useInView;
