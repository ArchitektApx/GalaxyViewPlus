import StaticData from '../staticdata/StaticData.js'

export default class Validator {
  // static methods for validating
  // config data, user inputs and values fetched from the page.

  // static methods
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

  static getFilteredObject(object, ignorePaths = []) {
    // see deletePropertyByPath for ignorePaths syntax explanation
    const filteredObject = Validator.getObjectDeepCopy(object)

    return Validator.#deletePropertyByPath(filteredObject, ignorePaths)
  }

  static getObjectDeepCopy(object) {
    return JSON.parse(JSON.stringify(object))
  }

  static getTimestamp() {
    return Date.now()
  }

  static getTimeStampString() {
    const date = new Date()

    return date.toISOString()
  }

  static isBoolean(input) {
    return typeof input === 'boolean'
  }

  static isInt(input, force = false) {
    if (typeof input === 'string' && force) {
      const parsedInt = Number.parseInt(input, 10)

      return Number.isInteger(parsedInt) && String(parsedInt) === input
    }

    return Validator.#validateWithFunction(input, Number.isInteger)
  }

  static isObjectEqual(object1, object2) {
    return JSON.stringify(object1) === JSON.stringify(object2)
  }

  static isString(input) {
    return Validator.#validateWithFunction(input, value => typeof value === 'string')
  }

  static migrateConfig(config, defaultConfig) {
    // take deep copy of current config
    const configCopy = Validator.getObjectDeepCopy(config)
    // Take the DEFAULT_CONFIG as a base
    const newConfig = Validator.getObjectDeepCopy(defaultConfig)

    // merge user data in features that still exist
    configCopy.features.forEach((old) => {
      const newData = newConfig.features.find(feature => old.feature === feature.feature)

      if (newData) {
        newData.data   = old.data ?? newData.data
        newData.active = old.active ?? newData.active
      }
    })

    // just to be sure deep copy the new config again
    return Validator.getObjectDeepCopy(newConfig)
  }

  static sanitizeStrings(strings) {
    return Array.isArray(strings)
      ? strings.map(string => Validator.escapeString(string))
      : Validator.escapeString(strings)
  }

  static uniqueItems(items) {
    // takes an array or a single value and returns either the array with unique values or a single value
    return Array.isArray(items) ? [ ...new Set(items) ] : items
  }

  static validateColorInput(color) {
    const colorRegex = /^#[\dA-Fa-f]{6}$/

    return colorRegex.test(color)
  }

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

  static validateNumberInput(number) {
    const numberRegex = /^\d*$/

    return numberRegex.test(number)
  }

  static validateStringInput(string) {
    const stringRegex = /^[\p{L}\p{N}_\-. ]*$/u

    return stringRegex.test(string)
  }

  // static private methods
  static #deletePropertyByPath(object, featureProperties) {
    if (!object || object.features === undefined || !featureProperties) {
      return object
    }

    const keysToRemove = (Array.isArray(featureProperties)
      ? featureProperties
      : [ featureProperties ])

    const clone   = Validator.getObjectDeepCopy(object)
    const cleaned = clone.features.map((feature) => {
      keysToRemove.forEach((key) => {
        delete feature[key]
      })

      return feature
    })

    clone.features = cleaned

    return clone
  }

  // abstraction that takes a single value or an array of values and runs it against a given function.
  static #validateWithFunction(input, functionInput) {
    return Array.isArray(input) ? input.every(value => functionInput(value)) : functionInput(input)
  }
}
