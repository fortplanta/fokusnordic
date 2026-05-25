import { useEffect, useRef } from "react";
import { useAnimate } from "framer-motion";
import "./Preloader.css";

// ── Images ─────────────────────────────────────────────────────────────────
const SCATTERED_IMAGES = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1504674900787-3c44f2d9fb53?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=600&fit=crop",
  "https://images.unsplash.com/photo-1516997121055-c79d53c6dcd7?w=400&h=600&fit=crop",
];

const CENTER_IMAGE =
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1600&h=900&fit=crop";

// ── Layout constants ────────────────────────────────────────────────────────
/**
 * Scatter offsets [xVw, yVh] for each of the 8 images from the
 * viewport centre. Derived from the original CSS positioned layout.
 */
const SCATTER_VW_VH = [
  [33.65, 20.2],
  [-17.45, 6.05],
  [11.95, -12.05],
  [34.65, -23.3],
  [5.25, 24.55],
  [-32.75, -17.05],
  [-34.85, 29.9],
  [46.35, -4.7],
] as const;

/** CSS sizes: images at indices 0,3,6,7 → B (large); 1,2,4,5 → A (small) */
const getSize = (i: number, vw: number, vh: number) =>
  [0, 3, 6, 7].includes(i)
    ? { w: 16.7 * vw, h: 20.6 * vh }
    : { w: 12.5 * vw, h: 25.7 * vh };

// ── Component ───────────────────────────────────────────────────────────────
interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const [scope, animate] = useAnimate();
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    const scatter = SCATTER_VW_VH.map(([x, y]) => ({ x: x * vw, y: y * vh }));

    // Full-viewport dimensions for the centre image wrapper
    const CW = { w: window.innerWidth, h: window.innerHeight };

    const imgs = Array.from(
      scope.current.querySelectorAll<HTMLElement>(".preloader-img")
    );
    const cw = scope.current.querySelector<HTMLElement>(".preloader-center")!;
    const ci = cw.querySelector<HTMLElement>("img")!;

    let cancelled = false;

    const run = async () => {
      // ── Initial state (instant) ──────────────────────────────────────
      await Promise.all([
        ...imgs.map((img, i) => {
          const { w, h } = getSize(i, vw, vh);
          const { x, y } = scatter[i];
          return animate(img, { x: -w / 2 + x, y: -h / 2 + y + 80, opacity: 0 }, { duration: 0 });
        }),
        animate(cw, { x: -CW.w / 2, y: -CW.h / 2 + 80, scale: 0.15, opacity: 0 }, { duration: 0 }),
        animate(ci, { scale: 1.5 }, { duration: 0 }),
      ]);

      if (cancelled) return;

      // ── Phase 1: fade up into scatter positions (stagger 0.07 s) ────
      imgs.forEach((img, i) => {
        const { w, h } = getSize(i, vw, vh);
        const { x, y } = scatter[i];
        animate(img, { x: -w / 2 + x, y: -h / 2 + y, opacity: 1 }, {
          duration: 2,
          ease: [0.17, 0.55, 0.55, 1],
          delay: i * 0.07,
        });
      });
      // Centre image is the last element in the stagger
      await animate(cw, { x: -CW.w / 2, y: -CW.h / 2, opacity: 1 }, {
        duration: 2,
        ease: [0.17, 0.55, 0.55, 1],
        delay: imgs.length * 0.07,
      });

      if (cancelled) return;

      // ── Phase 2: converge all to viewport centre (stagger 0.08 s) ───
      imgs.forEach((img, i) => {
        const { w, h } = getSize(i, vw, vh);
        animate(img, { x: -w / 2, y: -h / 2 }, {
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
          delay: i * 0.08,
        });
      });
      await animate(cw, { x: -CW.w / 2, y: -CW.h / 2 }, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay: imgs.length * 0.08,
      });

      if (cancelled) return;

      // ── Phase 3: scale centre image to fullscreen ────────────────────
      animate(ci, { scale: 1 }, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });
      await animate(cw, { scale: 1 }, { duration: 1.5, ease: [0.16, 1, 0.3, 1] });

      if (cancelled) return;

      // ── Fade out preloader ───────────────────────────────────────────
      await animate(scope.current, { opacity: 0 }, { duration: 0.5, ease: "easeOut" });

      if (!cancelled) onCompleteRef.current();
    };

    run();

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="intro" ref={scope}>
      <div className="intro__images">
        {SCATTERED_IMAGES.map((src, i) => (
          <img key={i} className="preloader-img" src={src} alt="" aria-hidden="true" />
        ))}
      </div>
      <div className="intro__center-image preloader-center">
        <img src={CENTER_IMAGE} alt="" aria-hidden="true" />
      </div>
    </div>
  );
};
