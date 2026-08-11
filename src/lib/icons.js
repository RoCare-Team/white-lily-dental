import {
  Activity,
  Baby,
  Bone,
  Brush,
  Crown,
  Droplets,
  Gem,
  HeartPulse,
  Layers,
  Microscope,
  Scissors,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  Syringe,
  Zap,
} from "lucide-react";

/**
 * Icons a service can use. Content is stored in MongoDB, which cannot hold a
 * React component — the database keeps the *name* and this map turns it back
 * into a component. Adding an icon here makes it appear in the admin picker.
 */
export const ICONS = {
  Smile,
  Bone,
  Sparkles,
  Activity,
  Crown,
  Layers,
  Scissors,
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Syringe,
  Microscope,
  Brush,
  Droplets,
  Gem,
  Baby,
  Zap,
};

export const ICON_NAMES = Object.keys(ICONS);

/** Resolves a stored icon name to a component, falling back to a safe default. */
export function getIcon(name) {
  return ICONS[name] ?? Smile;
}

/** Reverse lookup used when seeding the database from the old data files. */
export function iconNameOf(component) {
  if (!component) return null;
  const match = Object.entries(ICONS).find(([, value]) => value === component);
  if (match) return match[0];
  // lucide sets displayName, which is the name we store anyway.
  return component.displayName ?? null;
}
