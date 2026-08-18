import Link from "next/link";
import { clsx } from "@/lib/clsx";

/** Overline — small all-caps for labels, categorisation, map labels. */
export function Overline({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={clsx("overline", className)}>{children}</div>;
}

type ButtonVariant = "primary" | "secondary" | "tertiary";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all duration-200 focus-ring disabled:opacity-50 disabled:pointer-events-none";
const buttonVariant: Record<ButtonVariant, string> = {
  primary:
    "bg-terracotta text-paper shadow-card hover:bg-terracotta-dark hover:shadow-raised hover:-translate-y-px active:translate-y-0",
  secondary:
    "bg-paper text-ink border border-ink/15 shadow-card hover:border-ink/35 hover:shadow-raised hover:-translate-y-px active:translate-y-0",
  tertiary: "bg-transparent text-ink-80 hover:text-ink",
};

interface ButtonProps {
  variant?: ButtonVariant;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  size?: "md" | "lg";
  type?: "button" | "submit";
  "aria-label"?: string;
}

export function Button({
  variant = "primary",
  href,
  onClick,
  children,
  className,
  size = "md",
  type = "button",
  ...rest
}: ButtonProps) {
  const sizing = size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5";
  const cls = clsx(buttonBase, buttonVariant[variant], sizing, className);
  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls} {...rest}>
      {children}
    </button>
  );
}

/** Filter chip — selectable, not a heavy form control. */
export function Chip({
  children,
  active,
  onClick,
  as = "button",
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  as?: "button" | "span";
  className?: string;
}) {
  const cls = clsx(
    "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] transition-all duration-200",
    active
      ? "border-transparent bg-ink text-paper shadow-card"
      : "border-ink/15 bg-paper text-ink-80 hover:border-ink/40 hover:text-ink",
    className
  );
  if (as === "span") return <span className={cls}>{children}</span>;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(cls, "focus-ring")}
    >
      {children}
    </button>
  );
}

/**
 * Abstract textured placeholder evoking stone / sun-bleached surfaces.
 * Used wherever cleared photography is not yet available (never fake photos).
 */
export function HatchImage({
  className,
  label,
  tone = "stone",
  children,
}: {
  className?: string;
  label?: string;
  tone?: "stone" | "night" | "sky";
  children?: React.ReactNode;
}) {
  const toneCls =
    tone === "night"
      ? "bg-night"
      : tone === "sky"
        ? "map-surface"
        : "hatch";
  return (
    <div
      role="img"
      aria-label={label ?? "Immagine non disponibile — segnaposto"}
      className={clsx("relative overflow-hidden", toneCls, className)}
    >
      {children}
      {label && tone !== "stone" ? null : null}
    </div>
  );
}

/** Quiet card surface. */
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-ink/10 bg-paper shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  overline,
  title,
  action,
  className,
}: {
  overline?: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-end justify-between gap-4", className)}>
      <div>
        {overline && <Overline className="mb-2">{overline}</Overline>}
        <h2 className="font-serif text-2xl leading-tight md:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
