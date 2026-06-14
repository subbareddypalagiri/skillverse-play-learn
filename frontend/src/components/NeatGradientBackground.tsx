import { useEffect, useRef } from "react";
import { NeatGradient } from "@firecms/neat";

export const NEAT_GRADIENT_CONFIG = {
  colors: [
    { color: "#A24141", enabled: true },
    { color: "#17E7FF", enabled: true },
    { color: "#FFC600", enabled: true },
    { color: "#8B6AE6", enabled: true },
    { color: "#FFFFFF", enabled: true },
    { color: "#FF75B5", enabled: true },
  ],
  speed: 4.5,
  horizontalPressure: 3,
  verticalPressure: 4,
  waveFrequencyX: 2.5,
  waveFrequencyY: 2.5,
  waveAmplitude: 6,
  shadows: 10,
  highlights: 1,
  colorBrightness: 1,
  colorSaturation: 0,
  wireframe: false,
  colorBlending: 3,
  backgroundColor: "#E4E4E4",
  backgroundAlpha: 1,
  grainScale: 4,
  grainSparsity: 0,
  grainIntensity: 0,
  grainSpeed: 0.5,
  resolution: 0.9,
  yOffset: 77462.66670227051,
  yOffsetWaveMultiplier: 4,
  yOffsetColorMultiplier: 4,
  yOffsetFlowMultiplier: 10,
  flowDistortionA: 1.2,
  flowDistortionB: 1.8,
  flowScale: 1.5,
  flowEase: 0.25,
  flowEnabled: false,
  enableProceduralTexture: false,
  transparentTextureVoid: false,
  textureVoidLikelihood: 0.27,
  textureVoidWidthMin: 60,
  textureVoidWidthMax: 420,
  textureBandDensity: 1.2,
  textureColorBlending: 0.06,
  textureSeed: 333,
  textureEase: 0.5,
  proceduralBackgroundColor: "#0E0707",
  textureShapeTriangles: 20,
  textureShapeCircles: 15,
  textureShapeBars: 15,
  textureShapeSquiggles: 10,
  domainWarpEnabled: false,
  domainWarpIntensity: 0,
  domainWarpScale: 3,
  vignetteIntensity: 0.25,
  vignetteRadius: 0.35,
  fresnelEnabled: false,
  fresnelPower: 1.3,
  fresnelIntensity: 0,
  fresnelColor: "#ffffff",
  iridescenceEnabled: false,
  iridescenceIntensity: 0.8,
  iridescenceSpeed: 1.5,
  bloomIntensity: 0.1,
  bloomThreshold: 0.1,
  chromaticAberration: 3,
  shapeType: "sphere" as const,
  shapeRotationX: -2.49,
  shapeRotationY: -0.89,
  shapeRotationZ: 0,
  shapeAutoRotateSpeedX: 1,
  shapeAutoRotateSpeedY: 1.2,
  sphereRadius: 21,
  torusRadius: 15,
  torusTube: 5,
  cylinderRadius: 10,
  cylinderHeight: 40,
  planeBend: 0,
  planeTwist: 0,
  silhouetteFade: 0.55,
  cylinderFade: 0.08,
  ribbonFade: 0.05,
  flatShading: false,
  cameraLock: false,
  cameraX: 22.5,
  cameraY: 0,
  cameraZ: 0,
  cameraRotationX: 0.86,
  cameraRotationY: -0.007,
  cameraRotationZ: 0,
  cameraZoom: 2.6,
};

interface NeatGradientBackgroundProps {
  scrollReactive?: boolean;
}

export default function NeatGradientBackground({ scrollReactive = true }: NeatGradientBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<NeatGradient | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      ...NEAT_GRADIENT_CONFIG,
    });

    const onScroll = () => {
      if (gradientRef.current && scrollReactive) {
        gradientRef.current.yOffset = window.scrollY;
      }
    };

    if (scrollReactive) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      if (scrollReactive) window.removeEventListener("scroll", onScroll);
      gradientRef.current?.destroy();
      gradientRef.current = null;
    };
  }, [scrollReactive]);

  return (
    <canvas
      id="gradient"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ isolation: "isolate" }}
    />
  );
}
