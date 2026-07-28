export const LAUNCH_SCREEN_COLORS = {
  background: "#F8BFD0",
  ink: "#FFF9FB",
  inkMuted: "rgba(255, 249, 251, 0.82)",
  inkSoft: "rgba(255, 249, 251, 0.35)",
};

export const LAUNCH_SCREEN_TIMINGS = {
  appear: 140,
  write: 1000,
  settle: 160,
  bounce: 1700,
  expand: 320,
};

export const LAUNCH_SCREEN_TYPOGRAPHY = {
  fontFamily: "Caveat, 'Apple Chancery', 'Trebuchet MS', serif",
  fontWeight: "700" as const,
  letterSpacing: 1.2,
};

export const LAUNCH_SCREEN_BOUNCE = {
  minHeight: 8,
  maxHeight: 22,
  minCycle: 430,
  maxCycle: 370,
};
