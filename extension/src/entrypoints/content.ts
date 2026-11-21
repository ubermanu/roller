import '@webcomponents/custom-elements'
import { browser } from 'wxt/browser'
import { defineContentScript } from 'wxt/utils/define-content-script'
import Overlay from '../components/Overlay'
import defaults from '../defaultOptions'
import Roller from '../Roller'
import type { RollerOptions } from '../types'

export default defineContentScript({
  matches: ['<all_urls>'],
  allFrames: true,
  runAt: 'document_end',

  async main() {
    if (!customElements.get('roller-overlay')) {
      customElements.define('roller-overlay', Overlay)
    }

    const roller = new Roller()
    window.roller = roller

    const options = await browser.storage.local.get<RollerOptions>(defaults)

    if (navigator.platform === 'Win32' && options.disableOnWindows) {
      return
    }

    roller.options = options
    roller.init()
  },
})
