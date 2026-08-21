"use client";

/**
 * Route transition — each navigation remounts this template, replaying a soft
 * opacity fade (no transform, so fixed overlays keep their containing block).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
