import type { Shortcut } from "../types"

/** 
 * Construct DeclarativeNetRequestRules from Shortcuts array 
 * @param {Shortcut[]} shortcuts shortcuts array 
 * @returns {chrome.declarativeNetRequest.Rule[]} declarativeNetRequest rules 
 */
export function constructShortcutRules(shortcuts: Shortcut[]) {
  const newRules = shortcuts.map((shortcut, index) => {
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
  return newRules
}