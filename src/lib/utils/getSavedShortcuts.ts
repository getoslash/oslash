import { SHORTCUTS_STORAGE_KEY } from "../constants/keys"
import type { Shortcut } from "../types"

/** 
 * Get Saved Shortcuts from local storage
 * @returns {Shortcut[]} Shortcuts Array 
 */
export async function getSavedShortcuts() {
  let savedShortcuts: Shortcut[] = []
  const shortcutsKeyValuePair = await chrome.storage.local.get(SHORTCUTS_STORAGE_KEY)
  if (shortcutsKeyValuePair) {
    savedShortcuts = JSON.parse(shortcutsKeyValuePair[SHORTCUTS_STORAGE_KEY]) as Shortcut[]
    if (Array.isArray(savedShortcuts)) {

      return savedShortcuts.sort((shortcut1, shortcut2) => {
        if (shortcut1.updatedAt > shortcut2.updatedAt) return -1
        if (shortcut1.updatedAt < shortcut2.updatedAt) return 1
        return 0
      })
    }
  }
  return []
}