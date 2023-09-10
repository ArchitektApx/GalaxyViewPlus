/* eslint-disable sort-class-members/sort-class-members */
import Arraydash  from './arraydash/Arraydash.js'
import Objectdash from './objectdash/Objectdash.js'
import Typedash   from './typedash/Typedash.js'

export default class Mindash {
  // most likely the cringiest name i could come up with
  // provids a bunch of static methods that are useful in many places
  // and that i don't want to write over and over again
  // also the "loading" of methods in here begs for a refactor

  // Arraydash
  static arrayAction(action, input, callback, spreadObject) {
    return Arraydash.arrayAction(action, input, callback, spreadObject)
  }

  static filterAny(input, callback, spreadObject) {
    return Arraydash.filterAny(input, callback, spreadObject)
  }

  static forAny(input, callback, spreadObject) {
    return Arraydash.forAny(input, callback, spreadObject)
  }

  static mapAny(input, callback, spreadObject) {
    return Arraydash.mapAny(input, callback, spreadObject)
  }

  // Objectdash
  static deepClone(input) {
    return Objectdash.deepClone(input)
  }

  static getNestedValueOrDefault(object, path, defaultValue) {
    return Objectdash.getNestedValueOrDefault(object, path, defaultValue)
  }

  static mergeObjects(object1, object2) {
    return Objectdash.mergeObjects(object1, object2)
  }

  static setNestedValue(object, path, value) {
    return Objectdash.setNestedValue(object, path, value)
  }

  // Typedash
  static defaultTo(input, fallback) {
    return Typedash.defaultTo(input, fallback)
  }

  static forceArray(input) {
    return Typedash.forceArray(input)
  }

  static hasZeroLength({ length }) {
    return Typedash.hasZeroLength({ length })
  }

  static isEmptyArray(input) {
    return Typedash.isEmptyArray(input)
  }

  static isEmptyObject(input) {
    return Typedash.isEmptyObject(input)
  }

  static isNullOrEmptyString(input) {
    return Typedash.isNullOrEmptyString(input)
  }

  static isSomething(input) {
    return Typedash.isSomething(input)
  }

  static isThisOrThat(input, this_, that_) {
    return Typedash.isThisOrThat(input, this_, that_)
  }

  static isType(input, type) {
    return Typedash.isType(input, type)
  }

  static pathFromKeys(keys) {
    return Typedash.pathFromKeys(keys)
  }

  static pathToKeys(path) {
    return Typedash.pathToKeys(path)
  }

  static prepareInput(input, spreadObject) {
    return Typedash.prepareInput(input, spreadObject)
  }
}
