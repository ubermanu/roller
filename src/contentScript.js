import defaults from './defaultOptions'
import AutoScroll from './components/AutoScroll.svelte'

const htmlNode = document.documentElement

// TODO: Restore listener on option changes
if (chrome?.storage?.local) {
  chrome?.storage?.local.get(defaults, (options) => {
    htmlNode.appendChild(new AutoScroll({ props: { options } }))
  })
} else {
  htmlNode.appendChild(new AutoScroll())
}
