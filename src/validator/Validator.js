import Mindash    from '../mindash/Mindash.js'
import StaticData from '../staticdata/StaticData.js'

/**
 * The Validator class is a static class that provides methods to validate data.
 * @class
 */
export default class Validator {
  // static methods
  /**
   * escapes a string for html
   * @param   {string} string - The string to escape
   * @returns {string}        - The escaped string
   * @public
   * @static
   */
  static escapeString(string) {
    const map = {
      '"' : '&quot;',
      '&' : '&amp;',
      "'" : '&#x27;',
      '/' : '&#x2F;',
      '<' : '&lt;',
      '>' : '&gt;',
    }

    const reg = /["&'/<>]/g

    return string.replaceAll(reg, match => map[match])
  }

  /**
   * returns a filtered deep copy of an object
   * @param   {object} object      - The object to copy
   * @param   {Array}  ignorePaths - The paths to ignore within the features (user defined)
   * @returns {object}             - The copied object
   * @public
   * @static
   */
  static getFilteredObject(object, ignorePaths = []) {
    // see deletePropertyByPath for ignorePaths syntax explanation
    const filteredObject = Validator.getObjectDeepCopy(object)
    return Validator.#deletePropertyByPath(filteredObject, ignorePaths)
  }

  /**
   * returns a deep copy of an object
   * @param   {object} object - The object to copy
   * @returns {object}        - The copied object
   * @public
   * @static
   */
  static getObjectDeepCopy(object) {
    return JSON.parse(JSON.stringify(object))
  }

  /**
   * unix timestamp
   * @returns {number} - The timestamp
   * @public
   * @static
   */
  static getTimestamp() {
    return Date.now()
  }

  /**
   * returns a timestamp string
   * @returns {string} - The timestamp string
   * @public
   * @static
   */
  static getTimeStampString() {
    const date = new Date()

    return date.toISOString()
  }

  /**
   * compares two objects and returns true if they are equal
   * @param   {object}  object1 - The first object to compare
   * @param   {object}  object2 - The second object to compare
   * @returns {boolean}         - True if the objects are equal
   * @public
   * @static
   */
  static isObjectEqual(object1, object2) {
    return JSON.stringify(object1) === JSON.stringify(object2)
  }

  /**
   * migrates a config object to the current version of the config by merging the user data into the default config
   * @param   {object} config        - The config to migrate
   * @param   {object} defaultConfig - The default config
   * @returns {object}               - The migrated config
   * @public
   * @static
   */
  static migrateConfig(config, defaultConfig) {
    // take deep copy of current config
    const configCopy = Validator.getObjectDeepCopy(config)
    // Take the DEFAULT_CONFIG as a base
    const newConfig = Validator.getObjectDeepCopy(defaultConfig)

    // merge user data in features that still exist
    configCopy.features.forEach((old) => {
      const newData = newConfig.features.find(newFeature => old.feature === newFeature.feature)
      if (newData) { Validator.#migrateFeatureData(old, newData) }
    })

    // just to be sure deep copy the new config again
    return Validator.getObjectDeepCopy(newConfig)
  }

  /**
   * takes a string or a array of strings and returns them sanitized
   * @param   {string|Array} strings - The string or array of strings to sanitize
   * @returns {string|Array}         - The sanitized string or array of strings
   * @public
   * @static
   */
  static sanitizeStrings(strings) {
    return Array.isArray(strings)
      ? strings.map(string => Validator.escapeString(string))
      : Validator.escapeString(strings)
  }

  /**
   * uniques an array of items
   * @param   {Array} items - The array to unique
   * @returns {Array}       - The unique array
   * @public
   * @static
   */
  static uniqueItems(items) {
    // takes an array or a single value and returns either the array with unique values or a single value
    return Array.isArray(items) ? [ ...new Set(items) ] : items
  }

  /**
   * validates a color input
   * @param   {string}  color - The (hex) color to validate
   * @returns {boolean}       - True if the color is valid
   * @public
   * @static
   */
  static validateColorInput(color) {
    const colorRegex = /^#[\dA-Fa-f]{6}$/

    return colorRegex.test(color)
  }

  /**
   * validates a config object
   * @param   {object}  configObject  - The config object to validate
   * @param   {object}  defaultConfig - The default config to validate against
   * @param   {Array}   ignorePaths   - The paths to ignore within the features (user defined)
   * @returns {boolean}               - True if the config object is valid
   * @public
   * @static
   */
  static validateConfig(
    configObject,
    defaultConfig = StaticData.DEFAULT_CONFIG,
    ignorePaths = StaticData.USER_DEFINED_FEATURE_PROPERTIES
  ) {
    // validate if a config object is valid (=everything besides user data matches the default config)
    const filteredRunningConfig = Validator.getFilteredObject(configObject, ignorePaths)
    const filteredDefaultConfig = Validator.getFilteredObject(defaultConfig, ignorePaths)

    return (Validator.isObjectEqual(filteredRunningConfig, filteredDefaultConfig))
  }

  /**
   * validates a the value from an input matches a number
   * @param   {string}  number - The number to validate
   * @returns {boolean}        - True if the number is valid
   * @public
   * @static
   */
  static validateNumberInput(number) {
    const numberRegex = /^\d*$/

    return numberRegex.test(number)
  }

  /**
   * validates a the value from an input matches a string
   * @param   {string}  string - The string to validate
   * @returns {boolean}        - True if the string is valid
   * @public
   * @static
   */
  static validateStringInput(string) {
    const stringRegex = /^[\p{L}\p{N}_\-. ]*$/u

    return stringRegex.test(string)
  }

  /**
   * Deletes properties from a feature within an object.
   * @param   {object} feature      - The feature object.
   * @param   {Array}  keysToRemove - The properties to delete.
   * @returns {object}              - The feature without the deleted properties.
   * @private
   * @static
   */
  static #deletePropertiesFromFeature(feature, keysToRemove) {
    keysToRemove.forEach((key) => {
      delete feature[key]
    })
    return feature
  }

  /**
   * Takes an object and user-defined feature properties and deletes them from the object.
   * @param   {object} object            - The object to delete from.
   * @param   {Array}  featureProperties - The properties to delete.
   * @returns {object}                   - The object without the deleted properties.
   * @private
   * @static
   */
  static #deletePropertyByPath(object, featureProperties) {
    if (!object?.features || !featureProperties) {
      return object
    }

    const clone        = Validator.getObjectDeepCopy(object)
    const keysToRemove = Mindash.forceArray(featureProperties)

    clone.features = clone.features.map(
      feature => this.#deletePropertiesFromFeature(feature, keysToRemove)
    )

    return clone
  }

  /**
   * helper for config migration to preserve user defined ata
   * @param   {object} oldFeature - the old config version containing the users config
   * @param   {object} newFeature - the new config version
   * @returns {void}
   * @private
   * @static
   */
  static #migrateFeatureData(oldFeature, newFeature) {
    newFeature.data   = oldFeature.data || newFeature.data
    newFeature.active = oldFeature.active || newFeature.active
  }

  // static private methods
}
