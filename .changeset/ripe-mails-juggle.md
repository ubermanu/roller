---
'@ubermanu/roller': patch
---

When triggering autoscroll inside an iframe (e.g., HuggingFace Spaces, YouTube embedded videos), the anchor icon was displaced downward by the amount the parent page was scrolled, causing immediate upward scrolling instead of the expected behavior.
