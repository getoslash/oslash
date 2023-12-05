import { isNonChromiumBrowser } from "./getBrowserName"

/** 
 * opens new tab
 * @param {chrome.tabs.CreateProperties | browser.tabs._CreateCreateProperties} props properties for creating new tab
 * @returns {void}
 */
export function openNewTab(props: chrome.tabs.CreateProperties | browser.tabs._CreateCreateProperties) {
  if (isNonChromiumBrowser()) {
    browser.tabs.create(props)
  }
  else {
    chrome.tabs.create(props)
  }
}

/** 
 * updates the current tab
 * @param {chrome.tabs.UpdateProperties | browser.tabs._UpdateUpdateProperties} props properties for updating the tab
 * @returns {void}
 */
export function updateTab(props: chrome.tabs.UpdateProperties | browser.tabs._UpdateUpdateProperties) {
  if (isNonChromiumBrowser()) {
    browser.tabs.update(props)
  }
  else {
    chrome.tabs.update(props)
  }
}