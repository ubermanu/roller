/** @public */
export default class Overlay extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.innerHTML = `
      <style>
        #overlay {
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
      <div id="overlay"></div>
    `
    this.#el = shadow.getElementById('overlay')
  }

  #el

  /** @param {string} value */
  set bgImage(value) {
    this.#el.style.backgroundImage = value ? `url("${value}")` : 'none'
  }

  /** @param {string} value */
  set bgPosition(value) {
    this.#el.style.backgroundPosition = value
  }

  /** @param {string} value */
  set cursor(value) {
    this.#el.style.cursor = value
  }
}

if (!customElements.get('roller-overlay')) {
  customElements.define('roller-overlay', Overlay)
}
