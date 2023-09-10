import Objectdash from '../../../src/mindash/objectdash/Objectdash.js'

describe('Objectdash', () => {
  describe('deepClone', () => {
    it('should deep clone a simple object', () => {
      const object       = { a: 1, b: 2 }
      const clonedObject = Objectdash.deepClone(object)
      expect(clonedObject).toEqual(object)
      expect(clonedObject).not.toBe(object)
    })

    it('should deep clone a nested object', () => {
      const object       = { a: { b: { c: 3 } } }
      const clonedObject = Objectdash.deepClone(object)
      expect(clonedObject).toEqual(object)
      expect(clonedObject.a.b).not.toBe(object.a.b)
    })
  })

  describe('getNestedValueOrDefault', () => {
    const object = { a: { b: { c: 3, d: null } }, e: 'test' }

    it('should retrieve a nested value', () => {
      expect(Objectdash.getNestedValueOrDefault(object, 'a.b.c', 'default')).toBe(3)
    })

    it('should return the default value for non-existing path', () => {
      expect(Objectdash.getNestedValueOrDefault(object, 'a.b.x', 'default')).toBe('default')
    })

    it('should handle array indexes in paths', () => {
      const arrayObject = { arr: [ { val: 'first' }, { val: 'second' } ] }
      expect(Objectdash.getNestedValueOrDefault(arrayObject, 'arr[1].val', 'default')).toBe('second')
    })
  })

  describe('mergeObjects', () => {
    it('should merge two simple objects', () => {
      const object1 = { a: 1 }
      const object2 = { b: 2 }
      expect(Objectdash.mergeObjects(object1, object2)).toEqual({ a: 1, b: 2 })
    })

    it('should override properties from the first object with the second', () => {
      const object1 = { a: 1, b: 3 }
      const object2 = { b: 2 }
      expect(Objectdash.mergeObjects(object1, object2)).toEqual({ a: 1, b: 2 })
    })
  })

  describe('setNestedValue', () => {
    it('should set a nested value in an empty object', () => {
      const object = {}
      Objectdash.setNestedValue(object, 'a.b.c', 3)
      expect(object).toEqual({ a: { b: { c: 3 } } })
    })

    it('should overwrite an existing nested value', () => {
      const object = { a: { b: { c: 1 } } }
      Objectdash.setNestedValue(object, 'a.b.c', 3)
      expect(object).toEqual({ a: { b: { c: 3 } } })
    })

    it('should handle array indexes in paths', () => {
      const object = { arr: [ { val: 'first' } ] }
      Objectdash.setNestedValue(object, 'arr[1].val', 'second')
      expect(object).toEqual({ arr: [ { val: 'first' }, { val: 'second' } ] })
    })

    it('should set a nested value within an array', () => {
      const object = {}
      Objectdash.setNestedValue(object, 'a.0.b', 'value')

      expect(object).toEqual({ a: [ { b: 'value' } ] })
    })
  })
})
