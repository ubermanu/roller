'use strict'

if ('Options.config.user' in localStorage) {
  const o = JSON.parse(localStorage['Options.config.user'])
  chrome.storage.local.set(o, function () {
    delete localStorage['Options.config.user']
  })
}

if ('Options.config.base' in localStorage) {
  delete localStorage['Options.config.base']
}
