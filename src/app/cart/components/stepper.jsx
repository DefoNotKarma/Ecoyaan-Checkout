"use client";
import C from './colorPalette'

const STEPS = ["Your Info", "Delivery", "Review", "Payment"];

export default function Stepper({ current }) {
  return (
    <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>

      {/* Connector lines */}
      {STEPS.slice(0, -1).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: "17px",
          left:  `calc(${(i / (STEPS.length - 1)) * 100}% + 20px)`,
          width: `calc(${(1  / (STEPS.length - 1)) * 100}% - 40px)`,
          height: "2px",
          background: i + 1 < current ? C.primary : "#e5e7eb",
          borderRadius: "2px",
          transition: "background 0.3s",
        }} />
      ))}

      {/* Step circles + labels */}
      {STEPS.map((label, i) => {
        const idx = i + 1, active = idx === current, done = idx < current;
        return (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", zIndex: 1 }}>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: done || active ? C.primary : "#e5e7eb",
              border: active ? `2px solid ${C.primaryLight}` : "2px solid transparent",
              boxShadow: active ? "0 0 0 4px #bbf7d0" : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: done || active ? "#fff" : C.textMuted,
              fontSize: "0.8rem", fontWeight: "700",
              transition: "all 0.3s",
            }}>
              {done
                ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                : idx}
            </div>
            <span style={{
              fontSize: "0.72rem",
              fontWeight: active ? "700" : "500",
              color: active ? C.primary : C.textMuted,
              whiteSpace: "nowrap",
            }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}