import type Overlay from './components/Overlay'

declare global {
  interface HTMLElementTagNameMap {
    'roller-overlay': Overlay
  }
}
