import { isNonChromiumBrowser } from "./getBrowserName"

/** 
 * gives the saved favicon url in browser of a given website
 * @param {string} url the shortlink's url
 * @returns {browser.declarativeNetRequest.Rule[] | chrome.declarativeNetRequest.Rule[]} declarative net request rules array
 */
export function getFaviconURL(shortcutURL: string) {
  let url: URL | null = null
  if (isNonChromiumBrowser()) {
    // NOTE: This is a fallback icon. Firefox does not support accessing cached favicon
    // TODO: Either store favicon url with shortcut or find some other workaround
    url = new URL(browser.runtime.getURL("/assets/icon.png"))
  } else {
    url = new URL(chrome.runtime.getURL("/_favicon/"))
  }

  if (url) {
    url.searchParams.set("pageUrl", shortcutURL)
    url.searchParams.set("size", "32")
    return url.toString()
  }
  return ""
}
