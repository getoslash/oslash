/** 
 * checks if value is null or not
 * @param {T | null} value value to be checked
 * @returns {boolean} true if value is not null. else false
 */
export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}