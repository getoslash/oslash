import type { Shortcut } from "../types";
import { constructShortcutRules } from "./browser/constructShortcutRules";
import { getDeclarativeNetRequestRules } from "./browser/getDeclarativeNetRequestRules";
import { updateDeclarativeNetRequestRules } from "./browser/updateDeclarativeNetRequestRules";
import { getSavedShortcutsFromStore } from "./getSavedShortcuts";
import { shortcuts as storageSyncedShortcutsStore } from "~lib/store/shortcuts";

/** 
 * Updates declarative net request rules and saves shortcuts to local storage
 * @param {Shortcut[]} shortcuts shortcut
 * @returns {void} 
 */
export async function updateRules(shortcuts: Shortcut[]) {
  // get old rules from local storage
  const oldRules = await getDeclarativeNetRequestRules()

  const oldRuleIds = oldRules.map(rule => rule.id);
  const newRules = constructShortcutRules(shortcuts)

  // sort according to last updated first
  shortcuts.sort((shortcut1, shortcut2) => {
    if (shortcut1.updatedAt > shortcut2.updatedAt) return -1
    if (shortcut1.updatedAt < shortcut2.updatedAt) return 1
    return 0
  })

  // persist shortcuts array to
  storageSyncedShortcutsStore.set(shortcuts)

  // update rules
  await updateDeclarativeNetRequestRules(
    newRules, oldRuleIds
  )
}

/** 
 * Creates multiple new shortcuts
 * @param {Shortcut[]} shortcuts shortcuts
 * @returns {void} 
 */
export async function createNewShortcuts(shortcuts: Shortcut[]) {
  // get old shortcuts from store
  const oldShortcuts = await getSavedShortcutsFromStore()

  // create a new array with added shortcuts
  const newShortcuts = [...oldShortcuts, ...shortcuts]

  await updateRules(newShortcuts)
}

/** 
 * Creates a new shortcut
 * @param {Shortcut} shortcut shortcut
 * @returns {void} 
 */
export async function createNewShortcut(shortcut: Shortcut) {
  // get old shortcuts from local storage
  const oldShortcuts = await getSavedShortcutsFromStore()
  // create a new array with added shortcut
  const newShortcut: Shortcut = { ...shortcut, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
  const newShortcuts = [...oldShortcuts, newShortcut]

  await updateRules(newShortcuts)
}

/** 
 * Updates the Shortcut
 * @param {Shortcut} oldShortcut shortcut
 * @param {Shortcut} newShortcut shortcut
 * @returns {void} 
 */
export async function updateShortcut(oldShortcut: Shortcut, newShortcut: Shortcut) {
  // get old shortcuts from local storage
  const oldShortcuts = await getSavedShortcutsFromStore()

  const updatedShortcut: Shortcut = { ...newShortcut, updatedAt: new Date().toISOString() }

  // create new shortcuts list with updated shortcut
  const newShortcuts = [
    ...oldShortcuts.filter(
      (shortcut) => shortcut.shortlink !== oldShortcut.shortlink)
    , updatedShortcut
  ]

  await updateRules(newShortcuts)
}

/** 
 * deletes the Shortcut
 * @param {Shortcut} shortcutToBeDeleted shortcut to be deleted
 * @returns {void} 
 */
export async function deleteShortcut(shortcutToBeDeleted: Shortcut) {
  // get old shortcuts from local storage
  const oldShortcuts = await getSavedShortcutsFromStore()

  // filter out the shortcut that needs to be deleted
  const newShortcuts = [
    ...oldShortcuts.filter(
      (shortcut) => shortcut.shortlink !== shortcutToBeDeleted.shortlink)
  ]

  await updateRules(newShortcuts)
}
