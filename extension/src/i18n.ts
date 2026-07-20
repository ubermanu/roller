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

type Translations = Record<string, string | undefined>

const allTranslations: Record<string, Translations> = {
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
}

function getBrowserLocale(fallback: string): string {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language
    if (lang) {
      const short = lang.substring(0, 2).toLowerCase()
      if (allTranslations[short]) {
        return short
      }
    }
  }
  return fallback
}

const currentLocale = getBrowserLocale('en')

function _(key: string): string {
  let result: string = key
  const dict = allTranslations[currentLocale]
  if (dict && dict[key] !== undefined) {
    result = dict[key]!
  }
  return result
}

export { _ }
