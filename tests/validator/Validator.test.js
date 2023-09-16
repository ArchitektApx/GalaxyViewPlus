/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-underscore-dangle */
/* eslint-disable quotes */
/* eslint-disable babel/quotes */
import StaticData from '../../src/staticdata/StaticData.js'
import Validator  from '../../src/validator/Validator.js'

describe('Validator', () => {
  describe('getFilteredObject', () => {
    it('should return a filtered deep copy of a valid config object', () => {
      const object         = StaticData.DEFAULT_CONFIG
      const filteredObject = Validator.getFilteredConfig(object)

      expect(filteredObject.features).toHaveLength(6)
      expect(filteredObject.features[0].feature).toBe('userRecolor')
      expect(filteredObject.features[0].active).toBeUndefined()
      expect(filteredObject.features[0].data).toBeUndefined()
      expect(filteredObject.features[0].sortData).toBeUndefined()
      expect(filteredObject.features[3].feature).toBe('rangeInfo')
      expect(filteredObject.features[3].active).toBeUndefined()
      expect(filteredObject.features[3].data).toBeUndefined()
    })

    it('should throw an error if the object is not valid', () => {
      const object = { features: [ { feature: 'feature1', data: 'data1' } ] }

      expect(() => Validator.getFilteredConfig(object)).toThrow()
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
    it('should return true if config is valid', () => {
      // load default config and modify some values users are allowed to modify
      const object = StaticData.DEFAULT_CONFIG
      object.features.forEach((feature) => { feature.active = false })
      object.features[0].sortData = false
      object.features[1].sortData = false
      object.features[0].data     = [ { key: 'key1', value: 'value1' } ]
      object.features[1].data     = [ { key: 'key2', value: 'value2' } ]

      expect(Validator.validateConfig(object)).toBe(true)
    })

    it('should return false if config is invalid', () => {
      const object = { features: [ { feature: 'feature1', data: 'data1' } ] }

      expect(Validator.validateConfig(object)).toBe(false)
    })
  })
})
