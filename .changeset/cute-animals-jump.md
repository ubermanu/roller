---
'@ubermanu/roller': patch
---

fix: relay iframe scroll messages through nested iframe chains

When triggering autoscroll inside a deeply nested iframe (e.g., page → wrapper iframe → YouTube embed), the scroll message was consumed by the intermediate iframe instead of reaching the top frame, causing autoscroll to fail.

**Root cause:** Two issues: (1) the `message` event listener in `init()` was only registered in the top frame (`if (!this.isInIframe)`), so intermediate iframes never listened for incoming messages. (2) `handleFrameMessage` always tried to scroll locally instead of relaying upward when the current frame was itself inside an iframe.

**Fix:** Register the message listener in all frames, and relay messages to `window.parent` when the current frame is inside an iframe, enabling proper chaining through arbitrarily nested iframe hierarchies.
