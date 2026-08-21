"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

/** The element in the top bar that screen-specific controls are placed into. */
export const TOOLBAR_SLOT = "wl-admin-toolbar";

/**
 * Reads the slot element out of the DOM without an effect, so nothing is
 * rendered into a stale node and no state update happens during mount. On the
 * server it reports null, which is what makes the portal client-only.
 */
function useSlot() {
  return useSyncExternalStore(
    // The slot lives in a layout that outlives every screen, so it never
    // changes identity once painted — nothing to subscribe to.
    () => () => {},
    () => document.getElementById(TOOLBAR_SLOT),
    () => null
  );
}

/**
 * Renders its children into the admin top bar.
 *
 * A screen with its own controls — the calendar's date navigation, the view
 * switch — would otherwise need a second bar of its own directly under the
 * first, which costs a row of height and reads as two headers.
 */
export default function AdminToolbar({ children }) {
  const slot = useSlot();
  if (!slot) return null;
  return createPortal(children, slot);
}
