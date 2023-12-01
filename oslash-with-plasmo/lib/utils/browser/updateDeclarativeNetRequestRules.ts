import { isNonChromiumBrowser } from "./getBrowserName";

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
