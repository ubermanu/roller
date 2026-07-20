<script>
  import { onMount } from 'svelte'
  import defaults from '../defaultOptions'
  import { _ as t } from '../i18n'

  let options = $state({ ...defaults })

  onMount(() => {
    chrome.storage.local.get(defaults, (data) => {
      Object.assign(options, data)
    })
  })

  $effect(() => {
    chrome.storage.local.set({ ...options })
  })

  function handleReset() {
    options = { ...defaults }
  }
</script>

<main class="container">
  <section class="section">
    <h2 class="title is-5">{t('Basic')}</h2>
    <div class="field">
      <div class="control">
        {t('Scroll if moving more than')}{' '}
        <input
          type="number"
          class="input"
          bind:value={options.moveThreshold}
          aria-label={t('Move threshold in pixels')}
        />{' '}
        {t('pixels')}
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={options.stickyScroll} />{' '}
          {t('Scroll without holding down the mouse button')}
        </label>
      </div>
      <div class="control">
        {t('...if moving less than')}{' '}
        <input
          type="number"
          class="input"
          bind:value={options.dragThreshold}
          aria-label={t('Drag threshold in pixels')}
        />{' '}
        {t('pixels')}
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={options.middleClick} />{' '}
          {t('Scroll by using (Middle Click)')}
        </label>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={options.ctrlClick} />{' '}
          {t('Scroll by using (Ctrl/⌘ + Left Click)')}
        </label>
      </div>
    </div>
  </section>
  <section class="section">
    <h2 class="title is-5">{t('Speed')}</h2>
    <div class="field">
      <div class="control">
        {t('Move speed:')}{' '}
        <input
          type="number"
          class="input"
          bind:value={options.moveSpeed}
          aria-label={t('Move speed in pixels')}
        />{' '}
        {t('(lower is faster)')}
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={options.sameSpeed} />{' '}
          {t('Scroll at the same speed (ignore mouse movement)')}
        </label>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={options.shouldCap} />{' '}
          {t("Don't scroll faster than")}{' '}
          <input
            type="number"
            class="input"
            bind:value={options.capSpeed}
            aria-label={t('Speed cap in pixels')}
          />{' '}
          {t('pixels')}
        </label>
      </div>
    </div>
  </section>
  <section class="section">
    <h2 class="title is-5">{t('Advanced')}</h2>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={options.innerScroll} />{' '}
          {t('Scroll on inner elements')}
        </label>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={options.scrollOnLinks} />{' '}
          {t('Scroll when clicking on a link or textarea')}
        </label>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <label class="checkbox">
          <input type="checkbox" bind:checked={options.disableOnWindows} />{' '}
          {t('Disable on Windows platform')}
        </label>
      </div>
    </div>
  </section>
  <section class="section">
    <div class="buttons">
      <button class="button" onclick={handleReset}>
        {t('Reset')}
      </button>
    </div>
  </section>
</main>

<style>
  .section {
    margin-top: 2rem;
    max-width: 30rem;
  }

  .section:first-child {
    margin-top: 0;
  }

  .input {
    display: inline;
    vertical-align: baseline;
    width: 5em;
  }

  .control {
    margin-top: 3px;
    margin-bottom: 3px;
  }
</style>
