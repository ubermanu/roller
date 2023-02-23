<svelte:options tag="auto-scroll" />

<script>
  export let visible = false
  export let image = null
  export let x = 0
  export let y = 0
  export let cursor = 'auto'
</script>

{#if visible}
  <div
    class="inner"
    style="transform: translateZ(0); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483647; background-repeat: no-repeat;"
    style:background-image={`url("${image}")`}
    style:background-position={`${x - 13}px ${y - 13}px`}
    style:cursor={cursor}
  />
{/if}
