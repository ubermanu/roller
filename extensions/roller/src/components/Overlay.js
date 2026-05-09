class Overlay extends HTMLElement {
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

if (!customElements.get('roller-overlay')) {
  customElements.define('roller-overlay', Overlay)
}

export default Overlay
