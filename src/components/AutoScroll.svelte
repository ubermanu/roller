<svelte:options tag="auto-scroll" />

<script>
  import { onMount } from 'svelte'
  import math from '../helpers/math'
  import { getStyleFromAngle, getImageFromScrollNormal } from '../helpers/cursor'
  import { canScrollTop, findScrollNormal } from '../helpers/scroll'
  import defaultOptions from '../defaultOptions'

  export let options = defaultOptions

  let visible = false
  let image = null
  let x = 0
  let y = 0
  let cursor = 'auto'

  const state = {
    timeout: null,
    oldX: null,
    oldY: null,
    dirX: 0,
    dirY: 0,
    click: false,
    scrolling: false,
  }

  let htmlNode = document.documentElement
  // This is needed to support SVG
  let bodyNode = document.body ? document.body : htmlNode

  // Keep default scroll behavior
  // TODO: Handle current container behavior?
  // TODO: Test for SVG
  const scrollBehavior = htmlNode.style.scrollBehavior

  /**
   * The timer that does the actual scrolling; must be very fast so that the scrolling is smooth.
   * @param elem
   * @param scroller
   * @param root
   */
  function startCycle(elem, scroller, root) {
    // This is needed to support SVG
    let scrollX = root ? window.scrollX : scroller.scrollLeft,
      scrollY = root ? window.scrollY : scroller.scrollTop

    function loop() {
      state.timeout = requestAnimationFrame(loop)

      let scrollWidth = scroller.scrollWidth - elem.clientWidth,
        scrollHeight = scroller.scrollHeight - elem.clientHeight

      scrollX += state.dirX
      scrollY += state.dirY

      if (scrollX < 0) {
        scrollX = 0
      } else if (scrollX > scrollWidth) {
        scrollX = scrollWidth
      }

      if (scrollY < 0) {
        scrollY = 0
      } else if (scrollY > scrollHeight) {
        scrollY = scrollHeight
      }

      // This is needed to support SVG
      if (root) {
        // This triggers a reflow
        window.scroll(scrollX, scrollY)
      } else {
        // This triggers a reflow
        scroller.scrollLeft = scrollX
        scroller.scrollTop = scrollY
      }
    }

    loop()
  }

  /**
   * @param x
   * @param y
   * @returns {boolean}
   */
  function shouldSticky(x, y) {
    return options.stickyScroll && math.hypot(x, y) < options.dragThreshold
  }

  /**
   * @param value
   * @returns {number}
   */
  function scale(value) {
    return value / options.moveSpeed
  }

  /**
   * @param {WheelEvent} event
   */
  function mousewheel(event) {
    // TODO is this a good idea ?
    stopEvent(event, true)
  }

  /**
   * @param {MouseEvent} event
   */
  function mousemove(event) {
    // TODO is this a good idea ?
    stopEvent(event, true)

    let x = event.clientX - state.oldX,
      y = event.clientY - state.oldY

    if (math.hypot(x, y) > options.moveThreshold) {
      //state.stickyScroll = false;

      cursor = getStyleFromAngle(math.angle(x, y))

      // 10 = 5
      // 5  = 10
      // 1  = 50
      if (options.sameSpeed) {
        x = math.max(x, 1) * 50
        //(Options.get("moveSpeed") * 0.04);
        y = math.max(y, 1) * 50
        //(Options.get("moveSpeed") * 0.04);
      }

      x = scale(x)
      y = scale(y)

      if (options.shouldCap) {
        x = math.max(x, options.capSpeed)
        y = math.max(y, options.capSpeed)
      }

      state.dirX = x
      state.dirY = y
    } else {
      cursor = 'auto'

      state.dirX = 0
      state.dirY = 0
    }
  }

  /**
   * @param {MouseEvent} event
   */
  function mouseup(event) {
    // TODO is this a good idea ?
    stopEvent(event, true)

    let x = event.clientX - state.oldX,
      y = event.clientY - state.oldY

    if (state.click || !shouldSticky(x, y)) {
      unclick()
    } else {
      state.click = true
    }
  }

  function unclick() {
    cancelAnimationFrame(state.timeout)
    state.timeout = null

    removeEventListener('wheel', mousewheel, true)
    removeEventListener('mousemove', mousemove, true)
    removeEventListener('mouseup', mouseup, true)

    visible = false
    cursor = 'auto'

    state.oldX = null
    state.oldY = null

    state.dirX = 0
    state.dirY = 0

    state.click = false
    state.scrolling = false

    // Restore scroll behavior
    htmlNode.style.setProperty('scroll-behavior', scrollBehavior)
  }

  function show(o, _x, _y) {
    state.scrolling = true
    state.oldX = _x
    state.oldY = _y

    startCycle(o.element, o.scroller, o.root)

    addEventListener('wheel', mousewheel, true)
    addEventListener('mousemove', mousemove, true)
    addEventListener('mouseup', mouseup, true)

    visible = true
    image = getImageFromScrollNormal(o)
    x = _x
    y = _y

    // Force normal scroll behavior to fix the unresponsive movements
    htmlNode.style.setProperty('scroll-behavior', 'auto')
  }

  function isInvalid(elem) {
    return (
      elem.isContentEditable ||
      (elem.localName === 'a' && elem.href) ||
      (elem.localName === 'area' && elem.href) ||
      (elem.localName === 'textarea' && isEditableText(elem)) ||
      (elem.localName === 'input' && isEditableText(elem))
    )
  }

  function isEditableText(elem) {
    return !(elem.disabled || elem.readOnly)
  }

  function isValid(elem) {
    if (options.scrollOnLinks) {
      return true
    } else {
      while (true) {
        if (elem == null) {
          return false
        } else if (elem === document || elem === htmlNode || elem === bodyNode) {
          return true
        } else if (elem.host) {
          elem = elem.host
        } else if (isInvalid(elem)) {
          return false
        } else {
          elem = elem.parentNode
        }
      }
    }
  }

  // TODO this isn't quite correct, but it's close enough
  function findScrollTop(element) {
    let scroller = document.scrollingElement ? document.scrollingElement : bodyNode

    let htmlStyle = getComputedStyle(htmlNode)
    let bodyStyle = getComputedStyle(bodyNode)

    let width = canScrollTop(htmlStyle.overflowX, bodyStyle.overflowX) && scroller.scrollWidth > element.clientWidth
    let height = canScrollTop(htmlStyle.overflowY, bodyStyle.overflowY) && scroller.scrollHeight > element.clientHeight

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
  function findScroll(elem) {
    if (options.innerScroll) {
      while (elem !== document && elem !== htmlNode && elem !== bodyNode) {
        if (elem == null) {
          return null
        } else if (elem.host) {
          elem = elem.host
        } else {
          let x = findScrollNormal(elem)
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

  function stopEvent(e, preventDefault) {
    e.stopImmediatePropagation()
    e.stopPropagation()

    if (preventDefault) {
      e.preventDefault()
    }
  }

  function onmousedown(e) {
    if (state.scrolling) {
      stopEvent(e, true)
    } else {
      let path = e.composedPath()
      // TODO use e.target instead of null ?
      let target = path.length === 0 ? null : path[0]

      if (
        target != null &&
        ((e.button === 1 && options.middleClick) || (e.button === 0 && (e.ctrlKey || e.metaKey) && options.ctrlClick)) &&
        // Make sure the click is not on a scrollbar
        // TODO what about using middle click on the scrollbar of a non-<html> element ?
        e.clientX < htmlNode.clientWidth &&
        e.clientY < htmlNode.clientHeight &&
        isValid(target)
      ) {
        let elem = findScroll(target)

        if (elem !== null) {
          stopEvent(e, true)
          show(elem, e.clientX, e.clientY)
        }
      }
    }
  }

  onMount(() => {
    addEventListener('mousedown', onmousedown, true)
  })
</script>

{#if visible}
  <div
    class="inner"
    style="transform: translateZ(0); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483647; background-repeat: no-repeat;"
    style:background-image={`url("${image}")`}
    style:background-position={`${x - 13}px ${y - 13}px`}
    style:cursor={cursor}
  />
{/if}
