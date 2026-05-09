import type { DocumentContext, ScrollResult } from '../types'

function canScroll(style: string): boolean {
  return style === 'auto' || style === 'scroll' || style === 'visible'
}

function canScrollContainer(style: string): boolean {
  return style === 'auto' || style === 'scroll'
}

function findScrollNormal(elem: HTMLElement | null): ScrollResult | null {
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
      width,
      height,
      root: false,
    }
  }
  return null
}

export function getDocumentContext(): DocumentContext {
  const htmlNode = document.documentElement
  const bodyNode = document.body ?? htmlNode
  const scroller = document.scrollingElement ?? bodyNode
  return {
    htmlNode,
    bodyNode,
    scroller,
  }
}

export function findScrollTop(element: HTMLElement): ScrollResult | null {
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
      element,
      scroller,
      width,
      height,
      root: true,
    }
  }
  return null
}

export function findScroll(
  elem: Node | null,
  innerScroll: boolean = false
): ScrollResult | null {
  const { htmlNode, bodyNode } = getDocumentContext()

  if (innerScroll) {
    while (elem !== document && elem !== htmlNode && elem !== bodyNode) {
      if (elem == null) {
        return null
      } else if ((elem as any).host instanceof ShadowRoot) {
        elem = (elem as any).host
      } else {
        const x = findScrollNormal(elem as HTMLElement)
        if (x === null) {
          elem = (elem as HTMLElement).parentNode
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
    return findScrollNormal(bodyNode)
  }
  return findScrollTop(bodyNode)
}

export function isScrollable(elem: Node | null): boolean {
  const { htmlNode, bodyNode } = getDocumentContext()

  while (true) {
    if (elem == null) {
      return false
    } else if (elem === document || elem === htmlNode || elem === bodyNode) {
      return true
    } else if ((elem as any).host instanceof ShadowRoot) {
      elem = (elem as any).host
    } else if (isInput(elem as HTMLElement)) {
      return false
    } else {
      elem = (elem as HTMLElement).parentNode
    }
  }
}

function isInput(elem: HTMLElement): boolean {
  return !!(
    elem.isContentEditable ||
    (elem.localName === 'a' && (elem as HTMLAnchorElement).href) ||
    (elem.localName === 'area' && (elem as HTMLAreaElement).href) ||
    (elem.localName === 'textarea' &&
      isEditableText(elem as HTMLTextAreaElement | HTMLInputElement)) ||
    (elem.localName === 'input' &&
      isEditableText(elem as HTMLTextAreaElement | HTMLInputElement))
  )
}

function isEditableText(elem: HTMLTextAreaElement | HTMLInputElement): boolean {
  return !(elem.disabled || elem.readOnly)
}
