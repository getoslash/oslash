
import { get } from "svelte/store"
import { SHORTCUTS_STORAGE_KEY } from "~lib/constants/keys"

import { shortcuts } from "~lib/store/shortcuts"
import { getDataFromStorage } from "./browser/storageUtils"
import type { Shortcut } from "~lib/types"

/**
 * Get Saved Shortcuts from local store
 * @returns {Shortcut[]} Shortcuts Array
 */
export async function getSavedShortcutsFromStore() {
  // NOTE: the store should be initialized by the component/parent function first
  // NOTE: We are fetching from the store and not local storage to optimize performance

  const savedShortcuts = get(shortcuts)
  if (Array.isArray(savedShortcuts)) {
    return savedShortcuts
  }
  return []
}

/**
 * Get Saved Shortcuts from local storage
 * @returns {Shortcut[]} Shortcuts Array
 */
export async function getSavedShortcutsFromStorage() {
  const savedShortcuts = await getDataFromStorage<Shortcut[]>(SHORTCUTS_STORAGE_KEY)
  if (Array.isArray(savedShortcuts)) {
    return savedShortcuts
  }
  return []
}