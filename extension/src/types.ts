export interface RollerOptions {
  dragThreshold: number
  moveThreshold: number
  moveSpeed: number
  stickyScroll: boolean
  innerScroll: boolean
  scrollOnLinks: boolean
  sameSpeed: boolean
  capSpeed: number
  shouldCap: boolean
  ctrlClick: boolean
  middleClick: boolean
  disableOnWindows: boolean
}

export interface ScrollResult {
  element: Element | HTMLElement
  scroller: Element | HTMLElement
  width: boolean
  height: boolean
  root: boolean
}

export interface DocumentContext {
  htmlNode: HTMLElement
  bodyNode: HTMLElement
  scroller: Element
}
