import type { CSSProperties } from "react";

export const GOLD = "#D4AF37";
export const BLACK = "#080808";
export const WHITE = "#FFFFFF";

export const glass: CSSProperties = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(212,175,55,0.25)",
  backdropFilter: "blur(18px) saturate(160%)",
  WebkitBackdropFilter: "blur(18px) saturate(160%)",
  boxShadow: "0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
};

export const goldButton: CSSProperties = {
  background: `linear-gradient(135deg, #F3D774 0%, ${GOLD} 50%, #A8852A 100%)`,
  color: BLACK,
  fontWeight: 700,
  letterSpacing: "0.04em",
  border: "none",
  borderRadius: 999,
  padding: "12px 22px",
  cursor: "pointer",
  boxShadow: "0 6px 20px rgba(212,175,55,0.35)",
  transition: "transform .2s ease, box-shadow .2s ease",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(212,175,55,0.3)",
  borderRadius: 12,
  padding: "10px 12px",
  color: WHITE,
  outline: "none",
  fontSize: 15,
};

export const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 13,
  color: GOLD,
  marginBottom: 6,
  letterSpacing: "0.03em",
};
