import React from "react";
import { PageRenderer } from "./components/layout/PageRenderer";
import pageConfig from "./config/page-content.json";
import "./index.css";

function App() {
  return (
    <div className="w-full min-h-screen bg-white">
      <PageRenderer config={pageConfig} />
    </div>
  );
}

export default App;
