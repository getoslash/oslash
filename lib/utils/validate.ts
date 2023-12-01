
import type { Shortcut } from "../types";
/** 
 * Validates Shortcut
 * @param {Shortcut} shortcut shortcut which is to be validated
 * @param {Set<string> | null} savedShortcutNames set of saved shortcut names
 * @returns {ShortcutValidationResult} shortcut validation result
 */
export function validateShortcut(shortcut: Shortcut, savedShortcutNames: Set<string> | null) {
  const url = shortcut.url
  const name = shortcut.shortlink
  const nameError = validateShortcutName(name, savedShortcutNames)
  const urlError = validateShortcutURL(url)
  return {
    shortlink: nameError,
    url: urlError
  }
}

/** 
 * Validates shortcut url
 * @param {string} shortcutURL shortcut name which is to be validated
 * @returns {string | null} error message string if error exists. else null
 */
export function validateShortcutURL(shortcutURL: string): string | null {
  // validate if empty
  if (shortcutURL === '') {
    return 'URL cannot be empty'
  }

  // validate if valid url
  // REFER: https://stackoverflow.com/questions/48110677/url-regex-improvement-to-allow-localhost-url
  const httpRegex = /(?:^|[ \t])((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/gm
  if (!httpRegex.test(shortcutURL)) {
    return 'Please enter a valid URL'
  }

  return null
}

/** 
 * Validates shortcut name
 * @param {Set<string> | null} savedShortcutNames set of saved shortcuts .
 * @param {string}  shortcutName shortcut name which is to be validated
 * @returns {string | null} error message string if error exists. else null
 */
export function validateShortcutName(shortcutName: string, savedShortcutNames: Set<string> | null): string | null {
  // validate if empty
  if (shortcutName === '') {
    return 'Shortcut name cannot be empty'
    //shortcutNameErrors.push('Shortcut name cannot be empty')
  }

  // validate if starts with o/
  if (!shortcutName.startsWith('o/')) {
    return 'Shortcut name must start with o/'
  }

  // validate if unique
  if (savedShortcutNames?.has(shortcutName)) {
    return 'Shortcut with same name already exists'
  }

  return null
}

