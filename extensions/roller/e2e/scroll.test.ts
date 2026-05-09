import path from 'path'
import puppeteer, { Browser, Page } from 'puppeteer'
import { afterAll, beforeAll, expect, it } from 'vitest'

const pahToExtension = path.resolve(import.meta.dirname, '../dist')

let browser: Browser
let page: Page

beforeAll(async () => {
  browser = await puppeteer.launch({
    pipe: true,
    enableExtensions: [pahToExtension],
  })

  page = await browser.newPage()

  // Using a public URL because extensions sometimes aren't allowed to inject into data URLs by default
  await page.goto('https://en.wikipedia.org/wiki/Web_testing', {
    waitUntil: 'networkidle2',
  })

  // Set a predictable viewport
  await page.setViewport({ width: 800, height: 600 })
})

afterAll(async () => {
  await browser.close()
})

it('should trigger auto-scrolling on middle click and mouse movement', async () => {
  // Assert initial scroll position
  let scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBe(0)

  // Get the page's current target (the created tab), this ensures input events work
  const cdpSession = await page.target().createCDPSession()

  // The extension specifically checks `e.button === 0` for ctrl+left, `e.button === 1` for middle.
  // It also registers on mousedown.
  await cdpSession.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: 400,
    y: 300,
    button: 'middle',
    clickCount: 1,
  })

  await new Promise((r) => setTimeout(r, 100))

  // Release mouse (which activates the dragging state for roller)
  await cdpSession.send('Input.dispatchMouseEvent', {
    type: 'mouseReleased',
    x: 400,
    y: 300,
    button: 'middle',
    clickCount: 1,
  })

  await new Promise((r) => setTimeout(r, 100))

  // Move mouse structurally to trigger distance thresholds and direction
  // E.g. move downward
  await cdpSession.send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: 400,
    y: 500,
    button: 'none', // just mouse movement
  })

  // Roller continuously scrolls via requestAnimationFrame as long as the state is active
  await new Promise((r) => setTimeout(r, 1500))

  // Verify it scrolled down
  scrollY = await page.evaluate(() => window.scrollY)

  // Stop scrolling before assert to prevent hanging
  await cdpSession.send('Input.dispatchMouseEvent', {
    type: 'mousePressed',
    x: 400,
    y: 500,
    button: 'left',
    clickCount: 1,
  })

  expect(scrollY).toBeGreaterThan(10)
})
