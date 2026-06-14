interface PremiumAmbientBackgroundProps {
  variant?: "default" | "vibe";
  className?: string;
}

/** User gradient: #636FA4 → #E8CBC0 — applied on all app pages except Home */
const GRADIENT_FROM = "#636FA4";
const GRADIENT_TO = "#E8CBC0";

export default function PremiumAmbientBackground({
  variant = "default",
  className = "",
}: PremiumAmbientBackgroundProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`} aria-hidden>
      {/* Base gradient — uiGradients style */}
      <div
        className="absolute inset-0"
        style={{
          background: GRADIENT_TO,
          backgroundImage: `linear-gradient(to right, ${GRADIENT_FROM}, ${GRADIENT_TO})`,
        }}
      />

      {/* Slow motion — soft shimmer drift in same palette */}
      <div
        className="absolute inset-0 opacity-60 gradient-motion-a"
        style={{
          background: `linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.12) 45%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-40 gradient-motion-b"
        style={{
          background: `linear-gradient(245deg, rgba(99,111,164,0.25) 0%, transparent 50%, rgba(232,203,192,0.35) 100%)`,
        }}
      />

      {/* Soft glow orbs — same colours, subtle depth */}
      <div
        className="absolute -top-20 -left-20 w-[min(500px,70vw)] h-[min(500px,70vw)] rounded-full ambient-drift-a opacity-50"
        style={{
          background: `radial-gradient(circle, ${GRADIENT_FROM}88 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute -bottom-32 -right-16 w-[min(560px,75vw)] h-[min(560px,75vw)] rounded-full ambient-drift-b opacity-55"
        style={{
          background: `radial-gradient(circle, ${GRADIENT_TO}cc 0%, transparent 68%)`,
          filter: "blur(70px)",
        }}
      />
      {variant === "vibe" && (
        <div
          className="absolute top-1/3 right-1/4 w-[min(400px,60vw)] h-[min(400px,60vw)] rounded-full ambient-drift-c opacity-35"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 65%)",
            filter: "blur(80px)",
          }}
        />
      )}

      {/* Light grain for premium texture */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export { GRADIENT_FROM, GRADIENT_TO };
