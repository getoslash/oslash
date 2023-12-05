import { isNonChromiumBrowser } from "./getBrowserName";

/** 
 * gives the saved declarative net request rules in browser
 * @returns {browser.declarativeNetRequest.Rule[] | chrome.declarativeNetRequest.Rule[]} declarative net request rules array
 */
export async function getDeclarativeNetRequestRules() {
  const browserName = process.env.PLASMO_BROWSER
  if (isNonChromiumBrowser()) {
    return await browser.declarativeNetRequest.getDynamicRules();
  }
  else {
    return await chrome.declarativeNetRequest.getDynamicRules();
  }
}
