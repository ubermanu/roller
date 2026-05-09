---
'@ubermanu/roller': patch
---

When triggering autoscroll inside an iframe (e.g., HuggingFace Spaces, YouTube embedded videos), the anchor icon was displaced downward by the amount the parent page was scrolled, causing immediate upward scrolling instead of the expected behavior.

**Root cause:** The coordinate transformation in `handleFrameMessage` added `window.scrollX/scrollY` to viewport-relative `clientX/clientY` coordinates from the iframe. Since the overlay uses `position: fixed` with `background-position` (already viewport-relative), the scroll offset caused a double-counting displacement.

**Fix:** Removed the scroll offset addition, keeping only the iframe's viewport offset (`rect.left/rect.top`) to map iframe coordinates to the parent page's viewport.
