import { isNonChromiumBrowser } from "./getBrowserName"

/** 
 * gives the active/current tab url
 * @returns {Promise<string>} url string of the active/current tab
 */
export async function getActiveTabURL() {
  return await getTabURL()
}

/** 
 * utility function to get current tab url using browser APIs
 * @returns {Promise<string>} url string of the active/current tab
 */
function getTabURL() {
  return new Promise<string>((resolve) => {
    try {
      if (isNonChromiumBrowser()) {
        browser.tabs
          .query({ active: true, currentWindow: true })
          .then((tabs) => {
            resolve(tabs[0]?.url ?? "")
          })
      } else {
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true
          },
          (tabs) => {
            resolve(tabs[0]?.url ?? "")
          }
        )
      }
    } catch (e) {
      console.error("Error in fetching tab URL", e)
      resolve("")
    }
  })
}
