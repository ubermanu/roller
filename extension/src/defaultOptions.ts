import type { RollerOptions } from './types'

const defaultOptions: RollerOptions = {
  dragThreshold: 10,
  moveThreshold: 10,
  moveSpeed: 10,
  stickyScroll: true,
  innerScroll: true,
  scrollOnLinks: true,
  sameSpeed: false,
  capSpeed: 10,
  shouldCap: false,
  ctrlClick: false,
  middleClick: true,
  disableOnWindows: true,
}

export default defaultOptions
