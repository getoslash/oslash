import type { Shortcut } from "../types";
import { isNotNull } from "./isNotNull";
import { validateShortcutName, validateShortcutURL } from "./validate";

/** 
 * validates and constructs shortcuts from CSV data
 * @param {string[][]} csvData
 * @param {Set<string> | null} savedShortcutNames set of saved shortcuts .
 * @returns {Shortcut[]} throws if error. else return shortcuts array
 */
export async function constructShortcutsFromCSVData(csvData: string[][], savedShortcuts: Shortcut[]) {
  // construct map for quick access
  const savedShortcutsMap = new Map<string, string>()
  for (const shortcut of savedShortcuts) {
    savedShortcutsMap.set(shortcut.shortlink, shortcut.url)
  }

  const savedShortcutNames = new Set(savedShortcutsMap.keys())

  const shortcuts = csvData.map((shortcutRow) => {
    // if shortcutName is already present, either ignore if same url or append -new
    if (savedShortcutsMap.has(shortcutRow[0])) {
      // if shortcutName and url are same then ignore that shortcut
      if (savedShortcutsMap.get(shortcutRow[0]) === shortcutRow[1]) {
        return null
      }
      shortcutRow[0] = shortcutRow[0] + '-new'
    }

    // validate shortcut name and url
    const shortcutNameErrorMsg = validateShortcutName(shortcutRow[0] ?? '', savedShortcutNames)
    const urlErrorMsg = validateShortcutURL(shortcutRow[1] ?? '')

    if (!shortcutNameErrorMsg && !urlErrorMsg) {
      const shortcut: Shortcut = {
        shortlink: shortcutRow[0],
        url: shortcutRow[1],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return shortcut;
    }
    else {
      let errorMsg = 'Invalid Data: '
      if (shortcutNameErrorMsg) {
        errorMsg = errorMsg + `\n${shortcutRow[0]} is invalid : ${shortcutNameErrorMsg}`
      }
      if (urlErrorMsg) {
        errorMsg = errorMsg + `\n${shortcutRow[1]} is invalid : ${urlErrorMsg}`
      }
      throw new Error(errorMsg)
    }
  }).filter(isNotNull);
  return shortcuts;
}