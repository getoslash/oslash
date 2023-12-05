import { FIREFOX, SAFARI } from "~lib/constants/browserNames";

/** 
 * gives the browser name
 * @returns {string} browser name as per plasmo env
 */
export function getBrowserName() {
  return process.env.PLASMO_BROWSER
}

/** 
 * checks if the browser is a non chromium based one or not
 * @returns {boolean} true if if not based on chromium. else false
 */
export function isNonChromiumBrowser() {
  // For now, only safari and firefox are considered in non chromium browsers
  // More can be added in future if required
  const browserName = process.env.PLASMO_BROWSER
  
  switch(browserName) {
    case FIREFOX: return true;
    case SAFARI : return true;
    default: return false;
  }
}