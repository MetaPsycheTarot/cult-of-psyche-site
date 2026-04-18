import { useEffect, useState } from "react";
import "./RitualizedLoading.css";

export interface RitualizedLoadingProps {
  message?: string;
  phase?: "awakening" | "channeling" | "revealing" | "ascending";
  duration?: number;
}

/**
 * Ritualized Loading Component
 * Creates immersive, symbolic loading experiences with mythological messaging
 */
export function RitualizedLoading({
  message = "The veil grows thin...",
  phase = "channeling",
  duration = 3000,
}: RitualizedLoadingProps) {
  const [displayText, setDisplayText] = useState("");
  const [dotCount, setDotCount] = useState(0);

  // Animate text reveal
  useEffect(() => {
    if (!message) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index <= message.length) {
        setDisplayText(message.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [message]);

  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const phaseStyles = {
    awakening: "ritual-awakening",
    channeling: "ritual-channeling",
    revealing: "ritual-revealing",
    ascending: "ritual-ascending",
  };

  return (
    <div className={`ritualized-loading ${phaseStyles[phase]}`}>
      <div className="ritual-container">
        {/* Outer mystical ring */}
        <div className="mystical-ring outer-ring"></div>

        {/* Middle symbolic ring */}
        <div className="mystical-ring middle-ring"></div>

        {/* Inner core */}
        <div className="ritual-core">
          {/* Symbolic center */}
          <div className="symbolic-center">
            <div className="center-glow"></div>
            <div className="center-symbol">✦</div>
          </div>

          {/* Orbiting elements */}
          <div className="orbit orbit-1">
            <div className="orbit-element">◆</div>
          </div>
          <div className="orbit orbit-2">
            <div className="orbit-element">◇</div>
          </div>
          <div className="orbit orbit-3">
            <div className="orbit-element">◆</div>
          </div>
        </div>

        {/* Mystical text */}
        <div className="ritual-text">
          <p className="ritual-message">{displayText}</p>
          <p className="ritual-dots">{"•".repeat(dotCount)}</p>
        </div>

        {/* Phase indicator */}
        <div className="phase-indicator">
          <span className="phase-label">{phase.toUpperCase()}</span>
        </div>
      </div>

      {/* Background mystical effect */}
      <div className="mystical-background">
        <div className="mystical-particle"></div>
        <div className="mystical-particle"></div>
        <div className="mystical-particle"></div>
        <div className="mystical-particle"></div>
        <div className="mystical-particle"></div>
      </div>
    </div>
  );
}

/**
 * Symbolic Transition Component
 * Creates smooth transitions between states with symbolic animations
 */
export function SymbolicTransition({
  isVisible = true,
  symbol = "✦",
  duration = 1000,
}: {
  isVisible: boolean;
  symbol?: string;
  duration?: number;
}) {
  return (
    <div
      className={`symbolic-transition ${isVisible ? "visible" : "hidden"}`}
      style={{
        "--transition-duration": `${duration}ms`,
      } as React.CSSProperties}
    >
      <div className="transition-symbol">{symbol}</div>
      <div className="transition-lines">
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
      </div>
    </div>
  );
}

/**
 * Ritual Progress Indicator
 * Shows progress through a ritual/process with symbolic stages
 */
export function RitualProgressIndicator({
  current = 1,
  total = 5,
  symbols = ["◆", "◇", "◆", "◇", "◆"],
}: {
  current?: number;
  total?: number;
  symbols?: string[];
}) {
  return (
    <div className="ritual-progress">
      <div className="progress-stages">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`progress-stage ${index < current ? "completed" : index === current ? "active" : "pending"}`}
          >
            <div className="stage-symbol">{symbols[index] || "◆"}</div>
            <div className="stage-line"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
