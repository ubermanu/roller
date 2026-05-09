import '@webcomponents/custom-elements'
import Roller from './Roller'
import defaults from './defaultOptions'

const roller = new Roller()

chrome?.storage?.local?.get(defaults, (options) => {
  if (navigator.platform === 'Win32' && options.disableOnWindows) {
    return
  }
  roller.options = options
  roller.init()
})

export default roller
