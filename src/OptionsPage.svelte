<script>
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'
    import defaults from './defaultOptions'
    import { _ } from 'svelte-intl'

    let options = writable(defaults)

    onMount(() => {
        chrome.storage.local.get(defaults, (data) => {
            options.set(data)
        })

        options.subscribe((data) => {
            chrome.storage.local.set(data)
        })
    })

    function handleReset() {
        options.set(defaults)
    }
</script>

<style>
    .section {
        margin-top: 2rem;
        max-width: 30rem;
    }

    .input {
        display: inline;
        width: 5em;
        vertical-align: baseline;
    }

    .control {
        margin-top: 3px;
        margin-bottom: 3px;
    }
</style>

<main class="container">
    <section class="section">
        <h2 class="title is-5">{$_('Basic')}</h2>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" bind:checked={$options.stickyScroll}/>{' '}
                    {$_('Scroll without holding down the mouse button')}
                </label>
            </div>
            <div class="control">
                {$_('...if moving less than')}{' '}
                <input type="number" class="input"
                       bind:value={$options.moveThreshold}
                       aria-label={$_('...if moving less than X pixels')}/>{' '}
                {$_('pixels')}
            </div>
        </div>
        <div class="field">
            <div class="control">
                {$_('Scroll if moving more than')}{' '}
                <input type="number" class="input"
                       bind:value={$options.dragThreshold}
                       aria-label={$_('Drag threshold in pixels')}/>{' '}
                {$_('pixels')}
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" bind:checked={$options.middleClick}/>{' '}
                    {$_('Scroll by using (Middle Click)')}
                </label>
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" bind:checked={$options.ctrlClick}/>{' '}
                    {$_('Scroll by using (Ctrl/⌘ + Left Click)')}
                </label>
            </div>
        </div>
    </section>
    <section class="section">
        <h2 class="title is-5">{$_('Speed')}</h2>
        <div class="field">
            <div class="control">
                {$_('Move speed:')}{' '}
                <input type="number" class="input"
                       bind:value={$options.moveSpeed}
                       aria-label={$_('Move speed in pixels')}/>{' '}
                {$_('(lower is faster)')}
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" bind:checked={$options.sameSpeed}/>{' '}
                    {$_('Scroll at the same speed (ignore mouse movement)')}
                </label>
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" bind:checked={$options.shouldCap}/>{' '}
                    {$_('Don\'t scroll faster than')}{' '}
                    <input type="number" class="input"
                           bind:value={$options.capSpeed}
                           aria-label={$_('Speed cap in pixels')}/>{' '}
                    {$_('pixels')}
                </label>
            </div>
        </div>
    </section>
    <section class="section">
        <h2 class="title is-5">{$_('Advanced')}</h2>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" bind:checked={$options.innerScroll}/>{' '}
                    {$_('Scroll on inner elements')}
                </label>
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox" bind:checked={$options.scrollOnLinks}/>{' '}
                    {$_('Scroll when clicking on a link or textarea')}
                </label>
            </div>
        </div>
    </section>
    <section class="section">
        <div class="buttons">
            <button class="button" on:click={handleReset}>
                {$_('Reset')}
            </button>
        </div>
    </section>
</main>
