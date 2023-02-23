/**
 * Stop event propagation
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
