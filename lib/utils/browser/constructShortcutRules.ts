import type { Shortcut } from "~lib/types"
import { isNonChromiumBrowser } from "./getBrowserName"

/** 
 * construct the declarative net request rules for given shortcuts array
 * @param {Shortcut[]} shortcuts shortcuts array
 * @returns {browser.declarativeNetRequest.Rule[] | chrome.declarativeNetRequest.Rule[]} array of shortcut rules
 */
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