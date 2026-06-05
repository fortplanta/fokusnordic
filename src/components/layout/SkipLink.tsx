/**
 * Keyboard-only skip-to-content link.
 * Invisible until focused — Tab on any page reveals it at the top.
 * Target: <main id="main"> in page.tsx.
 */
export default function SkipLink() {
  return (
    <a href="#main" className="skip-link">
      Skip to main content
    </a>
  )
}
