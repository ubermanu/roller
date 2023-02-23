/**
 * @type {number}
 */
export const RAD_TO_DEG = Math.PI / 180

/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
export function hypot(x, y) {
  return Math.sqrt(x * x + y * y)
}

/**
 * @param {number} num
 * @param {number} cap
 * @return {number|*}
 */
export function min(num, cap) {
  let neg = cap * -1
  return num > neg && num < 0 ? neg : num < cap && num > 0 ? cap : num
}

/**
 * @param {number} num
 * @param {number} cap
 * @return {*|number}
 */
export function max(num, cap) {
  let neg = cap * -1
  return num > cap ? cap : num < neg ? neg : num
}

/**
 * @param {number} x
 * @param {number} y
 * @return {number}
 */
export function angle(x, y) {
  let angle = Math.atan(y / x) / RAD_TO_DEG
  if (x < 0) {
    angle += 180
  } else if (y < 0) {
    angle += 360
  }
  return angle
}
