import Mindash    from '../../src/mindash/Mindash.js'
import Arraydash  from '../../src/mindash/arraydash/Arraydash.js'
import Objectdash from '../../src/mindash/objectdash/Objectdash.js'
import Typedash   from '../../src/mindash/typedash/Typedash.js'

jest.mock('../../src/mindash/arraydash/Arraydash.js')
jest.mock('../../src/mindash/objectdash/Objectdash.js')
jest.mock('../../src/mindash/typedash/Typedash.js')

describe('Mindash', () => {
  afterEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks()
  })

  describe('Arraydash methods', () => {
    it('should delegate to Arraydash.arrayAction', () => {
      Mindash.arrayAction('someAction', [], jest.fn())
      expect(Arraydash.arrayAction).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Arraydash.filterAny', () => {
      Mindash.filterAny([], jest.fn())
      expect(Arraydash.filterAny).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Arraydash.forAny', () => {
      Mindash.forAny([], jest.fn())
      expect(Arraydash.forAny).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Arraydash.mapAny', () => {
      Mindash.mapAny([], jest.fn())
      expect(Arraydash.mapAny).toHaveBeenCalledTimes(1)
    })
  })

  describe('Objectdash methods', () => {
    it('should delegate to Objectdash.deepClone', () => {
      Mindash.deepClone({})
      expect(Objectdash.deepClone).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Objectdash.getNestedValueOrDefault', () => {
      Mindash.getNestedValueOrDefault({}, 'path', 'default')
      expect(Objectdash.getNestedValueOrDefault).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Objectdash.mergeObjects', () => {
      Mindash.mergeObjects({}, {})
      expect(Objectdash.mergeObjects).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Objectdash.setNestedValue', () => {
      Mindash.setNestedValue({}, 'path', 'value')
      expect(Objectdash.setNestedValue).toHaveBeenCalledTimes(1)
    })
  })

  describe('Typedash methods', () => {
    it('should delegate to Typedash.defaultTo', () => {
      Mindash.defaultTo('someValue', 'fallbackValue')
      expect(Typedash.defaultTo).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.forceArray', () => {
      Mindash.forceArray('value')
      expect(Typedash.forceArray).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.hasZeroLength', () => {
      Mindash.hasZeroLength('value')
      expect(Typedash.hasZeroLength).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.isEmptyArray', () => {
      Mindash.isEmptyArray([])
      expect(Typedash.isEmptyArray).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.isEmptyObject', () => {
      Mindash.isEmptyObject({})
      expect(Typedash.isEmptyObject).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.isNullOrEmptyString', () => {
      Mindash.isNullOrEmptyString('')
      expect(Typedash.isNullOrEmptyString).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.isSomething', () => {
      Mindash.isSomething('value')
      expect(Typedash.isSomething).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.isThisOrThat', () => {
      Mindash.isThisOrThat('value', 'this', 'that')
      expect(Typedash.isThisOrThat).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.isType', () => {
      Mindash.isType('value', 'type')
      expect(Typedash.isType).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.pathFromKeys', () => {
      Mindash.pathFromKeys([ 'key' ])
      expect(Typedash.pathFromKeys).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.pathToKeys', () => {
      Mindash.pathToKeys('key')
      expect(Typedash.pathToKeys).toHaveBeenCalledTimes(1)
    })

    it('should delegate to Typedash.prepareInput', () => {
      Mindash.prepareInput('value')
      expect(Typedash.prepareInput).toHaveBeenCalledTimes(1)
    })
  })
})
