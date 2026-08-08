"use client";

import { useEffect, useRef } from "react";

import { registerReveal } from "@/lib/reveal";

const variants = {
  up: "",
  left: "wl-reveal-left",
  right: "wl-reveal-right",
  scale: "wl-reveal-scale",
  fade: "wl-reveal-fade",
};

/**
 * Reveals its children once they scroll into view.
 *
 * Server-rendered markup is untouched — only opacity/transform change — so
 * nothing is hidden from crawlers. Without JS the <noscript> rule in the
 * layout keeps everything visible, and reduced-motion users skip the motion.
 */
export default function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => registerReveal(ref.current), []);

  return (
    <Tag
      ref={ref}
      className={`wl-reveal ${variants[variant] || ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
