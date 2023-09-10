/* eslint-disable sort-class-members/sort-class-members */
import Arraydash  from './arraydash/Arraydash.js'
import Objectdash from './objectdash/Objectdash.js'
import Typedash   from './typedash/Typedash.js'

/**
 * Min(i)dash - A collection of useful utility functions so we don't have to import lodash.
 * @class
 */
export default class Mindash {
  static {
    [ Typedash, Arraydash, Objectdash ].forEach((currentClass) => {
      const methodNames = Object.getOwnPropertyNames(currentClass).filter(
        name => ![ 'length', 'prototype', 'name', 'constructor' ].includes(name) && typeof currentClass[name] === 'function'
      )

      methodNames.forEach((methodName) => {
        Mindash[methodName] = currentClass[methodName].bind(currentClass)
      })
    })
  }
}
