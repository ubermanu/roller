import type Roller from './Roller'

declare global {
  interface Window {
    roller: Roller
  }
}
