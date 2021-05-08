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
