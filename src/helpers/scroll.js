export function canScroll(style) {
  return style === 'auto' || style === 'scroll'
}

/**
 * Shows scrollbar:
 *   <html>   <body>
 *   visible  visible
 *   visible  auto
 *   visible  scroll
 *   auto     visible
 *   auto     auto
 *   auto     scroll
 *   auto     hidden
 *   scroll   visible
 *   scroll   auto
 *   scroll   scroll
 *   scroll   hidden
 *
 * Does not show scrollbar:
 *   <html>   <body>
 *   visible  hidden
 *   hidden   visible
 *   hidden   auto
 *   hidden   scroll
 *   hidden   hidden
 */
export function canScrollTop(html, body) {
  switch (html) {
    case 'visible':
      return body !== 'hidden'
    case 'auto':
    case 'scroll':
      return true
    default:
      return false
  }
}

export function findScrollNormal(elem) {
  let style = getComputedStyle(elem)
  let width = canScroll(style.overflowX) && elem.scrollWidth > elem.clientWidth
  let height = canScroll(style.overflowY) && elem.scrollHeight > elem.clientHeight

  if (width || height) {
    return {
      element: elem,
      scroller: elem,
      width: width,
      height: height,
      root: false,
    }
  } else {
    return null
  }
}
