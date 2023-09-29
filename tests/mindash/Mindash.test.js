import Mindash    from '../../src/mindash/Mindash.js'
import Arraydash  from '../../src/mindash/arraydash/Arraydash.js'
import Objectdash from '../../src/mindash/objectdash/Objectdash.js'
import Typedash   from '../../src/mindash/typedash/Typedash.js'
import Cleandash  from '../../src/mindash/cleandash/Cleandash.js'

describe('Mindash', () => {
  afterEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks()
  })

  const defaultMethods = new Set([ 'length', 'prototype', 'name' ])

  function checkMethodsExistence(classReference, className) {
    Object.getOwnPropertyNames(classReference).forEach((method) => {
      if (typeof classReference[method] === 'function' && !defaultMethods.has(method)) {
        it(`should have the static method ${ method } from ${ className }`, () => {
          expect(typeof Mindash[method]).toBe('function')
        })
      }
    })
  }

  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

  describe('Arraydash methods', () => {
    checkMethodsExistence(Arraydash, 'Arraydash')
  })

  describe('Objectdash methods', () => {
    checkMethodsExistence(Objectdash, 'Objectdash')
  })

  describe('Typedash methods', () => {
    checkMethodsExistence(Typedash, 'Typedash')
  })

  describe('Cleandash methods', () => {
    checkMethodsExistence(Cleandash, 'Cleandash')
  })

  it('should not have had any errors while adding methods', () => {
    expect(consoleErrorSpy).not.toHaveBeenCalled()
  })
})
