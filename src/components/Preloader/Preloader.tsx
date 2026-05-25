import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./Preloader.css";

// ─── images ────────────────────────────────────────────────────────────────
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

/**
 * Scatter offsets for each of the 8 images, expressed as
 * [xVw, yVh] from the viewport center. Derived from the
 * original CSS scattered positions + each image's half-size.
 *
 * Original CSS (top-left corner)     Image size
 * img[1]  top:59.9vh  left:75.3vw   16.7vw × 20.6vh  →  cx=83.65vw cy=70.2vh
 * img[2]  top:43.2vh  left:26.3vw   12.5vw × 25.7vh  →  cx=32.55vw cy=56.05vh
 * img[3]  top:25.1vh  left:55.7vw   12.5vw × 25.7vh  →  cx=61.95vw cy=37.95vh
 * img[4]  top:16.4vh  left:76.3vw   16.7vw × 20.6vh  →  cx=84.65vw cy=26.7vh
 * img[5]  top:61.7vh  left:49vw     12.5vw × 25.7vh  →  cx=55.25vw cy=74.55vh
 * img[6]  top:20.1vh  left:11vw     12.5vw × 25.7vh  →  cx=17.25vw cy=32.95vh
 * img[7]  top:69.6vh  left:6.8vw    16.7vw × 20.6vh  →  cx=15.15vw cy=79.9vh
 * img[8]  top:35vh    left:88vw     16.7vw × 20.6vh  →  cx=96.35vw cy=45.3vh
 * Offset = cx - 50vw, cy - 50vh
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
];

// ─── component ─────────────────────────────────────────────────────────────
interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const imagesWrapperRef = useRef<HTMLDivElement>(null);
  const centerImageWrapperRef = useRef<HTMLDivElement>(null);
  const centerImageRef = useRef<HTMLImageElement>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    const imagesWrapper = imagesWrapperRef.current;
    const centerImageWrapper = centerImageWrapperRef.current;
    const centerImage = centerImageRef.current;
    if (!root || !imagesWrapper || !centerImageWrapper || !centerImage) return;

    const imgs = [...imagesWrapper.querySelectorAll<HTMLImageElement>("img")];

    // Convert vw/vh offsets to pixels once (at animation start)
    const vw = window.innerWidth / 100;
    const vh = window.innerHeight / 100;
    const scatter = SCATTER_VW_VH.map(([x, y]) => ({
      x: x * vw,
      y: y * vh,
    }));

    const ctx = gsap.context(() => {
      // ── Initial state ─────────────────────────────────────────────────
      // All images anchored at center (top:50% left:50% from CSS) and
      // offset by xPercent/yPercent so their visual center = viewport center.
      // Then shifted by scatter offset + 80px below.
      imgs.forEach((img, i) => {
        gsap.set(img, {
          xPercent: -50,
          yPercent: -50,
          x: scatter[i].x,
          y: scatter[i].y + 80,
          opacity: 0,
        });
      });

      // Center image: fully centered, tiny scale, hidden below
      gsap.set(centerImageWrapper, {
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 80,
        scale: 0.15,
        opacity: 0,
      });
      gsap.set(centerImage, { scale: 1.5 });

      // ── Phase 1: fade up into scatter positions ──────────────────────
      const allTargets = [...imgs, centerImageWrapper];
      gsap.to(allTargets, {
        y: (_i, el) =>
          el === centerImageWrapper ? 0 : scatter[imgs.indexOf(el as HTMLImageElement)].y,
        opacity: 1,
        duration: 2,
        ease: "power3.inOut",
        stagger: 0.07,
        onComplete: phase2,
      });

      // ── Phase 2: converge all to center ─────────────────────────────
      function phase2() {
        gsap.to(allTargets, {
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "expo.inOut",
          stagger: 0.08,
          onComplete: phase3,
        });
      }

      // ── Phase 3: scale center image to fullscreen ────────────────────
      function phase3() {
        gsap
          .timeline()
          .to(centerImageWrapper, { scale: 1, duration: 1.5, ease: "expo.inOut" })
          .to(centerImage, { scale: 1, duration: 1.5, ease: "expo.inOut" }, 0)
          .to(
            root,
            {
              opacity: 0,
              duration: 0.5,
              ease: "power2.inOut",
              onComplete: () => onCompleteRef.current(),
            },
            "-=0.15"
          );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div className="intro" ref={rootRef}>
      <div className="intro__images" ref={imagesWrapperRef}>
        {SCATTERED_IMAGES.map((src, i) => (
          <img key={i} src={src} alt="" aria-hidden="true" />
        ))}
      </div>
      <div className="intro__center-image" ref={centerImageWrapperRef}>
        <img ref={centerImageRef} src={CENTER_IMAGE} alt="" aria-hidden="true" />
      </div>
    </div>
  );
};
