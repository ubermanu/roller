import { getBrowserLocale, locale, translations } from 'svelte-intl'
import fr from './i18n/fr.json'

// If you want to split your bundle, you can call this multiple times,
// the dictionaries will be merged.
translations.update({
  en: {},
  fr,
})

// try to use window.navigator.language
locale.set(getBrowserLocale('en'))
