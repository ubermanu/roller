import '@webcomponents/custom-elements'
import Roller from './Roller'
import defaults from './defaultOptions'
import type { RollerOptions } from './types'

const roller = new Roller()

chrome?.storage?.local?.get(defaults, (options: RollerOptions) => {
  if (navigator.platform === 'Win32' && options.disableOnWindows) {
    return
  }
  roller.options = options
  roller.init()
})

export default roller
