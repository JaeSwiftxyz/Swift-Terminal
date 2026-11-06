"use client";

import { useEffect, useState } from "react";

// Full-screen boot overlay: huge white SWIFT TERMINAL, one glitch pass,
// then a fade to the live terminal. Rendered by the root layout so it paints
// with the very first HTML byte; unmounts itself once done.
type Phase = "show" | "glitch" | "fade" | "gone";

export default function BootIntro() {
  const [phase, setPhase] = useState<Phase>("show");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glitch"), 1000);
    const t2 = setTimeout(() => setPhase("fade"), 1450);
    const t3 = setTimeout(() => setPhase("gone"), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div className={`boot boot-${phase}`} aria-hidden="true">
      <div className="boot-stack">
        <span className="boot-layer boot-r">
          SWIFT
          <br />
          TERMINAL
        </span>
        <span className="boot-layer boot-c">
          SWIFT
          <br />
          TERMINAL
        </span>
        <span className="boot-layer boot-main">
          SWIFT
          <br />
          TERMINAL
        </span>
      </div>
    </div>
  );
}
