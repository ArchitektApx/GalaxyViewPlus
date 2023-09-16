import validHtmlColorStrings from './validhtmlcolors.js'
/**
 * Cleandash provides utility methods for checking and cleaning
 * untrusted data and and inputs.
 * @class
 */
export default class Cleandash {
  /**
   * escapes a string for html
   * @param   {string} string - The string to escape
   * @returns {string}        - The escaped string
   * @public
   * @static
   */
  static escapeString(string) {
    const map = {
      '"' : '&quot;',
      '&' : '&amp;',
      "'" : '&#x27;',
      '/' : '&#x2F;',
      '<' : '&lt;',
      '>' : '&gt;',
    }

    const reg = /["&'/<>]/g

    return string.replaceAll(reg, match => map[match])
  }

  /**
   * takes a string or a array of strings and returns them sanitized
   * @param   {string|Array} strings - The string or array of strings to sanitize
   * @returns {string|Array}         - The sanitized string or array of strings
   * @public
   * @static
   */
  static sanitizeStrings(strings) {
    return Array.isArray(strings)
      ? strings.map(string => Cleandash.escapeString(string))
      : Cleandash.escapeString(strings)
  }

  /**
   * validates a color input
   * @param   {string}  color - The (hex) color to validate
   * @param   {boolean} strict - If true (default) only hex colors are valid,
   * if false html color names are also valid
   * @returns {boolean}       - True if the color is valid
   * @public
   * @static
   */
  static validateColorInput(color, strict = true) {
    const colorRegex = /^#[\dA-Fa-f]{6}$/

    return strict
      ? colorRegex.test(color)
      : validHtmlColorStrings.includes(color.toLowerCase()) || colorRegex.test(color)
  }

  /**
   * validates a the value from an input matches a number
   * @param   {string}  number - The number to validate
   * @returns {boolean}        - True if the number is valid
   * @public
   * @static
   */
  static validateNumberInput(number) {
    const numberRegex = /^\d*$/

    return numberRegex.test(number)
  }

  /**
   * validates a the value from an input matches a string
   * @param   {string}  string - The string to validate
   * @returns {boolean}        - True if the string is valid
   * @public
   * @static
   */
  static validateStringInput(string) {
    const stringRegex = /^[\p{L}\p{N}_\-. ]*$/u

    return stringRegex.test(string)
  }
}
