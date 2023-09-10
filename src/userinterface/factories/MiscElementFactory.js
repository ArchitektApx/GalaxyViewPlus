import MiscElement from '../elements/MiscElements.js'

/**
 * The MiscElementFactory class is used to create misc elements.
 * @class
 */
export default class MiscElementFactory {
  /**
   * Creates a new MiscElementFactory instance.
   * @param {string} type - The type of the misc element
   * @param {object} options - The options of the misc element
   * @returns {MiscElement|undefined} - The MiscElement generated
   */
  static create(type, options = {}) {
    const miscElement = new MiscElement(type, options)
    return miscElement.getElement()
  }
}
