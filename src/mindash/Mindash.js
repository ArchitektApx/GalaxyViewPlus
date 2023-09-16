import Arraydash  from './arraydash/Arraydash.js'
import Cleandash  from './cleandash/Cleandash.js'
import Objectdash from './objectdash/Objectdash.js'
import Typedash   from './typedash/Typedash.js'

/**
 * Min(i)dash - A collection of useful utility functions so we don't have to import lodash.
 * @class
 */
export default class Mindash {
  static {
    [ Typedash, Arraydash, Objectdash, Cleandash ].forEach((currentClass) => {
      const methodNames = Object.getOwnPropertyNames(currentClass).filter(
        name => ![ 'length', 'prototype', 'name', 'constructor' ].includes(name) && typeof currentClass[name] === 'function'
      )

      methodNames.forEach((methodName) => {
        Mindash[methodName] = currentClass[methodName].bind(currentClass)
      })
    })
  }
}
