export default class Overlay extends HTMLElement {
  #el: HTMLElement

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
    this.#el = shadow.getElementById('overlay')!
  }

  set bgImage(value: string) {
    this.#el.style.backgroundImage = value ? `url("${value}")` : 'none'
  }

  set bgPosition(value: string) {
    this.#el.style.backgroundPosition = value
  }

  set cursor(value: string) {
    this.#el.style.cursor = value
  }
}

if (!customElements.get('roller-overlay')) {
  customElements.define('roller-overlay', Overlay)
}
