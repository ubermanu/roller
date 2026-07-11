export interface OverlayHandle {
  setBgImage: (value: string) => void
  setBgPosition: (value: string) => void
  setCursor: (value: string) => void
  remove: () => void
}

export default function createOverlay(): OverlayHandle {
  const overlay = document.createElement('div')
  overlay.id = 'roller-overlay'
  overlay.style.position = 'fixed'
  overlay.style.top = '0'
  overlay.style.left = '0'
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.zIndex = '2147483647'
  overlay.style.backgroundRepeat = 'no-repeat'
  overlay.style.transform = 'translateZ(0)'
  overlay.style.display = 'block'

  document.documentElement.appendChild(overlay)

  return {
    setBgImage(value: string) {
      overlay.style.backgroundImage = value ? `url("${value}")` : 'none'
    },
    setBgPosition(value: string) {
      overlay.style.backgroundPosition = value
    },
    setCursor(value: string) {
      overlay.style.cursor = value
    },
    remove() {
      overlay.remove()
    },
  }
}
