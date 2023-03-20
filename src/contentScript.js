import '@webcomponents/custom-elements'
import defaults from './defaultOptions'
import AutoScroll from './components/AutoScroll.svelte'

const htmlNode = document.documentElement
const autoScroll = new AutoScroll()

// TODO: Restore listener on option changes
chrome?.storage?.local.get(defaults, (options) => {
  if (navigator.platform === 'Win32' && options.disableOnWindows) {
    return
  }
  autoScroll.$$set({ options })
  htmlNode.appendChild(autoScroll)
})

export default autoScroll
