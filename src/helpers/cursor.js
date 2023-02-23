import originBoth from '../images/origin/both.svg'
import originHorizontal from '../images/origin/horizontal.svg'
import originVertical from '../images/origin/vertical.svg'

/**
 * @param {number} angle
 * @return {string}
 */
export function getStyleFromAngle(angle) {
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
