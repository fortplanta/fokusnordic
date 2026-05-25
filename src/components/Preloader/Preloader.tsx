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

// ── Layout ──────────────────────────────────────────────────────────────────
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

/** Indices 0,3,6,7 → large (B); 1,2,4,5 → small (A) */
const getSize = (i: number, vw: number, vh: number) =>
  [0, 3, 6, 7].includes(i)
    ? { w: 16.7 * vw, h: 20.6 * vh }
    : { w: 12.5 * vw, h: 25.7 * vh };

// ── Timing (ms) ─────────────────────────────────────────────────────────────
const P1_DUR  = 2000;  // fade-up duration
const P1_STAG =   70;  // stagger between images
const P1_END  = P1_DUR + 8 * P1_STAG; // 2560 — when last element finishes

const P2_DUR  = 1200;  // converge duration
const P2_STAG =   80;  // stagger between images
const P2_END  = P1_END + P2_DUR + 8 * P2_STAG; // 4400

const P3_DUR  = 1500;  // scale to fullscreen
const P3_END  = P2_END + P3_DUR; // 5900

const FADE_DUR = 500;  // preloader fade-out

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
    const CW = { w: window.innerWidth, h: window.innerHeight };

    const imgs = Array.from(
      scope.current.querySelectorAll<HTMLElement>(".preloader-img")
    );
    const cw = scope.current.querySelector<HTMLElement>(".preloader-center")!;
    const ci = cw.querySelector<HTMLElement>("img")!;

    // Collect timers so cleanup can cancel them all
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(setTimeout(fn, ms));

    // ── Initial state (instant) ──────────────────────────────────────────
    imgs.forEach((img, i) => {
      const { w, h } = getSize(i, vw, vh);
      const { x, y } = scatter[i];
      animate(img, { x: -w / 2 + x, y: -h / 2 + y + 80, opacity: 0 }, { duration: 0 });
    });
    animate(cw, { x: -CW.w / 2, y: -CW.h / 2 + 80, scale: 0.15, opacity: 0 }, { duration: 0 });
    animate(ci, { scale: 1.5 }, { duration: 0 });

    // ── Phase 1: fade up into scatter positions ──────────────────────────
    imgs.forEach((img, i) => {
      at(i * P1_STAG, () => {
        const { w, h } = getSize(i, vw, vh);
        const { x, y } = scatter[i];
        animate(img, { x: -w / 2 + x, y: -h / 2 + y, opacity: 1 }, {
          duration: P1_DUR / 1000,
          ease: [0.17, 0.55, 0.55, 1],
        });
      });
    });
    at(imgs.length * P1_STAG, () => {
      animate(cw, { x: -CW.w / 2, y: -CW.h / 2, opacity: 1 }, {
        duration: P1_DUR / 1000,
        ease: [0.17, 0.55, 0.55, 1],
      });
    });

    // ── Phase 2: converge all to viewport centre ─────────────────────────
    imgs.forEach((img, i) => {
      at(P1_END + i * P2_STAG, () => {
        const { w, h } = getSize(i, vw, vh);
        animate(img, { x: -w / 2, y: -h / 2 }, {
          duration: P2_DUR / 1000,
          ease: [0.16, 1, 0.3, 1],
        });
      });
    });
    at(P1_END + imgs.length * P2_STAG, () => {
      animate(cw, { x: -CW.w / 2, y: -CW.h / 2 }, {
        duration: P2_DUR / 1000,
        ease: [0.16, 1, 0.3, 1],
      });
    });

    // ── Phase 3: scale centre image to fullscreen ────────────────────────
    at(P2_END, () => {
      animate(ci, { scale: 1 }, { duration: P3_DUR / 1000, ease: [0.16, 1, 0.3, 1] });
      animate(cw, { scale: 1 }, { duration: P3_DUR / 1000, ease: [0.16, 1, 0.3, 1] });
    });

    // ── Fade out preloader ───────────────────────────────────────────────
    at(P3_END, () => {
      animate(scope.current, { opacity: 0 }, { duration: FADE_DUR / 1000 });
    });

    at(P3_END + FADE_DUR, () => {
      onCompleteRef.current();
    });

    return () => timers.forEach(clearTimeout);
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
