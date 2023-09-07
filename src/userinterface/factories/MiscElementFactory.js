import MiscElement from '../elements/MiscElements.js'

export default class MiscElementFactory {
  static create(type, options = {}) {
    const miscElement = new MiscElement(type, options)

    return miscElement.getElement()
  }
}
