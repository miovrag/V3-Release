"use client";

import { useCallback } from "react";
import Spline from "@splinetool/react-spline";
import type { Application } from "@splinetool/runtime";

interface Props {
  sceneUrl: string;
  overlay: string;
}

export default function SplineBackground({ sceneUrl, overlay }: Props) {
  const onLoad = useCallback((app: Application) => {
    const a = app as unknown as Record<string, unknown>;
    const scene = a._scene as { traverse?: (fn: (obj: unknown) => void) => void } | undefined;
    scene?.traverse?.((obj) => {
      const o = obj as { _mixer?: { timeScale: number } };
      if (o._mixer) {
        o._mixer.timeScale = 0.5;
      }
    });
  }, []);

  return (
    <>
      <div
        style={{
          position: "absolute", inset: 0,
          pointerEvents: "none", overflow: "hidden",
        }}
      >
        <Spline
          scene={sceneUrl}
          onLoad={onLoad}
          style={{
            width: "100%", height: "100%",
            transform: "scale(1.6)",
            transformOrigin: "center center",
          }}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, background: overlay, pointerEvents: "none" }} />
    </>
  );
}
