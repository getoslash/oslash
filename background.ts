"use strict"
import Fuse from "fuse.js"
import { constructShortcutRules } from "~lib/utils/browser/constructShortcutRules"
import { isNonChromiumBrowser } from "~lib/utils/browser/getBrowserName"
import { getDeclarativeNetRequestRules } from "~lib/utils/browser/getDeclarativeNetRequestRules"
import { openNewTab, updateTab } from "~lib/utils/browser/tabOperations"
import { updateDeclarativeNetRequestRules } from "~lib/utils/browser/updateDeclarativeNetRequestRules"
import { setShortcutsToStorage } from "~lib/utils/setShortcutsToStorage"

import { DEFAULT_SHORTCUTS } from "./lib/constants/defaultShortcuts"
import { getSavedShortcutsFromStorage } from "./lib/utils/getSavedShortcuts"

const defaultShortcuts = DEFAULT_SHORTCUTS
const fuseOptions = {
  includeScore: true,
  keys: ["shortlink"]
}

let fuse = new Fuse(defaultShortcuts, fuseOptions)

let browserInstance: typeof browser | typeof chrome | null  = null ;
if (isNonChromiumBrowser()) {
  browserInstance = browser
}
else {
  browserInstance = chrome
}

if (browserInstance){
  browserInstance.runtime.onInstalled.addListener(async (details) => {
    if (details.reason !== "install") return

    // persist default Shortcuts to local storage
    await setShortcutsToStorage(defaultShortcuts)

    // construct new rules on every installation
    const newRules = constructShortcutRules(defaultShortcuts)
    const oldRules = await getDeclarativeNetRequestRules()

    let oldRuleIds = []
    if (oldRules) {
      oldRuleIds = oldRules.map((rule) => rule.id)
    }

    // add the new rules as declarativeNetRequest Dynamic rules, and remove old rules if there are any
    await updateDeclarativeNetRequestRules(newRules, oldRuleIds)
  })

  browserInstance.omnibox.onInputStarted.addListener(async function () {
    // on each input session, get all shortcuts and create a new fuse object with them
    const savedShortcuts = await getSavedShortcutsFromStorage()
    fuse = new Fuse(savedShortcuts, fuseOptions)
  })

  browserInstance.omnibox.onInputChanged.addListener(async function (text, suggest) {
    // get fuse suggestions
    const suggestedShortcuts = fuse.search(text)
    // map fuse suggestions to omnibox suggestions
    const suggestions = suggestedShortcuts.map(
      (shortcut) => {
        return {
          content: shortcut.item.shortlink,
          description: `${shortcut.item.shortlink} - <url>${shortcut.item.url}</url>`
        }
      }
    )
    suggest(suggestions)
  })

  browserInstance.omnibox.onInputEntered.addListener(function (text, disposition) {
    // redirect to url in new tab
    const url = `http://${text}`
    switch (disposition) {
      case "currentTab":
        updateTab({ url })
        break
      case "newForegroundTab":
        openNewTab({ url })
        break
      case "newBackgroundTab":
        openNewTab({ url, active: false })
        break
    }
  })

  // If o/ is prefix and no shortcut with given name is saved then redirect to options page
  browserInstance.webRequest.onBeforeRequest.addListener(
    (param) => {
      getSavedShortcutsFromStorage().then((shortcuts) => {
        const savedShortcutNamesSet = new Set(
          shortcuts.map((shortcut) => shortcut.shortlink)
        )
        const requestUrl = new URL(param.url)
        if (requestUrl.searchParams.has("q")) {
          const queryValue = requestUrl.searchParams.get("q") ?? ""
          if (queryValue.startsWith("o/")) {
            if (!savedShortcutNamesSet.has(queryValue)) {
              updateTab({ url: "/options.html" })
            } else {
              const url =
                shortcuts.find((shortcut) => shortcut.shortlink === queryValue)
                  ?.url ?? ""
              updateTab({ url })
            }
          }
        } else if (param.url.startsWith("http://o/")) {
          const requestShortcutName = param.url.replace("http://", "")
          if (!savedShortcutNamesSet.has(requestShortcutName)) {
            updateTab({ url: "/options.html" })
          }
        }
      })
    },
    { urls: ["*://*/search*", "*://o/*"] }
  )
}

