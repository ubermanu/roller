import Overlay from './components/Overlay'
import defaultOptions from './defaultOptions'
import { findScroll, findScrollTop, getDocumentContext } from './helpers/scroll'
import * as utils from './helpers/utils'
import type { RollerOptions, ScrollResult } from './types'

interface FrameMessageData {
  type: string
  action: string
  clientX?: number
  clientY?: number
  frameId?: string
}

export default class Roller {
  options: RollerOptions
  visible: boolean
  backgroundImage: string | null
  backgroundPositionX: number
  backgroundPositionY: number
  cursor: string
  timeout: number | null
  oldX: number | null
  oldY: number | null
  dirX: number
  dirY: number
  clicked: boolean
  scrolling: boolean
  overlay: Overlay | null
  isInIframe: boolean
  frameId: string
  iframeScrolling: boolean
  iframeOldX: number | null
  iframeOldY: number | null

  // Pending (pre-threshold) state
  pendingX: number | null
  pendingY: number | null
  pendingTarget: HTMLElement | null
  pendingButton: number
  pendingCtrl: boolean
  pendingMeta: boolean
  handlePendingMouseMove: ((e: MouseEvent) => void) | null
  handlePendingMouseUp: ((e: MouseEvent) => void) | null

  htmlNode: HTMLElement
  bodyNode: HTMLElement
  htmlScrollBehavior: string
  bodyScrollBehavior: string

  constructor() {
    this.options = defaultOptions
    this.visible = false
    this.backgroundImage = null
    this.backgroundPositionX = 0
    this.backgroundPositionY = 0
    this.cursor = 'auto'
    this.timeout = null
    this.oldX = null
    this.oldY = null
    this.dirX = 0
    this.dirY = 0
    this.clicked = false
    this.scrolling = false
    this.overlay = null
    this.isInIframe = window !== window.top
    this.frameId = Math.random().toString(36).substring(2, 10)
    this.iframeScrolling = false
    this.iframeOldX = null
    this.iframeOldY = null

    this.pendingX = null
    this.pendingY = null
    this.pendingTarget = null
    this.pendingButton = 0
    this.pendingCtrl = false
    this.pendingMeta = false
    this.handlePendingMouseMove = null
    this.handlePendingMouseUp = null

    const { htmlNode, bodyNode } = getDocumentContext()
    this.htmlNode = htmlNode
    this.bodyNode = bodyNode
    this.htmlScrollBehavior = htmlNode.style.scrollBehavior
    this.bodyScrollBehavior = bodyNode.style.scrollBehavior

    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseWheel = this.handleMouseWheel.bind(this)
    this.handleFrameMessage = this.handleFrameMessage.bind(this)
  }

  init(): void {
    addEventListener('mousedown', this.handleMouseDown, true)
    addEventListener('message', this.handleFrameMessage)
  }

  destroy(): void {
    this.stop()
    removeEventListener('mousedown', this.handleMouseDown, true)
    removeEventListener('message', this.handleFrameMessage)
  }

  startCycle(
    _elem: Element | HTMLElement,
    scroller: Element | HTMLElement,
    root: boolean
  ): void {
    const scrollerStyle = getComputedStyle(scroller)
    const rowReverse = scrollerStyle.flexDirection === 'row-reverse'
    const colReverse = scrollerStyle.flexDirection === 'column-reverse'

    const loop = (): void => {
      this.timeout = requestAnimationFrame(loop)

      let scrollX = root ? window.scrollX : scroller.scrollLeft
      let scrollY = root ? window.scrollY : scroller.scrollTop

      const scrollWidth = scroller.scrollWidth - scroller.clientWidth
      const scrollHeight = scroller.scrollHeight - scroller.clientHeight

      scrollX = utils.clamp(
        scrollX + this.dirX,
        rowReverse ? -scrollWidth : 0,
        rowReverse ? 0 : scrollWidth
      )
      scrollY = utils.clamp(
        scrollY + this.dirY,
        colReverse ? -scrollHeight : 0,
        colReverse ? 0 : scrollHeight
      )

      if (root) {
        window.scroll(scrollX, scrollY)
      } else {
        scroller.scrollLeft = scrollX
        scroller.scrollTop = scrollY
      }
    }

    loop()
  }

  shouldSticky(x: number, y: number): boolean {
    return (
      this.options.stickyScroll &&
      utils.hypot(x, y) < this.options.dragThreshold
    )
  }

  scale(value: number): number {
    return value / this.options.moveSpeed
  }

  handleMouseWheel(event: WheelEvent): void {
    utils.stopEvent(event, true)
  }

  handleMouseMove(event: MouseEvent): void {
    utils.stopEvent(event, true)

    const x = event.clientX - this.oldX!
    const y = event.clientY - this.oldY!

    if (utils.hypot(x, y) > this.options.moveThreshold) {
      this.cursor = utils.getCursorStyleFromAngle(utils.angle(x, y))

      let dx = x
      let dy = y

      if (this.options.sameSpeed) {
        dx = utils.max(dx, 1) * 50
        dy = utils.max(dy, 1) * 50
      }

      dx = this.scale(dx)
      dy = this.scale(dy)

      if (this.options.shouldCap) {
        dx = utils.max(dx, this.options.capSpeed)
        dy = utils.max(dy, this.options.capSpeed)
      }

      this.dirX = dx
      this.dirY = dy
    } else {
      this.cursor = 'auto'
      this.dirX = 0
      this.dirY = 0
    }
  }

  handleMouseUp(event: MouseEvent): void {
    utils.stopEvent(event, true)

    const x = event.clientX - this.oldX!
    const y = event.clientY - this.oldY!

    if (this.clicked || !this.shouldSticky(x, y)) {
      this.stop()
    } else {
      this.clicked = true
    }
  }

  stop(): void {
    if (this.timeout !== null) {
      cancelAnimationFrame(this.timeout)
      this.timeout = null
    }

    removeEventListener('wheel', this.handleMouseWheel, true)
    removeEventListener('mousemove', this.handleMouseMove, true)
    removeEventListener('mouseup', this.handleMouseUp, true)

    this.visible = false
    this.cursor = 'auto'
    this.oldX = null
    this.oldY = null
    this.dirX = 0
    this.dirY = 0
    this.clicked = false
    this.scrolling = false
    this.iframeScrolling = false
    this.iframeOldX = null
    this.iframeOldY = null

    if (this.overlay) {
      this.overlay.remove()
      this.overlay = null
    }

    this.htmlNode.style.setProperty('scroll-behavior', this.htmlScrollBehavior)
    this.bodyNode.style.setProperty('scroll-behavior', this.bodyScrollBehavior)
  }

  clearPending(): void {
    if (this.handlePendingMouseMove) {
      removeEventListener('mousemove', this.handlePendingMouseMove, true)
      this.handlePendingMouseMove = null
    }
    if (this.handlePendingMouseUp) {
      removeEventListener('mouseup', this.handlePendingMouseUp, true)
      this.handlePendingMouseUp = null
    }
    this.pendingX = null
    this.pendingY = null
    this.pendingTarget = null
    this.pendingButton = 0
    this.pendingCtrl = false
    this.pendingMeta = false
  }

  start(o: ScrollResult, x: number, y: number): void {
    this.scrolling = true
    this.oldX = x
    this.oldY = y

    this.startCycle(o.element, o.scroller, o.root)

    addEventListener('wheel', this.handleMouseWheel, true)
    addEventListener('mousemove', this.handleMouseMove, true)
    addEventListener('mouseup', this.handleMouseUp, true)

    this.visible = true
    this.backgroundImage = utils.getImageFromScrollNormal(o)
    this.backgroundPositionX = x
    this.backgroundPositionY = y

    this.updateOverlay()

    this.htmlNode.style.setProperty('scroll-behavior', 'auto', 'important')
    this.bodyNode.style.setProperty('scroll-behavior', 'auto', 'important')
  }

  updateOverlay(): void {
    if (this.visible) {
      if (!this.overlay) {
        this.overlay = document.createElement('roller-overlay')
        document.documentElement.appendChild(this.overlay)
      }
      this.overlay.bgImage = this.backgroundImage ?? ''
      this.overlay.bgPosition = `${this.backgroundPositionX - 13}px ${this.backgroundPositionY - 13}px`
      this.overlay.cursor = this.cursor
    }
  }

  handleFrameMessage(event: MessageEvent<FrameMessageData | undefined>): void {
    if (event.data?.type !== 'roller-scroll') {
      return
    }

    const iframe = this.findIframeByWindow(event.source as Window | null)
    if (!iframe) {
      return
    }

    const rect = iframe.getBoundingClientRect()
    const x = (event.data.clientX ?? 0) + rect.left
    const y = (event.data.clientY ?? 0) + rect.top

    if (event.data.action === 'start') {
      if (this.isInIframe) {
        window.parent.postMessage(
          {
            type: 'roller-scroll',
            action: 'start',
            clientX: x,
            clientY: y,
            frameId: event.data.frameId,
          },
          '*'
        )
        this.iframeScrolling = true
        this.iframeOldX = x
        this.iframeOldY = y
      } else {
        const elem = findScrollTop(this.htmlNode)
        if (elem) {
          this.iframeScrolling = true
          this.start(elem, x, y)
          this.iframeOldX = x
          this.iframeOldY = y
        }
      }
    } else if (event.data.action === 'move' && this.iframeScrolling) {
      if (this.isInIframe) {
        window.parent.postMessage(
          {
            type: 'roller-scroll',
            action: 'move',
            clientX: x,
            clientY: y,
            frameId: event.data.frameId,
          },
          '*'
        )
        this.iframeOldX = x
        this.iframeOldY = y
      } else {
        const dx = x - this.iframeOldX!
        const dy = y - this.iframeOldY!

        if (utils.hypot(dx, dy) > this.options.moveThreshold) {
          this.cursor = utils.getCursorStyleFromAngle(utils.angle(dx, dy))

          let scrollDx = dx
          let scrollDy = dy

          if (this.options.sameSpeed) {
            scrollDx = utils.max(scrollDx, 1) * 50
            scrollDy = utils.max(scrollDy, 1) * 50
          }

          scrollDx = this.scale(scrollDx)
          scrollDy = this.scale(scrollDy)

          if (this.options.shouldCap) {
            scrollDx = utils.max(scrollDx, this.options.capSpeed)
            scrollDy = utils.max(scrollDy, this.options.capSpeed)
          }

          this.dirX = scrollDx
          this.dirY = scrollDy
        } else {
          this.cursor = 'auto'
          this.dirX = 0
          this.dirY = 0
        }

        this.iframeOldX = x
        this.iframeOldY = y
        this.backgroundPositionX = x
        this.backgroundPositionY = y
        this.updateOverlay()
      }
    } else if (event.data.action === 'stop' && this.iframeScrolling) {
      if (this.isInIframe) {
        window.parent.postMessage(
          {
            type: 'roller-scroll',
            action: 'stop',
            frameId: event.data.frameId,
          },
          '*'
        )
      }
      this.iframeScrolling = false
      this.iframeOldX = null
      this.iframeOldY = null
    }
  }

  findIframeByWindow(win: Window | null): HTMLIFrameElement | null {
    if (!win) return null
    for (const iframe of document.querySelectorAll('iframe')) {
      if (iframe.contentWindow === win) {
        return iframe
      }
    }
    return null
  }

  handleMouseDown(event: MouseEvent): void {
    if (this.scrolling) {
      utils.stopEvent(event, true)
      return
    }

    const path = event.composedPath()
    const target = path.find((node) => (node as Node).nodeType === 1) as
      | HTMLElement
      | null
      | undefined

    if (
      target != null &&
      target.localName !== 'iframe' &&
      ((event.button === 1 && this.options.middleClick) ||
        (event.button === 0 &&
          (event.ctrlKey || event.metaKey) &&
          this.options.ctrlClick)) &&
      event.clientX < this.htmlNode.clientWidth &&
      event.clientY < this.htmlNode.clientHeight
    ) {
      // Prevent default immediately so links don't navigate before we know
      // whether the user is dragging or just clicking.
      event.preventDefault()

      const pendingX = event.clientX
      const pendingY = event.clientY
      const pendingButton = event.button
      const pendingCtrl = event.ctrlKey
      const pendingMeta = event.metaKey

      this.pendingX = pendingX
      this.pendingY = pendingY
      this.pendingTarget = target
      this.pendingButton = pendingButton
      this.pendingCtrl = pendingCtrl
      this.pendingMeta = pendingMeta

      const onMove = (e: MouseEvent): void => {
        const dx = e.clientX - pendingX
        const dy = e.clientY - pendingY

        if (utils.hypot(dx, dy) > this.options.dragThreshold) {
          this.clearPending()
          utils.stopEvent(e, true)

          if (this.isInIframe && !this.options.innerScroll) {
            // Bubble up to parent frame
            window.parent.postMessage(
              {
                type: 'roller-scroll',
                action: 'start',
                clientX: pendingX,
                clientY: pendingY,
                frameId: this.frameId,
              },
              '*'
            )
            this.iframeOldX = pendingX
            this.iframeOldY = pendingY

            const handleIframeMouseMove = (ev: MouseEvent): void => {
              window.parent.postMessage(
                {
                  type: 'roller-scroll',
                  action: 'move',
                  clientX: ev.clientX,
                  clientY: ev.clientY,
                  frameId: this.frameId,
                },
                '*'
              )
            }

            const handleIframeMouseUp = (): void => {
              window.parent.postMessage(
                {
                  type: 'roller-scroll',
                  action: 'stop',
                  frameId: this.frameId,
                },
                '*'
              )
              removeEventListener('mousemove', handleIframeMouseMove, true)
              removeEventListener('mouseup', handleIframeMouseUp, true)
            }

            addEventListener('mousemove', handleIframeMouseMove, true)
            addEventListener('mouseup', handleIframeMouseUp, true)
          } else {
            const elem = findScroll(target, this.options.innerScroll)
            if (elem !== null) {
              this.start(elem, pendingX, pendingY)
              this.handleMouseMove(e)
            }
          }
        }
      }

      const onUp = (e: MouseEvent): void => {
        this.clearPending()
        // User released without crossing the drag threshold — synthesize the
        // native action that preventDefault() suppressed.
        const link =
          (e.target as HTMLElement | null)?.closest?.('a[href]') ??
          (target.localName === 'a' && (target as HTMLAnchorElement).href
            ? target
            : null)
        if (link || pendingButton === 1) {
          // Fire a synthetic click so links still work
          target.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              button: pendingButton,
              ctrlKey: pendingCtrl,
              metaKey: pendingMeta,
              clientX: pendingX,
              clientY: pendingY,
            })
          )
        }
      }

      this.handlePendingMouseMove = onMove
      this.handlePendingMouseUp = onUp

      addEventListener('mousemove', onMove, true)
      addEventListener('mouseup', onUp, true)
    }
  }
}
