import { FIREFOX, SAFARI } from "~lib/constants/browserNames"
import type { Shortcut } from "~lib/types"
import { isNonChromiumBrowser } from "./getBrowserName"

export function constructShortcutRules(shortcuts: Shortcut[]) {
  if (isNonChromiumBrowser()) {
    return shortcuts.map((shortcut, index) => {
      const newRule: browser.declarativeNetRequest.Rule =  {
        "id": index + 1,
        "priority": 1,
        "action": {
          // chrome.declarativeNetRequest.RuleActionType['REDIRECT'] equivalent
          // is not available in browser namespace
          "type": "redirect",
          "redirect": {
            "url": shortcut.url
          }
        },
        "condition": {
          "urlFilter": `http://${shortcut.shortlink}`,
          // chrome.declarativeNetRequest.ResourceType['MAIN_FRAME'] equivalent
          // is not available in browser namespace
          "resourceTypes": ["main_frame"]
        }
      }
      return newRule
    })
  }
  else {
    return shortcuts.map((shortcut, index) => {
      const newRule: chrome.declarativeNetRequest.Rule = {
        "id": index + 1,
        "priority": 1,
        "action": {
          "type": chrome.declarativeNetRequest.RuleActionType['REDIRECT'],
          "redirect": {
            "url": shortcut.url
          }
        },
        "condition": {
          "urlFilter": `http://${shortcut.shortlink}`,
          "resourceTypes": [chrome.declarativeNetRequest.ResourceType['MAIN_FRAME']]
        }
      }
      return newRule
      
    })
  }
}