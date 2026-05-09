function canScroll(style) {
  return style === 'auto' || style === 'scroll' || style === 'visible'
}

function canScrollContainer(style) {
  return style === 'auto' || style === 'scroll'
}

function findScrollNormal(elem) {
  if (!elem || elem.nodeType !== 1) {
    return null
  }
  const style = getComputedStyle(elem)
  const width =
    canScrollContainer(style.overflowX) && elem.scrollWidth > elem.clientWidth
  const height =
    canScrollContainer(style.overflowY) && elem.scrollHeight > elem.clientHeight

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
  const scroller = document.scrollingElement
    ? document.scrollingElement
    : bodyNode
  return {
    htmlNode,
    bodyNode,
    scroller,
  }
}

export function findScrollTop(element) {
  const { scroller } = getDocumentContext()

  const scrollerStyle = getComputedStyle(scroller)
  const width =
    canScroll(scrollerStyle.overflowX) &&
    scroller.scrollWidth > scroller.clientWidth
  const height =
    canScroll(scrollerStyle.overflowY) &&
    scroller.scrollHeight > scroller.clientHeight

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

export function findScroll(elem, innerScroll = false) {
  const { htmlNode, bodyNode } = getDocumentContext()

  if (innerScroll) {
    while (elem !== document && elem !== htmlNode && elem !== bodyNode) {
      if (elem == null) {
        return null
      } else if (elem.host instanceof ShadowRoot) {
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
    const result = findScrollTop(htmlNode)
    if (result) return result
    return findScrollNormal(bodyNode) ?? null
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
    } else if (elem.host instanceof ShadowRoot) {
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
 * @returns {boolean | any | false}
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
