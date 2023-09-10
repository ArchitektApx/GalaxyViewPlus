import Typedash from '../typedash/Typedash.js'

export default class Objectdash {
  /**
  * Creates a deep clone of the given input.
  * @param {*} input - Any input value to be cloned.
  * @returns {*} - The deep cloned value.
  */
  static deepClone(input) {
    return JSON.parse(JSON.stringify(input))
  }

  /**
   * Retrieves a nested value from an object using a string path or returns a default value.
   * @param {Object} object - The object to get the nested value from.
   * @param {string} path - The string path to the nested value.
   * @param {*} defaultValue - The default value to return if the nested value doesn't exist.
   * @returns {*} - The nested value or default value.
   */
  static getNestedValueOrDefault(object, path, defaultValue) {
    const keys = Typedash.pathToKeys(path)

    const diveDeep = (object_, remainingKeys) => {
      if (remainingKeys.length === 0) return object_

      const key = remainingKeys[0]

      if (!Object.hasOwnProperty.call(object_, key)) return defaultValue

      return diveDeep(object_[key], remainingKeys.slice(1))
    }

    return diveDeep(object, keys)
  }

  /**
   * Ensures the given input contains both of the two provided properties.
   * @param {*} input - Any input object
   * @returns {boolean} - True if the input contains both of the two provided properties.
   */
  static hasThisAndThatProp(input, this_, that_) {
    return Object.keys(input).includes(this_) && Object.keys(input).includes(that_)
  }

  /**
   * Ensures the given input contains at lest one of the two provided properties.
   * @param {*} input - Any input object
   * @returns {boolean} - True if the input contains at least one of the two provided properties.
   */
  static hasThisOrThatProp(input, this_, that_) {
    return Object.keys(input).includes(this_) || Object.keys(input).includes(that_)
  }

  /**
   * Merges two objects.
   * @param {Object} object1 - First object.
   * @param {Object} object2 - Second object.
   * @returns {Object} - Merged object.
   */
  static mergeObjects(object1, object2) {
    return { ...object1, ...object2 }
  }

  /**
   * Sets a nested value in an object using a string path.
   * @param {Object} object - The object to set the nested value in.
   * @param {string} path - The string path to the nested location.
   * @param {*} value - The value to set.
   */
  static setNestedValue(object, path, value) {
    const keys  = Typedash.pathToKeys(path)
    let current = object

    keys.slice(0, -1).forEach((key, index) => {
      if (!current[key] || typeof current[key] !== 'object') {
        const nextKey = keys[index + 1]
        current[key]  = current[key] || (/^\d+$/.test(nextKey) ? [] : {})
      }
      current = current[key]
    })

    current[keys.at(-1)] = value
  }
}
