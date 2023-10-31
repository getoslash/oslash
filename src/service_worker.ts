'use strict';

import { DEFAULT_SHORTCUTS } from "./lib/constants/defaultShortcuts";
import { SHORTCUTS_STORAGE_KEY } from "./lib/constants/keys";
import { constructShortcutRules } from "./lib/utils/constructShortcutRules";
import { getSavedShortcuts } from "./lib/utils/getSavedShortcuts";
import Fuse from 'fuse.js'

const defaultShortcuts = DEFAULT_SHORTCUTS
const fuseOptions = {
  includeScore: true,
  keys: ['shortlink']
}
let fuse = new Fuse(defaultShortcuts, fuseOptions)

chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason !== "install") return;

  // persist default Shortcuts to local storage
  chrome.storage.local.set({ [SHORTCUTS_STORAGE_KEY]: JSON.stringify(defaultShortcuts) })
  // construct new rules on every installation
  const newRules = constructShortcutRules(defaultShortcuts)
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map(rule => rule.id);
  // add the new rules as declarativeNetRequest Dynamic rules, and remove old rules if there are any
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: newRules
  });
});

chrome.omnibox.onInputStarted.addListener(async function () {
  // on each input session, get all shortcuts and create a new fuse object with them
  const savedShortcuts = await getSavedShortcuts()
  fuse = new Fuse(savedShortcuts, fuseOptions)
});

chrome.omnibox.onInputChanged.addListener(async function (text, suggest) {
  // get fuse suggestions
  const suggestedShortcuts = fuse.search(text)

  // map fuse suggestions to omnibox suggestions
  const suggestions: chrome.omnibox.SuggestResult[] = suggestedShortcuts.map((shortcut) => {
    return {
      content: shortcut.item.shortlink, description: `${shortcut.item.shortlink} - <url>${shortcut.item.url}</url>`
    }
  })
  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(function (text, disposition) {
  // redirect to url in new tab
  const url = `http://${text}`
  switch (disposition) {
    case "currentTab":
      chrome.tabs.update({ url });
      break;
    case "newForegroundTab":
      chrome.tabs.create({ url });
      break;
    case "newBackgroundTab":
      chrome.tabs.create({ url, active: false });
      break;
  }
});

// If o/ is prefix and no shortcut with given name is saved then redirect to options page 
chrome.webRequest.onBeforeRequest.addListener((param) => {
  getSavedShortcuts().then((shortcuts) => {
    const savedShortcutNamesSet = new Set(shortcuts.map((shortcut) => shortcut.shortlink))
    const requestUrl = new URL(param.url)
    if (requestUrl.searchParams.has('q')) {
      const queryValue = requestUrl.searchParams.get('q') ?? ''
      if (queryValue.startsWith('o/')) {
        if (!savedShortcutNamesSet.has(queryValue)) {
          chrome.tabs.update({ url: '/option.html' })
        }
        else {
          const url = shortcuts.find((shortcut) => shortcut.shortlink === queryValue)?.url ?? ''
          chrome.tabs.update({ url })
        }
      }
    }
    else if (param.url.startsWith('http://o/')) {
      const requestShortcutName = param.url.replace('http://', '')
      if (!savedShortcutNamesSet.has(requestShortcutName)) {
        chrome.tabs.update({ url: '/option.html' })
      }
    }
  })
}, { urls: ["*://*/search*", "*://o/*"] })
