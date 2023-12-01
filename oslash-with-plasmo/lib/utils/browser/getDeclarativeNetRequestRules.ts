import { isNonChromiumBrowser } from "./getBrowserName";

export async function getDeclarativeNetRequestRules() {
  const browserName = process.env.PLASMO_BROWSER
  if (isNonChromiumBrowser()) {
    return await browser.declarativeNetRequest.getDynamicRules();
  }
  else {
    return await chrome.declarativeNetRequest.getDynamicRules();
  }
}
