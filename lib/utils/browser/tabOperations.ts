import { isNonChromiumBrowser } from "./getBrowserName"

export function openNewTab(props: chrome.tabs.CreateProperties | browser.tabs._CreateCreateProperties) {
  if (isNonChromiumBrowser()) {
    browser.tabs.create(props)
  }
  else {
    chrome.tabs.create(props)
  }
}

export function updateTab(props: chrome.tabs.UpdateProperties | browser.tabs._UpdateUpdateProperties) {
  if (isNonChromiumBrowser()) {
    browser.tabs.update(props)
  }
  else {
    chrome.tabs.update(props)
  }
}