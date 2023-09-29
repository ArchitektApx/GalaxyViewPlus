import Arraydash from '../../../src/mindash/arraydash/Arraydash.js'

describe('Arraydash', () => {
  describe('arrayAction', () => {
    it('should execute a specified action on an array', () => {
      const input  = [ 1, 2, 3, 4, 5 ]
      const result = Arraydash.arrayAction('map', input, x => x * 2)
      expect(result).toEqual([ 2, 4, 6, 8, 10 ])
    })

    it('should throw an error for unsupported actions', () => {
      expect(() => Arraydash.arrayAction('unsupported', [], () => {})).toThrow(TypeError)
    })

    it('should work with objects when spreadObject is true', () => {
      const input  = { a: 1, b: 2, c: 3 }
      const result = Arraydash.arrayAction('map', input, ([ k, v ]) => [ k, v * 2 ], true)
      expect(result).toEqual([ [ 'a', 2 ], [ 'b', 4 ], [ 'c', 6 ] ])
    })
  })

  describe('filterAny', () => {
    it('should filter elements in an array', () => {
      const input  = [ 1, 2, 3, 4, 5 ]
      const result = Arraydash.filterAny(input, x => x > 2)
      expect(result).toEqual([ 3, 4, 5 ])
    })

    it('should filter key-value pairs in an object when spreadObject is true', () => {
      const input  = { a: 1, b: 2, c: 3 }
      const result = Arraydash.filterAny(input, ([ k, v ]) => v > 1, true)
      expect(result).toEqual([ [ 'b', 2 ], [ 'c', 3 ] ])
    })

    it('should filter a single string as one array element', () => {
      const input  = 'hello'
      const result = Arraydash.filterAny(input, x => x === 'hello')
      expect(result).toEqual([ 'hello' ])
    })
  })

  describe('forAny', () => {
    it('should iterate over elements in an array', () => {
      const input  = [ 1, 2, 3 ]
      const output = []
      Arraydash.forAny(input, x => output.push(x * 2))
      expect(output).toEqual([ 2, 4, 6 ])
    })

    it('should iterate over key-value pairs in an object when spreadObject is true', () => {
      const input  = { a: 1, b: 2, c: 3 }
      const output = []
      Arraydash.forAny(input, ([ k, v ]) => output.push([ k, v * 2 ]), true)
      expect(output).toEqual([ [ 'a', 2 ], [ 'b', 4 ], [ 'c', 6 ] ])
    })
  })

  describe('mapAny', () => {
    it('should map elements in an array', () => {
      const input  = [ 1, 2, 3 ]
      const result = Arraydash.mapAny(input, x => x * 2)
      expect(result).toEqual([ 2, 4, 6 ])
    })

    it('should map key-value pairs in an object when spreadObject is true', () => {
      const input  = { a: 1, b: 2, c: 3 }
      const result = Arraydash.mapAny(input, ([ k, v ]) => [ k, v * 2 ], true)
      expect(result).toEqual([ [ 'a', 2 ], [ 'b', 4 ], [ 'c', 6 ] ])
    })
  })

  describe('Edge Cases', () => {
    const invalidInputs = [ undefined, null, '', 'hello', 123, () => {} ]

    invalidInputs.forEach((invalidInput) => {
      it(`should handle invalid input type: ${ typeof invalidInput } for arrayAction`, () => {
        expect(() => Arraydash.arrayAction('map', invalidInput, x => x)).not.toThrow()
      })

      it(`should handle invalid input type: ${ typeof invalidInput } for filterAny`, () => {
        expect(() => Arraydash.filterAny(invalidInput, x => x)).not.toThrow()
      })

      it(`should handle invalid input type: ${ typeof invalidInput } for forAny`, () => {
        expect(() => Arraydash.forAny(invalidInput, x => x)).not.toThrow()
      })

      it(`should handle invalid input type: ${ typeof invalidInput } for mapAny`, () => {
        expect(() => Arraydash.mapAny(invalidInput, x => x)).not.toThrow()
      })
    })

    it('should not spread a string when spreadObject is true for arrayAction', () => {
      const result = Arraydash.arrayAction('map', 'hello', x => x, true)
      expect(result).toEqual([ 'hello' ])
    })

    it('should return an empty array for null or undefined input for arrayAction', () => {
      const resultForUndefined = Arraydash.arrayAction('map', undefined, x => x)
      const resultForNull      = Arraydash.arrayAction('map', null, x => x)
      expect(resultForUndefined).toEqual([])
      expect(resultForNull).toEqual([])
    })
  })
})
