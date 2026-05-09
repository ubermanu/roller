import originBoth from '../images/origin/both.svg'
import originHorizontal from '../images/origin/horizontal.svg'
import originVertical from '../images/origin/vertical.svg'

/**
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
export function hypot(x, y) {
  return Math.sqrt(x * x + y * y)
}

/**
 * @param {number} num
 * @param {number} cap
 * @returns {number | any}
 */
export function min(num, cap) {
  let neg = cap * -1
  return num > neg && num < 0 ? neg : num < cap && num > 0 ? cap : num
}

/**
 * @param {number} num
 * @param {number} cap
 * @returns {any | number}
 */
export function max(num, cap) {
  let neg = cap * -1
  return num > cap ? cap : num < neg ? neg : num
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

/**
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
export function angle(x, y) {
  let angle = Math.atan2(y, x) * (180 / Math.PI)
  if (angle < 0) {
    angle += 360
  }
  return angle
}

/**
 * @param {number} angle
 * @returns {string}
 */
export function getCursorStyleFromAngle(angle) {
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

export function getImageFromScrollNormal(o) {
  if (o.width && o.height) {
    return originBoth
  } else if (o.width) {
    return originHorizontal
  } else {
    return originVertical
  }
}

/**
 * Stop event propagation
 *
 * @param {Event} e
 * @param {boolean} preventDefault
 */
export function stopEvent(e, preventDefault = false) {
  e.stopImmediatePropagation()
  e.stopPropagation()

  if (preventDefault) {
    e.preventDefault()
  }
}
