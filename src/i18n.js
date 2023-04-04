import { getBrowserLocale, locale, translations } from 'svelte-intl'

// Translations are stored in JSON files in the i18n directory.
import de from './i18n/de_DE.json'
import es from './i18n/es_ES.json'
import fr from './i18n/fr_FR.json'
import it from './i18n/it_IT.json'
import ja from './i18n/ja_JP.json'
import ko from './i18n/ko_KR.json'
import nl from './i18n/nl_NL.json'
import pt from './i18n/pt_PT.json'
import ru from './i18n/ru_RU.json'
import zh from './i18n/zh_Hans_CN.json'

// If you want to split your bundle, you can call this multiple times,
// the dictionaries will be merged.
translations.update({
  en: {},
  de,
  es,
  fr,
  it,
  ja,
  ko,
  nl,
  pt,
  ru,
  zh,
})

// try to use window.navigator.language
locale.set(getBrowserLocale('en'))
