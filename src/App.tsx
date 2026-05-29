import { useCallback, useEffect, useState } from "react";
import { PageRenderer } from "./components/layout/PageRenderer";
import { Preloader } from "./components/Preloader/Preloader";
import { Nav } from "./components/Nav/Nav";
import { DesignPanel } from "./components/DesignPanel/DesignPanel";
import { bootOverrides } from "./lib/designOverrides";
import type { PageConfig } from "./types/sections";
import rawConfig from "./config/page-content.json";
import "./index.css";

const pageConfig = rawConfig as unknown as PageConfig;
const isStyleGuide = window.location.pathname === "/styleguide";

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), []);

  // Boot design overrides on every page load:
  //   - applies any localStorage overrides immediately to :root
  //   - opens a BroadcastChannel so this tab receives live updates from /styleguide
  useEffect(() => {
    const cleanup = bootOverrides();
    return cleanup;
  }, []);

  if (isStyleGuide) {
    return <DesignPanel />;
  }

  // Block body scroll while preloader is covering the page
  useEffect(() => {
    document.body.style.overflow = preloaderDone ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [preloaderDone]);

  return (
    <div className="w-full min-h-screen">
      {preloaderDone && <Nav />}
      <PageRenderer config={pageConfig} />
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
    </div>
  );
}

export default App;
