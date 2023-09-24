<script>
  import chromeIcon from '$lib/images/chrome.svg'
  import firefoxIcon from '$lib/images/firefox.svg'
  import rollerIcon from '$lib/images/roller.svg'
  import svelteIcon from '$lib/images/svelte.svg'

  const downloads = [
    {
      name: 'Chrome',
      url: 'https://chrome.google.com/webstore/detail/roller/kdcakfeidhfeilahlclgbnmpgebafjpm',
      icon: chromeIcon,
    },
    {
      name: 'Firefox',
      url: 'https://addons.mozilla.org/af/firefox/addon/roller-scroll/',
      icon: firefoxIcon,
    },
  ]
</script>

<svelte:head>
  <title>Roller</title>
  <meta
    name="description"
    content="Browser extension that allow auto scrolling of web pages, by pressing the mouse wheel button"
  />
</svelte:head>

<main
  class="flex min-h-screen w-full flex-col bg-gradient-to-br from-blue-200 to-sky-200"
>
  <div class="flex flex-grow flex-col px-4 py-8 text-center">
    <div class="my-auto">
      <img
        src={rollerIcon}
        class="logo mx-auto mb-6 max-w-[100px] drop-shadow sm:max-w-[120px]"
        alt=""
      />
      <div class="prose mx-auto max-w-xl text-neutral-900">
        <h1 class="sr-only">Roller</h1>
        <p>
          <b>Roller</b> is a browser extension that allow auto scrolling of web pages
          (on Linux), by pressing the mouse wheel button, and moving the mouse up
          or down.
        </p>
        <p>
          This is a maintained fork of the <b>AutoScroll</b> extension.
        </p>
      </div>

      <div class="mt-10">
        {#each downloads as download}
          <a
            href={download.url}
            class="m-2 inline-flex items-center space-x-2 rounded bg-blue-500 p-4 text-white transition duration-300 hover:bg-blue-400 hover:shadow active:bg-blue-600 active:shadow-inner"
          >
            <img class="h-6 w-6 drop-shadow-sm" src={download.icon} alt="" />
            <span>Download for {download.name}</span>
          </a>
        {/each}
      </div>
    </div>
  </div>
  <div class="p-4 text-center text-sm text-neutral-900">
    Built with
    <img class="inline h-3 w-3 align-baseline" src={svelteIcon} alt="Svelte" />
    on
    <a href="https://github.com/ubermanu/roller" class="hover:underline">
      GitHub
    </a>
  </div>
</main>
