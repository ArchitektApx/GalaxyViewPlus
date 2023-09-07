/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-underscore-dangle */
/* eslint-disable quotes */
/* eslint-disable babel/quotes */
import Validator from '../../src/validator/Validator.js'

describe('Validator', () => {
  describe('escapeString', () => {
    it('should escape special characters in a string', () => {
      const string_       =  `"<&'/">`
      const escapedString = Validator.escapeString(string_)

      expect(escapedString).toBe('&quot;&lt;&amp;&#x27;&#x2F;&quot;&gt;')
    })

    it('should return the same string if no special characters are present', () => {
      const string_       = 'normalString'
      const escapedString = Validator.escapeString(string_)

      expect(escapedString).toBe('normalString')
    })
  })

  describe('getFilteredObject', () => {
    it('should return an object without the specified paths', () => {
      const object = {
        features: [
          { prop1: 'value1', prop2: 'value2', prop3: 'value3' } ],
      }

      const filteredObject = Validator.getFilteredObject(object, [ 'prop2' ])

      expect(filteredObject).toEqual({
        features: [
          { prop1: 'value1', prop3: 'value3' } ],
      })
    })

    it('should return the same object if ignorepaths is empty', () => {
      const object = {
        features: [
          { prop1: 'value1', prop2: 'value2', prop3: 'value3' } ],
      }

      const filteredObject = Validator.getFilteredObject(object)

      expect(filteredObject).toEqual(object)
    })

    it('should handle only one path as string', () => {
      const object = {
        features: [
          { prop1: 'value1', prop2: 'value2', prop3: 'value3' } ],
      }

      const filteredObject = Validator.getFilteredObject(object, 'prop2')

      expect(filteredObject).toEqual({
        features: [
          { prop1: 'value1', prop3: 'value3' } ],
      })
    })

    it('should handle invalid paths', () => {
      const object = {
        features: [
          { prop1: 'value1', prop2: 'value2', prop3: 'value3' } ],
      }

      const filteredObject = Validator.getFilteredObject(object, [ 'prop4' ])

      expect(filteredObject).toEqual(object)
    })

    it('should handle empty input objects', () => {
      const object = 'invalidObject'

      const filteredObject = Validator.getFilteredObject(object, [ 'prop4' ])

      expect(filteredObject).toEqual(object)
    })

    it('should handle empty object and empty string so #deletePropertyByPath uses its default parameters', () => {
      const object = {}

      const filteredObject = Validator.getFilteredObject(object, '')

      expect(filteredObject).toEqual(object)
    })
  })

  describe('getObjectDeepCopy', () => {
    it('should return a deep copy of an object', () => {
      const object   = { prop1: { nestedProp: 'value' } }
      const deepCopy = Validator.getObjectDeepCopy(object)

      object.prop1.nestedProp = 'changedValue'
      expect(deepCopy.prop1.nestedProp).toBe('value')
    })
  })

  describe('isBoolean', () => {
    it('should return true if input is boolean', () => {
      expect(Validator.isBoolean(true)).toBe(true)
      expect(Validator.isBoolean(false)).toBe(true)
      expect(Validator.isBoolean('true')).toBe(false)
    })
  })

  describe('getTimestamp', () => {
    it('should return a current timestamp', () => {
      const before    = Date.now()
      const timestamp = Validator.getTimestamp()
      const after     = Date.now()

      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after)
    })

    it('should return the current timestamp', () => {
      const before = Date.now()
      const result = Validator.getTimestamp()
      const after  = Date.now()

      expect(result).toBeGreaterThanOrEqual(before)
      expect(result).toBeLessThanOrEqual(after)
    })
  })

  describe('getTimeStampString', () => {
    it('should return a string representation of the current timestamp', () => {
      const isoString = Validator.getTimeStampString()

      expect(new Date(isoString).toISOString()).toBe(isoString)
    })

    it('should return a correctly formatted ISO timestamp string', () => {
      const isoPattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/

      expect(Validator.getTimeStampString()).toMatch(isoPattern)
    })
  })

  describe('isInt', () => {
    it('should validate integers', () => {
      expect(Validator.isInt(10)).toBe(true)
      expect(Validator.isInt('10', true)).toBe(true)
      expect(Validator.isInt('10.5', true)).toBe(false)
      expect(Validator.isInt('10a', true)).toBe(false)
    })

    it('should correctly identify integers using force parameter', () => {
      expect(Validator.isInt(123)).toBe(true)
      expect(Validator.isInt('123', true)).toBe(true)
      expect(Validator.isInt('123a', true)).toBe(false)
      expect(Validator.isInt(123.45)).toBe(false)
      expect(Validator.isInt('123.45', true)).toBe(false)
    })

    it('should return false for non-string input with force=true', () => {
      expect(Validator.isInt(123.45, true)).toBe(false)
    })

    it('should return false for non-integer strings', () => {
      expect(Validator.isInt('123.45')).toBe(false)
      expect(Validator.isInt('123a')).toBe(false)
    })

    it('should handle arrays of integers', () => {
      expect(Validator.isInt([ 1, 2, 3 ])).toBe(true)
      expect(Validator.isInt([ '1', '2', '3' ])).toBe(false)
    })
  })

  describe('isObjectEqual', () => {
    it('should compare two objects for equality', () => {
      const object1 = { a: 1, b: 2 }
      const object2 = { a: 1, b: 2 }
      const object3 = { a: 1, b: 3 }

      expect(Validator.isObjectEqual(object1, object2)).toBe(true)
      expect(Validator.isObjectEqual(object1, object3)).toBe(false)
    })

    it('should compare objects deeply', () => {
      const object1 = { a: { b: 1 } }
      const object2 = { a: { b: 1 } }
      const object3 = { a: { b: 2 } }

      expect(Validator.isObjectEqual(object1, object2)).toBe(true)
      expect(Validator.isObjectEqual(object1, object3)).toBe(false)
    })

    it('should return false for objects with different structures', () => {
      const object1 = { a: 1, b: { c: 2 } }
      const object2 = { a: 1, b: 2 }

      expect(Validator.isObjectEqual(object1, object2)).toBe(false)
    })
  })

  describe('isString', () => {
    it('should validate strings', () => {
      expect(Validator.isString("test")).toBe(true)
      expect(Validator.isString(123)).toBe(false)
      expect(Validator.isString(true)).toBe(false)
    })
  })

  describe('sanitizeStrings', () => {
    it('should escape strings for special characters', () => {
      const input  = [ `"<&'/">`, `second<&'/">` ]
      const result = Validator.sanitizeStrings(input)

      expect(result[0]).toBe('&quot;&lt;&amp;&#x27;&#x2F;&quot;&gt;')
      expect(result[1]).toBe('second&lt;&amp;&#x27;&#x2F;&quot;&gt;')
    })

    it('should handle single string input', () => {
      const input  = `"<&'/">`
      const result = Validator.sanitizeStrings(input)

      expect(result).toBe('&quot;&lt;&amp;&#x27;&#x2F;&quot;&gt;')
    })
  })

  describe('uniqueItems', () => {
    it('should return an array with unique items', () => {
      const array  = [ 1, 2, 2, 3, 4, 4, 5 ]
      const unique = Validator.uniqueItems(array)

      expect(unique).toEqual([ 1, 2, 3, 4, 5 ])
    })

    it('should handle a single value', () => {
      expect(Validator.uniqueItems(1)).toBe(1)
    })
  })

  describe('validateColorInput', () => {
    it('should validate hex color values', () => {
      expect(Validator.validateColorInput('#FFFFFF')).toBe(true)
      expect(Validator.validateColorInput('#FFFAAA')).toBe(true)
      expect(Validator.validateColorInput('#ffffff')).toBe(true)
      expect(Validator.validateColorInput('#000')).toBe(false) // not a 6 character hex
      expect(Validator.validateColorInput('#GGGGGG')).toBe(false) // not valid hex characters
      expect(Validator.validateColorInput('FFFFFF')).toBe(false)  // missing #
    })
  })

  describe('validateNumberInput', () => {
    it('should validate numerical strings', () => {
      expect(Validator.validateNumberInput('123')).toBe(true)
      expect(Validator.validateNumberInput('00123')).toBe(true)
      expect(Validator.validateNumberInput('-123')).toBe(false)  // negative number
      expect(Validator.validateNumberInput('123.45')).toBe(false) // decimal number
      expect(Validator.validateNumberInput('ABC')).toBe(false)    // not a number
    })
  })

  describe('validateStringInput', () => {
    it('should validate alphanumeric and some special characters', () => {
      expect(Validator.validateStringInput('test_String-123')).toBe(true)
      expect(Validator.validateStringInput('test String')).toBe(true)
      expect(Validator.validateStringInput('test_String_')).toBe(true)
      expect(Validator.validateStringInput('test!String')).toBe(false) // has !
    })
  })

  describe('migrateConfig', () => {
    it('should merge config with defaultConfig', () => {
      const config = {
        features: [ { feature: 'feature1', data: 'oldData', active: true } ],
      }

      const defaultConfig = {
        features: [ { feature: 'feature1', data: 'newData', active: false } ],
      }

      const mergedConfig = Validator.migrateConfig(config, defaultConfig)

      expect(mergedConfig.features[0].data).toBe('oldData')    // retains old data
      expect(mergedConfig.features[0].active).toBe(true)       // retains old active status
    })

    it('should handle features not present in the default config', () => {
      const config = {
        features: [
          { feature: 'nonExistentFeature', data: 'someData', active: true },
          { feature: 'feature1', data: 'oldData', active: true },
        ],
      }

      const defaultConfig = {
        features: [
          { feature: 'feature1', data: 'newData', active: false },
        ],
      }

      const mergedConfig = Validator.migrateConfig(config, defaultConfig)

      expect(mergedConfig.features).toHaveLength(1) // Only the feature present in defaultConfig should remain
      expect(mergedConfig.features[0].data).toBe('oldData')
    })

    it('should not add features from configCopy if not present in newConfig', () => {
      const config = {
        features: [
          { feature: 'feature1', data: 'oldData', active: true },
          { feature: 'feature2', data: 'oldData', active: true },
        ],
      }

      const defaultConfig = {
        features: [
          { feature: 'feature1', data: 'newData', active: false },
        ],
      }

      const mergedConfig = Validator.migrateConfig(config, defaultConfig)

      expect(mergedConfig.features).toHaveLength(1) // Only the feature present in defaultConfig should remain
      expect(mergedConfig.features[0].data).toBe('oldData')
    })

    it('should handle if data and active are not present in config', () => {
      const config = {
        features: [
          { feature: 'feature1' },
        ],
      }

      const defaultConfig = {
        features: [
          { feature: 'feature1', data: 'newData', active: false },
        ],
      }

      const mergedConfig = Validator.migrateConfig(config, defaultConfig)

      expect(mergedConfig.features).toHaveLength(1) // Only the feature present in defaultConfig should remain
      expect(mergedConfig.features[0].data).toBe('newData')
      expect(mergedConfig.features[0].active).toBe(false)
    })
  })

  describe('validateConfig', () => {
    it('should validate if a config object matches the default config', () => {
      const configObject = {
        features: [ { feature: 'feature1', data: 'oldData' } ],
      }

      const defaultConfig = {
        features: [ { feature: 'feature1', data: 'defaultData' } ],
      }

      expect(Validator.validateConfig(configObject, defaultConfig, [ 'data' ])).toBe(true)
      expect(Validator.validateConfig(configObject, defaultConfig)).toBe(false)  // mismatching data
    })
  })
})
