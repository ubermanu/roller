import originBoth from '../images/origin/both.svg'
import originHorizontal from '../images/origin/horizontal.svg'
import originVertical from '../images/origin/vertical.svg'
import type { ScrollResult } from '../types'

export function hypot(x: number, y: number): number {
  return Math.sqrt(x * x + y * y)
}

export function max(num: number, cap: number): number {
  const neg = cap * -1
  return num > cap ? cap : num < neg ? neg : num
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function angle(x: number, y: number): number {
  let angle = Math.atan2(y, x) * (180 / Math.PI)
  if (angle < 0) {
    angle += 360
  }
  return angle
}

export function getCursorStyleFromAngle(angle: number): string {
  if (angle < 30 || angle >= 330) {
    return 'e-resize'
  } else if (angle < 60) {
    return 'se-resize'
  } else if (angle < 120) {
    return 's-resize'
  } else if (angle < 150) {
    return 'sw-resize'
  } else if (angle < 210) {
    return 'w-resize'
  } else if (angle < 240) {
    return 'nw-resize'
  } else if (angle < 300) {
    return 'n-resize'
  } else {
    return 'ne-resize'
  }
}

export function getImageFromScrollNormal(o: ScrollResult): string {
  if (o.width && o.height) {
    return originBoth
  } else if (o.width) {
    return originHorizontal
  } else {
    return originVertical
  }
}

export function stopEvent(e: Event, preventDefault: boolean = false): void {
  e.stopImmediatePropagation()
  e.stopPropagation()

  if (preventDefault) {
    e.preventDefault()
  }
}
