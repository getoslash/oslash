import { SHORTCUTS_STORAGE_KEY } from "../constants/keys";
import type { Shortcut } from "../types";
import { constructShortcutRules } from "./constructShortcutRules";
import { getSavedShortcuts } from "./getSavedShortcuts";

/** 
 * Updates declarative net request rules and saves shortcuts to local storage
 * @param {Shortcut[]} shortcuts shortcut
 * @returns {void} 
 */
export async function updateDeclarativeNetRequestRules(shortcuts: Shortcut[]) {
  // get old rules from local storage
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map(rule => rule.id);
  const newRules = constructShortcutRules(shortcuts)

  // persist shortcuts array to
  chrome.storage.local.set({ [SHORTCUTS_STORAGE_KEY]: JSON.stringify(shortcuts) })

  // update rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: newRules
  })
}

/** 
 * Creates multiple new shortcuts
 * @param {Shortcut[]} shortcuts shortcuts
 * @returns {void} 
 */
export async function createNewShortcuts(shortcuts: Shortcut[]) {
  // get old shortcuts from local storage
  const oldShortcuts = await getSavedShortcuts()

  // create a new array with added shortcuts
  const newShortcuts = [...oldShortcuts, ...shortcuts]

  await updateDeclarativeNetRequestRules(newShortcuts)
}

/** 
 * Creates a new shortcut
 * @param {Shortcut} shortcut shortcut
 * @returns {void} 
 */
export async function createNewShortcut(shortcut: Shortcut) {
  // get old shortcuts from local storage
  const oldShortcuts = await getSavedShortcuts()

  // create a new array with added shortcut
  const newShortcut: Shortcut = { ...shortcut, createdAt: new Date(), updatedAt: new Date() }
  const newShortcuts = [...oldShortcuts, newShortcut]

  await updateDeclarativeNetRequestRules(newShortcuts)
}

/** 
 * Updates the Shortcut
 * @param {Shortcut} oldShortcut shortcut
 * @param {Shortcut} newShortcut shortcut
 * @returns {void} 
 */
export async function updateShortcut(oldShortcut: Shortcut, newShortcut: Shortcut) {
  // get old shortcuts from local storage
  const oldShortcuts = await getSavedShortcuts()
  // get old rules from local storage
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map(rule => rule.id);

  const updatedShortcut: Shortcut = { ...newShortcut, updatedAt: new Date() }
  const newShortcuts = [
    ...oldShortcuts.filter(
      (shortcut) => shortcut.shortlink !== oldShortcut.shortlink)
    , updatedShortcut
  ]

  const newRules = constructShortcutRules(newShortcuts)

  // persist new shortcuts array to
  chrome.storage.local.set({ [SHORTCUTS_STORAGE_KEY]: JSON.stringify(newShortcuts) })

  // update rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: newRules
  })
}

/** 
 * deletes the Shortcut
 * @param {Shortcut} shortcutToBeDeleted shortcut to be deleted
 * @returns {void} 
 */
export async function deleteShortcut(shortcutToBeDeleted: Shortcut) {
  // get old shortcuts from local storage
  const oldShortcuts = await getSavedShortcuts()

  // get old rules from local storage
  const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
  const oldRuleIds = oldRules.map(rule => rule.id);

  const newShortcuts = [
    ...oldShortcuts.filter(
      (shortcut) => shortcut.shortlink !== shortcutToBeDeleted.shortlink)
  ]

  const newRules = constructShortcutRules(newShortcuts)

  // persist new shortcuts array to
  chrome.storage.local.set({ [SHORTCUTS_STORAGE_KEY]: JSON.stringify(newShortcuts) })

  // update rules
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: oldRuleIds,
    addRules: newRules
  })
}
