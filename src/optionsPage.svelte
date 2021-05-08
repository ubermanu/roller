<script>
    import { onMount } from 'svelte'
    import { writable } from 'svelte/store'
    import defaults from './defaultOptions'
    import { _ } from 'svelte-intl'

    let options = writable(defaults)

    onMount(() => {
        chrome.storage.local.get(defaults, (data) => {
            $options = data
        })
    })

    // TODO: Add feedback
    function handleSave() {
        chrome.storage.local.set($options)
    }

    // TODO: Add feedback + confirmation
    function handleReset() {
        chrome.storage.local.set(defaults)
        location.reload()
    }
</script>

<style>
    :global(html) {
        background: rgb(78, 89, 101);
    }

    .section {
        max-width: 30rem;
        background: white;
    }

    .input {
        width: 5em;
        vertical-align: baseline;
    }
</style>

<main class="container">
    <section class="section">
        <h2 class="title is-5">{$_('Basic')}</h2>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox"
                           bind:checked={$options.stickyScroll}
                    />{' '}
                    {$_('Scroll without holding down the mouse button')}
                </label>
            </div>
            <div class="control">
                {$_('...if moving less than')}{' '}
                <input
                        type="number"
                        class="input is-small"
                        bind:value={$options.moveThreshold}
                        aria-label={$_('...if moving less than X pixels')}
                />{' '}
                {$_('pixels')}
            </div>
        </div>
        <div class="field">
            <div class="control">
                Scroll if moving more than{' '}
                <input
                        type="number"
                        class="input is-small"
                        bind:value={$options.dragThreshold}
                        aria-label="Drag threshold in pixels"
                />{' '}
                pixels
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input
                            type="checkbox"
                            bind:checked={$options.middleClick}
                    />{' '}
                    Scroll by using (Middle Click)
                </label>
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input
                            type="checkbox"
                            bind:checked={$options.ctrlClick}
                    />{' '}
                    Scroll by using (Ctrl/⌘ + Left Click)
                </label>
            </div>
        </div>
    </section>
    <section class="section">
        <h2 class="title is-5">Speed</h2>
        <div class="field">
            <div class="control">
                Move speed:{' '}
                <input type="number"
                       class="input is-small"
                       bind:value={$options.moveSpeed}
                       aria-label="Move speed in pixels"
                />{' '}
                (lower is faster)
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox"
                           bind:checked={$options.sameSpeed}
                    />{' '}
                    Scroll at the same speed (ignore mouse movement)
                </label>
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox"
                           bind:checked={$options.shouldCap}
                    />{' '}
                    Don't scroll faster than{' '}
                    <input type="number"
                           class="input is-small"
                           bind:value={$options.capSpeed}
                           aria-label="Speed cap in pixels"
                    />{' '}
                    pixels
                </label>
            </div>
        </div>
    </section>
    <section class="section">
        <h2 class="title is-5">Advanced</h2>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox"
                           name="innerScroll"
                           bind:checked={$options.innerScroll}
                    />{' '}
                    Scroll on inner elements
                </label>
            </div>
        </div>
        <div class="field">
            <div class="control">
                <label class="checkbox">
                    <input type="checkbox"
                           name="scrollOnLinks"
                           bind:checked={$options.scrollOnLinks}
                    />{' '}
                    Scroll when clicking on a link or textarea
                </label>
            </div>
        </div>
    </section>
    <section class="section">
        <div class="buttons">
            <button class="button is-primary" on:click={handleSave}>
                Save
            </button>
            <button class="button is-danger" on:click={handleReset}>
                Reset
            </button>
        </div>
    </section>
</main>
