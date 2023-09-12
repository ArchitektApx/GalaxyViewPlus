/**
 * Type checking utilities.
 * @module mindash/typedash
 * @class
 */
export default class Typedash {
  /**
   * Returns the input if it's "something", otherwise returns the provided fallback value.
   * @param {*} input - Any input value.
   * @param {*} [fallback=''] - Fallback value to return if input is not "something".
   * @returns {*} - Input or fallback.
   */
  static defaultTo(input, fallback = '') {
    // if input is "something", return it, else return fallback
    return Typedash.isSomething(input)
      ? input
      : fallback
  }

  /**
   * Ensures the given input is an array.
   * @param {*} input - Any input value.
   * @returns {Array} - The input converted to an array if it wasn't already.
   */
  static forceArray(input) {
    return Array.isArray(input) ? input : [ input ]
  }

  /**
   * Checks if an object has a length of zero.
   * @param {object} obj - The object with a length property.
   * @param {number}obj.length - The length property of the object.
   * @returns {boolean} - True if the length is zero, otherwise false.
   */
  static hasZeroLength({ length }) {
    return length === 0
  }

  /**
   * Checks if the input is an array or object.
   * @param {*} input - Any input value.
   * @returns {boolean} - True if input is an array or object, otherwise false.
   */
  static isArrayOrObject(input) {
    return Array.isArray(input) || Typedash.isType(input, {})
  }

  /**
   * Checks if the input is an empty array.
   * @param {*} input - Any input value.
   * @returns {boolean} - True if input is an empty array, otherwise false.
   */
  static isEmptyArray(input) {
    return Array.isArray(input) && Typedash.hasZeroLength(input)
  }

  /**
   * Checks if the input is an empty object.
   * @param {*} input - Any input value.
   * @returns {boolean} - True if input is an empty object, otherwise false.
   */
  static isEmptyObject(input) {
    return typeof input === 'object'
      && Typedash.hasZeroLength(Object.keys(input))
      && input.constructor === Object
  }

  /**
   * Checks if the input is null, undefined, or an empty string.
   * @param {*} input - Any input value.
   * @returns {boolean} - True if input is null, undefined, or an empty string, otherwise false.
   */
  static isNullOrEmptyString(input) {
    return input == null || (typeof input === 'string' && input.trim() === '')
  }

  /**
   * Checks if the input is "something".
   * @param {*} input - Any input value.
   * @returns {boolean} - True if input is not falsy, not an empty array, and not an empty object.
   */
  static isSomething(input) {
    // not falsy, not empty array, not empty object
    // so it's at least "something"
    return !!input
      && !Typedash.isEmptyArray(input)
      && !Typedash.isEmptyObject(input)
  }

  /**
   * Checks if the input matches both of the two provided values.
   * @param {*} input - Any input value.
   * @param {*} this_ - First value to check against.
   * @param {*} that_ - Second value to check against.
   * @returns {boolean} - True if input matches both this_ and that_, otherwise false.
   */
  static isThisAndThat(input, this_, that_) {
    return input === this_ && input === that_
  }

  /**
   * Checks if the input matches either of the two provided values.
   * @param {*} input - Any input value.
   * @param {*} this_ - First value to check against.
   * @param {*} that_ - Second value to check against.
   * @returns {boolean} - True if input matches either this_ or that_, otherwise false.
   */
  static isThisOrThat(input, this_, that_) {
    return input === this_ || input === that_
  }

  /**
   * Checks if the type of the input matches either of the two provided types.
   * @param {*} input - Any input value.
   * @param {string} this_ - a object/instance of the type, [] works for arrays, {} for objects etc.
   * @param {string} that_ - a object/instance of the type, [] works for arrays, {} for objects etc.
   * @returns {boolean} - True if the type of the input matches either of the two provided types.
   */
  static isThisOrThatType(input, this_, that_) {
    return Typedash.isType(input, this_) || Typedash.isType(input, that_)
  }

  /**
   * Checks if the type of the input matches the provided type.
   * @param {*} input - Any input value.
   * @param {*} typeSample - a object/instance of the type, [] works for arrays, {} for objects etc.
   * @returns {boolean} - True if the type of the input matches the provided type.
   */
  static isType(input, typeSample) {
    // check if anything is null or undefined
    if (Typedash.isThisOrThat(input, null) || Typedash.isThisOrThat(typeSample, null)) {
      return input === typeSample
    }
    return input.constructor === typeSample.constructor
  }

  /**
   * Converts an array of keys to a dot-notation string path.
   * @public
   * @param {Array<string|number>} keys - Array of keys representing a path.
   * @returns {string} - The dot-notation path (e.g., 'a.b[0].c').
   */
  static pathFromKeys(keys) {
    let path = ''
    keys.forEach((key, index) => {
      if (typeof key === 'number') {
        path += `[${ key }]`
      } else {
        path += index ? `.${ key }` : key
      }
    })
    return path
  }

  /**
   * Converts a dot-notation string path to an array of keys.
   * @public
   * @param {string} path - The dot-notation path (e.g., 'a.b[0].c').
   * @returns {Array<string|number>} - Array of keys representing the path.
   */
  static pathToKeys(path) {
    if (typeof path !== 'string') {
      throw new TypeError('Path must be a string.')
    }

    const keys = []
    path.split('.').forEach((value) => {
      if (value.includes('[')) {
        const [ key, ...rest ] = value.split('[')
        keys.push(key, ...rest.map(k => k.replace(']', '')))
      } else {
        keys.push(value)
      }
    })
    return keys
  }

  /**
   * Prepares the input for array-based actions. Converts objects to array of their entries if specified.
   * @private
   * @param {Array | object} input - The input to be prepared.
   * @param {boolean} [spreadObject=false] - Whether to spread the object into an array of its entries.
   * @returns {Array} - The prepared input.
   */
  static prepareInput(input, spreadObject = false) {
    if (spreadObject && typeof input === 'object') {
      // return Object.entries(input).map(([ key, value ]) => ({ key, value }))
      return Object.entries(input)
    }
    return Typedash.forceArray(Typedash.defaultTo(input, []))
  }
}
