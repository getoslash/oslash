import { FIREFOX, SAFARI } from "~lib/constants/browserNames";

export function getBrowserName() {
  return process.env.PLASMO_BROWSER
}

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