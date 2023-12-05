import { isNonChromiumBrowser } from "./getBrowserName";

/** 
 * updates the declarative net request rules of the browser
 * @param { browser.declarativeNetRequest.Rule[] | chrome.declarativeNetRequest.Rule[]} addRules rules that need to be added
 * @param {number[]} removeRuleIds IDs of rules that need to be removed
 * @returns {void}
 */
export async function updateDeclarativeNetRequestRules(
  addRules: browser.declarativeNetRequest.Rule[]
    | chrome.declarativeNetRequest.Rule[],
  removeRuleIds: number[]
) {


  if (isNonChromiumBrowser()) {
    await browser.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules: addRules as browser.declarativeNetRequest.Rule[]
    })
  }

  else {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds,
      addRules: addRules as chrome.declarativeNetRequest.Rule[]
    })
  }
}
