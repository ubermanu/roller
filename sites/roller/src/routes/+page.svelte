<script>
import chromeIcon from "$lib/images/chrome.svg";
import firefoxIcon from "$lib/images/firefox.svg";
import rollerIcon from "$lib/images/roller.svg";
import pkg from "@ubermanu/roller/package.json";

const downloads = [
  {
    name: "Chrome",
    url: "https://chrome.google.com/webstore/detail/roller/kdcakfeidhfeilahlclgbnmpgebafjpm",
    icon: chromeIcon,
  },
  {
    name: "Firefox",
    url: "https://addons.mozilla.org/firefox/addon/roller-scroll/",
    icon: firefoxIcon,
  },
];
</script>

<svelte:head>
  <title>Roller</title>
  <meta
    name="description"
    content="Browser extension that allow auto scrolling of web pages, by pressing the mouse wheel button"
  />
</svelte:head>

<main
  class="from-brand-100 to-brand-200 selection:bg-brand-500 dark:from-brand-900 flex min-h-screen w-full flex-col bg-gradient-to-br text-neutral-900 selection:text-white dark:to-neutral-950 dark:text-neutral-100"
>
  <div class="flex flex-grow flex-col justify-center px-6 py-12 md:px-12">
    <div class="mx-auto max-w-2xl text-center">
      <div class="relative mb-10 inline-block">
        <img
          src={rollerIcon}
          class="animate-drift h-28 w-28 origin-left drop-shadow-md sm:h-36 sm:w-36"
          alt="Roller Icon"
        />
      </div>

      <h1
        class="mb-6 flex flex-col items-center justify-center gap-4 text-6xl font-black tracking-tight text-neutral-900 sm:flex-row sm:text-7xl dark:text-white"
      >
        Roller
        <span
          class="bg-brand-500 border-brand-100 dark:border-brand-900 rounded-full border-2 px-4 py-1.5 text-lg font-bold tracking-normal text-white shadow-sm"
        >
          v{pkg.version}
        </span>
      </h1>

      <div
        class="mx-auto prose prose-lg mb-12 text-neutral-700 dark:text-neutral-300 dark:prose-invert"
      >
        <p class="lead text-xl font-medium sm:text-2xl">
          Auto-scroll web pages effortlessly on Linux with just your middle
          mouse button.
        </p>
      </div>

      <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
        {#each downloads as download}
          <a
            href={download.url}
            class="group inline-flex w-full items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-neutral-900 shadow-sm ring-1 ring-neutral-300/50 transition-all ring-inset hover:bg-neutral-50 hover:shadow-md active:bg-neutral-100 sm:w-auto dark:bg-white/10 dark:text-white dark:ring-white/20 dark:hover:bg-white/20 dark:active:bg-white/10"
          >
            <img
              class="h-8 w-8 transition-transform group-hover:scale-110"
              src={download.icon}
              alt={download.name}
            />
            <span>Download for {download.name}</span>
          </a>
        {/each}
      </div>
    </div>
  </div>

  <footer
    class="py-6 text-center text-sm font-medium text-neutral-600 dark:text-neutral-400"
  >
    <p class="flex items-center justify-center gap-1.5">
      <span>Built with Svelte on</span>
      <a
        href="https://github.com/ubermanu/roller"
        class="text-brand-600 hover:text-brand-700 dark:text-brand-200 dark:hover:text-brand-100 transition-colors hover:underline"
      >
        GitHub
      </a>
    </p>
  </footer>
</main>
