import React, { useRef, useEffect, ReactNode } from 'react';

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  ease?: string;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  onComplete?: () => void;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({
  children,
  distance = 100,
  direction = 'vertical',
  reverse = false,
  duration = 0.8,
  ease = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  delay = 0,
  onComplete
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const axis = direction === 'horizontal' ? 'translateX' : 'translateY';
          const offset = reverse ? -distance : distance;

          // Set initial state
          el.style.transform = `${axis}(${offset}px) scale(${scale})`;
          el.style.opacity = animateOpacity ? initialOpacity.toString() : '1';
          el.style.transition = 'none';

          // Trigger animation
          requestAnimationFrame(() => {
            el.style.transition = `all ${duration}s ${ease} ${delay}s`;
            el.style.transform = `${axis}(0px) scale(1)`;
            el.style.opacity = '1';
          });

          if (onComplete) {
            setTimeout(() => onComplete(), (duration + delay) * 1000);
          }

          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [
    distance,
    direction,
    reverse,
    duration,
    ease,
    initialOpacity,
    animateOpacity,
    scale,
    threshold,
    delay,
    onComplete
  ]);

  return <div ref={ref}>{children}</div>;
};

export default AnimatedContent;
