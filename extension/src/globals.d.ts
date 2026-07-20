import type Overlay from './components/Overlay'
import type Roller from './Roller'

declare global {
  interface Window {
    roller: Roller
  }

  interface HTMLElementTagNameMap {
    'roller-overlay': Overlay
  }
}
