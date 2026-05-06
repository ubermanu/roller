class RollerOverlay extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2147483647;
          background-repeat: no-repeat;
          transform: translateZ(0);
          display: block;
        }
      </style>
    `
  }

  set bgImage(value) {
    this.style.backgroundImage = value ? `url("${value}")` : 'none'
  }

  set bgPosition(value) {
    this.style.backgroundPosition = value
  }

  set cursor(value) {
    this.style.cursor = value
  }
}

function createOverlay() {
  const overlay = document.createElement('div')
  overlay.style.transform = 'translateZ(0)'
  overlay.style.position = 'fixed'
  overlay.style.top = '0'
  overlay.style.left = '0'
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.zIndex = '2147483647'
  overlay.style.backgroundRepeat = 'no-repeat'

  Object.defineProperty(overlay, 'bgImage', {
    configurable: true,
    set(value) {
      this.style.backgroundImage = value ? `url("${value}")` : 'none'
    },
  })

  Object.defineProperty(overlay, 'bgPosition', {
    configurable: true,
    set(value) {
      this.style.backgroundPosition = value
    },
  })

  Object.defineProperty(overlay, 'cursor', {
    configurable: true,
    set(value) {
      this.style.cursor = value
    },
  })

  return overlay
}

export { createOverlay }
