import { isNonChromiumBrowser } from "./getBrowserName"

export async function getActiveTabURL() {
  return await getTabURL()
}

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
