import React, { useCallback, useEffect, useState } from "react";
import { PageRenderer } from "./components/layout/PageRenderer";
import { Preloader } from "./components/Preloader/Preloader";
import pageConfig from "./config/page-content.json";
import "./index.css";

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const handlePreloaderComplete = useCallback(() => setPreloaderDone(true), []);

  // Block body scroll while preloader is covering the page
  useEffect(() => {
    document.body.style.overflow = preloaderDone ? "" : "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [preloaderDone]);

  return (
    <div className="w-full min-h-screen">
      {/* Page renders immediately underneath — images load during the ~7s animation */}
      <PageRenderer config={pageConfig} />

      {/* Preloader sits on top (fixed, z-9999) and fades out when done */}
      {!preloaderDone && <Preloader onComplete={handlePreloaderComplete} />}
    </div>
  );
}

export default App;
