"use client";

/**
 * One shared, rAF-throttled visibility checker for every <Reveal> on the page.
 *
 * A single listener is both cheaper and more reliable than one
 * IntersectionObserver per element: observer callbacks can be missed during
 * fast or programmatic scrolling, which left elements permanently invisible.
 */

const pending = new Set();
let listening = false;
let queued = false;

const MARGIN = 60; // reveal once the element's top is this far inside the viewport

function reveal(el) {
  el.classList.add("wl-in");
  pending.delete(el);
}

function check() {
  queued = false;
  const vh = window.innerHeight || document.documentElement.clientHeight;

  pending.forEach((el) => {
    if (!el.isConnected) {
      pending.delete(el);
      return;
    }
    const rect = el.getBoundingClientRect();
    // in view, or already scrolled past
    if (rect.top < vh - MARGIN && rect.bottom > 0) reveal(el);
    else if (rect.bottom <= 0) reveal(el);
  });

  if (!pending.size) stop();
}

function schedule() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(check);
}

function start() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

export function registerReveal(el) {
  if (!el) return () => {};

  const reduced =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    el.classList.add("wl-in");
    return () => {};
  }

  pending.add(el);
  start();
  schedule();

  return () => {
    pending.delete(el);
    if (!pending.size) stop();
  };
}
