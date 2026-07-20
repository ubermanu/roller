# @ubermanu/roller

## 2.0.1

### Patch Changes

- 8bf259f: chore(deps-dev): bump the development-dependencies group across 1 directory with 6 updates
- f11fea8: Use maxDragDistance instead of release distance to prevent releases close to the origin from entering sticky-mode.
- f11fea8: Correct swapped threshold labels in the options UI and all i18n translations.

## 2.0.0

### Major Changes

- 03e4fee: Rework the whole extension, improved tooling and updated dependencies.

### Patch Changes

- 887b442: Relay iframe scroll messages through nested iframe chains.
- 02cd542: When triggering autoscroll inside an iframe (e.g., HuggingFace Spaces, YouTube embedded videos), the anchor icon was displaced downward by the amount the parent page was scrolled, causing immediate upward scrolling instead of the expected behavior.
