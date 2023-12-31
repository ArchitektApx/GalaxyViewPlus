// eslint-disable-next-line import/no-extraneous-dependencies
import { diffApply } from 'just-diff-apply'
import StaticData    from '../staticdata/StaticData.js'

/**
 * The Validator class is a static class that provides methods to validate data.
 * @class
 */
export default class Validator {
  /**
   * returns a filtered deep copy of an object
   * @param   {object} object      - The object to copy
   * @returns {object}             - The copied object
   * @throws  {Error}              - Throws an error if the object is not valid
   * @public
   * @static
   */
  static getFilteredConfig(object) {
    const deepCopy = Validator.getObjectDeepCopy(object)
    diffApply(deepCopy, StaticData.JSON_PATCH_USERDATA)
    return deepCopy
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
   * validates a config object
   * @param   {object}  configObject  - The config object to validate
   * @param   {object}  defaultConfig - The default config to validate against
   * @returns {boolean}               - True if the config object is valid
   * @public
   * @static
   */
  static validateConfig(
    configObject,
    defaultConfig = StaticData.DEFAULT_CONFIG
  ) {
    // get the filtered config objects (without user data)
    let filteredRunning
    // if usersdata paths are missing getFilteredConfig will throw => it's surely not valid
    try {
      filteredRunning = Validator.getFilteredConfig(configObject)
    } catch {
      return false
    }
    const filteredDefault = Validator.getFilteredConfig(defaultConfig)

    return (Validator.isObjectEqual(filteredRunning, filteredDefault))
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
}
