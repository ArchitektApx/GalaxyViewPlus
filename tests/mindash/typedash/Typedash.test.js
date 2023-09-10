/* eslint-disable sonarjs/no-duplicate-string */
import Typedash from '../../../src/mindash/typedash/Typedash.js'

describe('Typedash', () => {
  describe('defaultTo', () => {
    it('should return input when it is "something"', () => {
      expect(Typedash.defaultTo('Hello')).toBe('Hello')
      expect(Typedash.defaultTo([ 'apple' ])).toEqual([ 'apple' ])
      expect(Typedash.defaultTo({ fruit: 'apple' })).toEqual({ fruit: 'apple' })
      expect(Typedash.defaultTo(5)).toBe(5)
    })

    it('should return fallback if input is not "something"', () => {
      expect(Typedash.defaultTo([])).toBe('')
      expect(Typedash.defaultTo(null, 'fallback')).toBe('fallback')
      expect(Typedash.defaultTo(undefined, 'fallback')).toBe('fallback')
      expect(Typedash.defaultTo({}, 'fallback')).toBe('fallback')
    })
  })

  describe('forceArray', () => {
    it('should return the input if it is already an array', () => {
      expect(Typedash.forceArray([ 'apple' ])).toEqual([ 'apple' ])
    })

    it('should return the input wrapped in an array if it is not an array', () => {
      expect(Typedash.forceArray('apple')).toEqual([ 'apple' ])
    })
  })

  describe('hasZeroLength', () => {
    it('should return true for objects with zero length', () => {
      expect(Typedash.hasZeroLength([])).toBe(true)
      expect(Typedash.hasZeroLength('')).toBe(true)
    })

    it('should return false for objects with non-zero length', () => {
      expect(Typedash.hasZeroLength([ 'apple' ])).toBe(false)
      expect(Typedash.hasZeroLength('apple')).toBe(false)
    })
  })

  describe('isArrayOrObject', () => {
    it('should return true for arrays and objects', () => {
      expect(Typedash.isArrayOrObject([])).toBe(true)
      expect(Typedash.isArrayOrObject({})).toBe(true)
    })

    it('should return false for non-arrays and non-objects', () => {
      expect(Typedash.isArrayOrObject('apple')).toBe(false)
      expect(Typedash.isArrayOrObject(5)).toBe(false)
    })
  })

  describe('isEmptyArray', () => {
    it('should return true for empty arrays', () => {
      expect(Typedash.isEmptyArray([])).toBe(true)
    })

    it('should return false for non-empty arrays or non-arrays', () => {
      expect(Typedash.isEmptyArray([ 'apple' ])).toBe(false)
      expect(Typedash.isEmptyArray('apple')).toBe(false)
    })
  })

  describe('isEmptyObject', () => {
    it('should return true for empty objects', () => {
      expect(Typedash.isEmptyObject({})).toBe(true)
    })

    it('should return false for non-empty objects or non-objects', () => {
      expect(Typedash.isEmptyObject({ fruit: 'apple' })).toBe(false)
      expect(Typedash.isEmptyObject([])).toBe(false)
    })
  })

  describe('isNullOrEmptyString', () => {
    it('should return true for null, undefined, or empty strings', () => {
      expect(Typedash.isNullOrEmptyString('')).toBe(true)
      expect(Typedash.isNullOrEmptyString(null)).toBe(true)
      expect(Typedash.isNullOrEmptyString()).toBe(true)
    })

    it('should return false otherwise', () => {
      expect(Typedash.isNullOrEmptyString('apple')).toBe(false)
    })
  })

  describe('isSomething', () => {
    it('should return true for non-empty strings, numbers, non-empty arrays, and non-empty objects', () => {
      expect(Typedash.isSomething('apple')).toBe(true)
      expect(Typedash.isSomething(5)).toBe(true)
      expect(Typedash.isSomething([ 'apple' ])).toBe(true)
      expect(Typedash.isSomething({ fruit: 'apple' })).toBe(true)
    })

    it('should return false for null, undefined, empty strings, empty arrays, and empty objects', () => {
      expect(Typedash.isSomething(null)).toBe(false)
      expect(Typedash.isSomething()).toBe(false)
      expect(Typedash.isSomething('')).toBe(false)
      expect(Typedash.isSomething([])).toBe(false)
      expect(Typedash.isSomething({})).toBe(false)
    })
  })

  describe('isThisAndThat', () => {
    it('should return true if input matches both of the two provided values', () => {
      expect(Typedash.isThisAndThat('apple', 'apple', 'apple')).toBe(true)
    })

    it('should return false otherwise', () => {
      expect(Typedash.isThisAndThat('apple', 'apple', 'orange')).toBe(false)
      expect(Typedash.isThisAndThat('orange', 'apple', 'orange')).toBe(false)
    })
  })

  describe('isThisOrThat', () => {
    it('should return true if input matches either of the two provided values', () => {
      expect(Typedash.isThisOrThat('apple', 'apple', 'orange')).toBe(true)
      expect(Typedash.isThisOrThat('orange', 'apple', 'orange')).toBe(true)
    })

    it('should return false otherwise', () => {
      expect(Typedash.isThisOrThat('banana', 'apple', 'orange')).toBe(false)
    })

    it('should handle null, undefined and falsy values', () => {
      expect(Typedash.isThisOrThat(null, 'apple', 'orange')).toBe(false)
      expect(Typedash.isThisOrThat(undefined, 'apple', 'orange')).toBe(false)
      expect(Typedash.isThisOrThat(0, 'apple', 'orange')).toBe(false)
      expect(Typedash.isThisOrThat(false, 'apple', 'orange')).toBe(false)
    })
  })

  describe('isThisOrThatType', () => {
    it('should return true if input type matches either of the two provided types', () => {
      expect(Typedash.isThisOrThatType('apple', 'string', 1)).toBe(true)
      expect(Typedash.isThisOrThatType(5, 'string', 1)).toBe(true)
      expect(Typedash.isThisOrThatType([ 1, 2, 3 ], [], {})).toBe(true)
      expect(Typedash.isThisOrThatType({ test: 'test' }, [], {})).toBe(true)
    })

    it('should return false otherwise', () => {
      expect(Typedash.isThisOrThatType('apple', 1, {})).toBe(false)
      expect(Typedash.isThisOrThatType(5, [], {})).toBe(false)
      expect(Typedash.isThisOrThatType([ 1, 2, 3 ], 1, 'string')).toBe(false)
      expect(Typedash.isThisOrThatType({ test: 'test' }, 'string', 1)).toBe(false)
    })

    it('should handle null, undefined and falsy values', () => {
      expect(Typedash.isThisOrThatType(null, [], {})).toBe(false)
      expect(Typedash.isThisOrThatType(undefined, [], {})).toBe(false)
      expect(Typedash.isThisOrThatType(0, [], {})).toBe(false)
      expect(Typedash.isThisOrThatType(false, [], {})).toBe(false)
    })
  })

  describe('isType', () => {
    it('should return true if input type matches the provided type', () => {
      expect(Typedash.isType('apple', 'string')).toBe(true)
      expect(Typedash.isType(5, 1)).toBe(true)
      expect(Typedash.isType([ 1, 2, 3 ], [])).toBe(true)
      expect(Typedash.isType({ test: 'test' },  {})).toBe(true)
    })

    it('should return false otherwise', () => {
      expect(Typedash.isType('apple', 0)).toBe(false)
      expect(Typedash.isType(5, 'string')).toBe(false)
      expect(Typedash.isType([ 1, 2, 3 ], {})).toBe(false)
      expect(Typedash.isType({ test: 'test' },  [])).toBe(false)
    })

    it('should handle null, undefined and falsy values', () => {
      expect(Typedash.isType(null, {})).toBe(false)
      expect(Typedash.isType(undefined, {})).toBe(false)
      expect(Typedash.isType(0, 'number')).toBe(false)
      expect(Typedash.isType(false, [])).toBe(false)
    })

    it('should default to string type if none provided', () => {
      expect(Typedash.isType('apple')).toBe(true)
      expect(Typedash.isType(5)).toBe(false)
    })
  })

  describe('pathFromKeys', () => {
    it('should convert array of keys to dot-notation string path', () => {
      expect(Typedash.pathFromKeys([ 'a', 'b', 'c' ])).toBe('a.b.c')
      expect(Typedash.pathFromKeys([ 'a', 0, 'c' ])).toBe('a[0].c')
    })
  })

  describe('pathToKeys', () => {
    it('should convert dot-notation string path to array of keys', () => {
      expect(Typedash.pathToKeys('a.b.c')).toEqual([ 'a', 'b', 'c' ])
      expect(Typedash.pathToKeys('a[0].c')).toEqual([ 'a', '0', 'c' ])
    })

    it('should throw an error if path is not a string', () => {
      expect(() => Typedash.pathToKeys(123)).toThrow(TypeError)
    })
  })

  describe('prepareInput', () => {
    it('should prepare the input for array-based actions', () => {
      expect(Typedash.prepareInput('apple')).toEqual([ 'apple' ])
      expect(Typedash.prepareInput([ 'apple', 'orange' ])).toEqual([ 'apple', 'orange' ])
    })

    it('should convert objects to arrays of their entries if specified', () => {
      const object = { fruit: 'apple', count: 5 }
      expect(Typedash.prepareInput(object, true)).toEqual([ [ 'fruit', 'apple' ], [ 'count', 5 ] ])
    })
  })
})
