declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.svelte' {
  import type { ComponentType } from 'svelte'
  const component: ComponentType
  export default component
}
