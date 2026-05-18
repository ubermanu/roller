import path from 'path'
import puppeteer, { Browser, Page, Realm } from 'puppeteer'
import { afterAll, beforeAll, expect, it } from 'vitest'

const pathToExtension = path.resolve(import.meta.dirname, '../dist')

let browser: Browser
let page: Page
let extensionRealm: Realm

beforeAll(async () => {
  browser = await puppeteer.launch({
    pipe: true,
    enableExtensions: true,
    args: process.env.CI ? ['--no-sandbox', '--disable-setuid-sandbox'] : [],
  })

  const extensionId = await browser.installExtension(pathToExtension)

  page?.close()
  page = await browser.newPage()

  // Intercept any requests and return empty body, so it can be injected at test level
  await page.setRequestInterception(true)
  page.on('request', (request) => {
    request.respond({
      status: 200,
      contentType: 'text/html',
      body: '',
    })
  })

  await page.goto('https://example.com', { waitUntil: 'load' })

  // Find extension realm
  const realm = page
    .extensionRealms()
    .find((r) => r.origin === `chrome-extension://${extensionId}`)
  if (!realm) throw new Error('Extension realm not found')
  extensionRealm = realm

  // Set a predictable viewport
  await page.setViewport({ width: 800, height: 600 })
})

afterAll(async () => {
  await browser.close()
})

it('should trigger auto-scrolling on middle click and mouse movement', async () => {
  await page.evaluate(() => {
    document.body.style.height = '5000px'
  })

  // Assert initial scroll position
  await page.evaluate(() => window.scrollTo(0, 0))
  let scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBe(0)

  // Move and press middle button
  await page.mouse.move(200, 200)
  await page.mouse.down({ button: 'middle' })
  await new Promise((r) => setTimeout(r, 100))

  // Release middle button to trigger sticky scroll
  await page.mouse.up({ button: 'middle' })
  await new Promise((r) => setTimeout(r, 100))

  // Move mouse down
  await page.mouse.move(200, 300)

  // Wait for scrolling to occur
  await new Promise((r) => setTimeout(r, 1500))

  // Verify it scrolled down
  scrollY = await page.evaluate(() => window.scrollY)

  // Stop scrolling
  await page.mouse.down({ button: 'left' })
  await page.mouse.up({ button: 'left' })

  expect(scrollY).toBeGreaterThan(10)
})

it('should trigger auto-scrolling on Ctrl+Left click if ctrlClick is enabled', async () => {
  await page.evaluate(() => {
    document.body.style.height = '5000px'
  })

  await extensionRealm.evaluate(() => {
    window.roller.options.ctrlClick = true
  })

  let scrollY = await page.evaluate(() => {
    window.scrollTo(0, 0)
    return window.scrollY
  })
  expect(scrollY).toBe(0)

  // Press Ctrl key
  await page.keyboard.down('Control')

  // Move and press left click
  await page.mouse.move(200, 200)
  await page.mouse.down({ button: 'left' })
  await new Promise((r) => setTimeout(r, 100))

  await page.mouse.up({ button: 'left' })

  // Release Ctrl key
  await page.keyboard.up('Control')

  await new Promise((r) => setTimeout(r, 100))

  // Move mouse downward
  await page.mouse.move(200, 300)

  await new Promise((r) => setTimeout(r, 1500))

  scrollY = await page.evaluate(() => window.scrollY)

  // Stop scrolling
  await page.mouse.down({ button: 'left' })
  await page.mouse.up({ button: 'left' })

  expect(scrollY).toBeGreaterThan(10)
})

it('should scroll an inner element if innerScroll is enabled', async () => {
  await page.evaluate(() => {
    document.body.innerHTML =
      '<div id="inner-box" style="width:400px;height:200px;overflow:scroll"><div style="height:5000px"></div></div>'
  })

  // Get coordinates of the inner box
  const innerBoxRect = await page.evaluate(() => {
    window.scrollTo(0, 0)
    const box = document.getElementById('inner-box')
    if (!box) return null
    const rect = box.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    }
  })

  if (!innerBoxRect) throw new Error('Box not found')

  // Ensure inner box is initially at scroll 0
  let innerScrollY = await page.evaluate(() => {
    return document.getElementById('inner-box')?.scrollTop || 0
  })
  expect(innerScrollY).toBe(0)

  // Middle click inside the box
  await page.mouse.move(innerBoxRect.x, innerBoxRect.y)
  await page.mouse.down({ button: 'middle' })
  await new Promise((r) => setTimeout(r, 100))

  await page.mouse.up({ button: 'middle' })
  await new Promise((r) => setTimeout(r, 100))

  // Move mouse downward within the box bounds
  await page.mouse.move(innerBoxRect.x, innerBoxRect.y + 100)

  await new Promise((r) => setTimeout(r, 1500))

  // Check window didn't scroll much, but inner box scrolled
  const mainScrollY = await page.evaluate(() => window.scrollY)
  innerScrollY = await page.evaluate(() => {
    return document.getElementById('inner-box')?.scrollTop || 0
  })

  // Stop scrolling
  await page.mouse.down({ button: 'left' })
  await page.mouse.up({ button: 'left' })

  expect(mainScrollY).toBe(0) // Window shouldn't have scrolled
  expect(innerScrollY).toBeGreaterThan(10) // Inner box should have scrolled
})

it('should NOT trigger sticky scrolling when stickyScroll is disabled', async () => {
  // Reset options with stickyScroll disabled
  await extensionRealm.evaluate(() => {
    Object.assign(window.roller.options, {
      dragThreshold: 10,
      moveThreshold: 10,
      moveSpeed: 10,
      stickyScroll: false,
      innerScroll: true,
      sameSpeed: false,
      capSpeed: 10,
      shouldCap: false,
      ctrlClick: false,
      middleClick: true,
      disableOnWindows: true,
    })
  })
  await new Promise((r) => setTimeout(r, 200))

  // Set up a tall page
  await page.evaluate(() => {
    document.body.style.height = '5000px'
  })

  // Reset scroll to 0 and assert it's 0
  await page.evaluate(() => window.scrollTo(0, 0))
  let scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBe(0)

  // Middle-click sequence
  await page.mouse.move(200, 200)
  await page.mouse.down({ button: 'middle' })
  await new Promise((r) => setTimeout(r, 100))
  await page.mouse.up({ button: 'middle' })
  await new Promise((r) => setTimeout(r, 100))
  await page.mouse.move(200, 300)
  await new Promise((r) => setTimeout(r, 1500))

  // Read scrollY
  scrollY = await page.evaluate(() => window.scrollY)

  // Stop scrolling
  await page.mouse.down({ button: 'left' })
  await page.mouse.up({ button: 'left' })

  // Assert that scroll did NOT happen (stickyScroll is disabled)
  expect(scrollY).toBeLessThan(5)
})

it('should trigger scrolling when dragging on a link past the drag threshold', async () => {
  // Reset all roller options to defaults
  await extensionRealm.evaluate(() => {
    Object.assign(window.roller.options, {
      dragThreshold: 10,
      moveThreshold: 10,
      moveSpeed: 10,
      stickyScroll: true,
      innerScroll: true,
      sameSpeed: false,
      capSpeed: 10,
      shouldCap: false,
      ctrlClick: false,
      middleClick: true,
      disableOnWindows: true,
    })
  })
  await new Promise((r) => setTimeout(r, 200))

  // Set up a page with a link and tall body
  await page.evaluate(() => {
    document.body.innerHTML = `
      <a href="#" id="test-link" style="display:block;margin:100px;padding:40px;border:1px solid black">Click me</a>
      <div style="height:5000px"></div>
    `
  })
  await new Promise((r) => setTimeout(r, 200))

  const linkRect = await page.evaluate(() => {
    const link = document.getElementById('test-link')
    const rect = link!.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  })

  await page.evaluate(() => window.scrollTo(0, 0))
  let scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBe(0)

  // Middle-click on the link and drag down past the threshold while holding
  await page.mouse.move(linkRect.x, linkRect.y)
  await page.mouse.down({ button: 'middle' })
  await page.mouse.move(linkRect.x, linkRect.y + 50)
  await new Promise((r) => setTimeout(r, 1500))

  scrollY = await page.evaluate(() => window.scrollY)

  // Stop scrolling
  await page.mouse.up({ button: 'middle' })
  await page.mouse.down({ button: 'left' })
  await page.mouse.up({ button: 'left' })

  expect(scrollY).toBeGreaterThan(10)
})

it('should NOT trigger scrolling when clicking a link without dragging past the threshold', async () => {
  // Reset all roller options to defaults
  await extensionRealm.evaluate(() => {
    Object.assign(window.roller.options, {
      dragThreshold: 10,
      moveThreshold: 10,
      moveSpeed: 10,
      stickyScroll: true,
      innerScroll: true,
      sameSpeed: false,
      capSpeed: 10,
      shouldCap: false,
      ctrlClick: false,
      middleClick: true,
      disableOnWindows: true,
    })
  })
  await new Promise((r) => setTimeout(r, 200))

  await page.evaluate(() => {
    document.body.innerHTML = `
      <a href="#" id="test-link" style="display:block;margin:100px;padding:40px;border:1px solid black">Click me</a>
      <div style="height:5000px"></div>
    `
  })
  await new Promise((r) => setTimeout(r, 200))

  const linkRect = await page.evaluate(() => {
    const link = document.getElementById('test-link')
    const rect = link!.getBoundingClientRect()
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
  })

  await page.evaluate(() => window.scrollTo(0, 0))
  let scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBe(0)

  // Middle-click on the link and release immediately without dragging
  await page.mouse.move(linkRect.x, linkRect.y)
  await page.mouse.down({ button: 'middle' })
  await new Promise((r) => setTimeout(r, 50))
  await page.mouse.up({ button: 'middle' })

  // Wait to confirm no scrolling starts
  await new Promise((r) => setTimeout(r, 1000))

  scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBeLessThan(5)
})
