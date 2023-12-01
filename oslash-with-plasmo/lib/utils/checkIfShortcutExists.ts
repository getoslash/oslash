import type { Shortcut } from "../types";

/** 
 * Checks if there is already a shortcut with same URL. Also returns the shortcut if there exists any.
 * @param {string} pageURL url for which shortcut is created/exists
 * @param {Set<string> | null} savedShortcutURLs a set of url strings or null
 * @param {Shortcut[]} savedShortcuts shortcuts array which are already saved
 * @returns {{isShortcutExists: boolean;existingShortcut: Shortcut | null;}} boolean and shortcut if that shortcut exists
 */
export function checkIfShortcutExists(
  pageURL: string,
  savedShortcutURLs: Set<string> | null,
  savedShortcuts: Shortcut[]
) {
  if (savedShortcutURLs?.has(pageURL)) {
    const existingShortcut = savedShortcuts.find(
      (shortcut) => shortcut.url === pageURL
    );
    return existingShortcut ?? null
  }

  return null
}