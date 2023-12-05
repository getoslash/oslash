import type { Shortcut } from "~lib/types"
import { setDataToStorage } from "./browser/storageUtils"
import { SHORTCUTS_STORAGE_KEY } from "~lib/constants/keys"

/** 
 * set/store given shortcuts to storage
 * @param {Shortcut[]} shortcuts shortcuts to be stored
 * @returns {Promise<void>}
 */
export async function setShortcutsToStorage(shortcuts: Shortcut[]) {
  await setDataToStorage(SHORTCUTS_STORAGE_KEY, shortcuts)
}