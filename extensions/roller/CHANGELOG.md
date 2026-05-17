# @ubermanu/roller

## 2.0.0

### Major Changes

- 03e4fee: Rework the whole extension, improved tooling and updated dependencies.

### Patch Changes

- 887b442: Relay iframe scroll messages through nested iframe chains.
- 02cd542: When triggering autoscroll inside an iframe (e.g., HuggingFace Spaces, YouTube embedded videos), the anchor icon was displaced downward by the amount the parent page was scrolled, causing immediate upward scrolling instead of the expected behavior.
