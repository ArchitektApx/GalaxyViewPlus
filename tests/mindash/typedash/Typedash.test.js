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

  describe('isThisOrThat', () => {
    it('should return true if input matches either of the two provided values', () => {
      expect(Typedash.isThisOrThat('apple', 'apple', 'orange')).toBe(true)
      expect(Typedash.isThisOrThat('orange', 'apple', 'orange')).toBe(true)
    })

    it('should return false otherwise', () => {
      expect(Typedash.isThisOrThat('banana', 'apple', 'orange')).toBe(false)
    })
  })

  describe('isType', () => {
    it('should return true if input type matches the provided type', () => {
      expect(Typedash.isType('apple', 'string')).toBe(true)
      expect(Typedash.isType(5, 'number')).toBe(true)
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
