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
  const style = getComputedStyle(elem)
  const width = canScroll(style.overflowX) && elem.scrollWidth > elem.clientWidth
  const height = canScroll(style.overflowY) && elem.scrollHeight > elem.clientHeight

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

export function getDocumentContext() {
  const htmlNode = document.documentElement
  const bodyNode = document.body ?? htmlNode
  const scroller = document.scrollingElement ? document.scrollingElement : bodyNode
  return {
    htmlNode,
    bodyNode,
    scroller,
  }
}

// TODO this isn't quite correct, but it's close enough
export function findScrollTop(element) {
  const { htmlNode, bodyNode, scroller } = getDocumentContext()

  const htmlStyle = getComputedStyle(htmlNode)
  const bodyStyle = getComputedStyle(bodyNode)

  const width = canScrollTop(htmlStyle.overflowX, bodyStyle.overflowX) && scroller.scrollWidth > element.clientWidth
  const height = canScrollTop(htmlStyle.overflowY, bodyStyle.overflowY) && scroller.scrollHeight > element.clientHeight

  if (width || height) {
    return {
      element: element,
      scroller: scroller,
      width: width,
      height: height,
      root: true,
    }
  } else {
    return null
  }
}

// TODO this should handle the case where <body> has its own scrollbar (separate from the viewport's scrollbar)
export function findScroll(elem, innerScroll = false) {
  const { htmlNode, bodyNode } = getDocumentContext()

  if (innerScroll) {
    while (elem !== document && elem !== htmlNode && elem !== bodyNode) {
      if (elem == null) {
        return null
      } else if (elem.host) {
        elem = elem.host
      } else {
        const x = findScrollNormal(elem)
        if (x === null) {
          elem = elem.parentNode
        } else {
          return x
        }
      }
    }
  }

  // hack needed to work around non-spec-compliant versions of Chrome
  // https://code.google.com/p/chromium/issues/detail?id=157855
  if (document.compatMode === 'CSS1Compat') {
    return findScrollTop(htmlNode)
  } else {
    return findScrollTop(bodyNode)
  }
}

/**
 * @param elem
 * @returns {boolean}
 */
export function isScrollable(elem) {
  const { htmlNode, bodyNode } = getDocumentContext()

  while (true) {
    if (elem == null) {
      return false
    } else if (elem === document || elem === htmlNode || elem === bodyNode) {
      return true
    } else if (elem.host) {
      elem = elem.host
    } else if (isInput(elem)) {
      return false
    } else {
      elem = elem.parentNode
    }
  }
}

/**
 * @param elem
 * @returns {boolean|*|false}
 */
function isInput(elem) {
  return (
    elem.isContentEditable ||
    (elem.localName === 'a' && elem.href) ||
    (elem.localName === 'area' && elem.href) ||
    (elem.localName === 'textarea' && isEditableText(elem)) ||
    (elem.localName === 'input' && isEditableText(elem))
  )
}

/**
 * @param elem
 * @returns {boolean}
 */
function isEditableText(elem) {
  return !(elem.disabled || elem.readOnly)
}
