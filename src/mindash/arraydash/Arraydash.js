import Typedash from '../typedash/Typedash.js'

export default class Arraydash {
  /**
   * Takes an action and an input and performs the action on the input after preparing it.
   * @private
   * @param {string} action - The name of the action (e.g., 'filter', 'map', 'forEach').
   * @param {Array|Object} input - The array or object on which the action is performed.
   * @param {Function} callback - The callback function to use with the action.
   * @param {boolean} [spreadObject=false] - Whether to spread the object into an array of its entries.
   * @returns {Array} - The result of the action performed on the prepared input.
   */
  static arrayAction(action, input, callback, spreadObject = false) {
    const preparedInput = Typedash.prepareInput(input, spreadObject)

    if (typeof preparedInput[action] !== 'function') {
      throw new TypeError(`Unsupported action: ${ action }`)
    }

    return preparedInput[action](callback)
  }

  /**
   * Filters the input using the provided callback.
   * @param {Array|Object} input - The array or object to filter.
   * @param {Function} callback - Callback function for filtering.
   * @param {boolean} [spreadObject=false] - Whether to spread objects before filtering.
   * @returns {Array} - The filtered array.
   */
  static filterAny(input, callback, spreadObject = false) {
    return Arraydash.arrayAction('filter', input, callback, spreadObject)
  }

  /**
   * Maps the input using the provided callback.
   * @param {Array|Object} input - The array or object to search with find.
   * @param {Function} callback - Callback function for finding.
   * @param {boolean} [spreadObject=false] - Whether to spread objects before running find.
   * @returns {Array} - The mapped array.
   */
  static findAny(input, callback, spreadObject = false) {
    return Arraydash.arrayAction('find', input, callback, spreadObject)
  }

  /**
   * Iterates over the input using the provided callback.
   * @param {Array|Object} input - The array or object to iterate over.
   * @param {Function} callback - Callback function for iteration.
   * @param {boolean} [spreadObject=false] - Whether to spread objects before iterating.
   */
  static forAny(input, callback, spreadObject = false) {
    return Arraydash.arrayAction('forEach', input, callback, spreadObject)
  }

  /**
   * Maps the input using the provided callback.
   * @param {Array|Object} input - The array or object to map.
   * @param {Function} callback - Callback function for mapping.
   * @param {boolean} [spreadObject=false] - Whether to spread objects before mapping.
   * @returns {Array} - The mapped array.
   */
  static mapAny(input, callback, spreadObject = false) {
    return Arraydash.arrayAction('map', input, callback, spreadObject)
  }
}
