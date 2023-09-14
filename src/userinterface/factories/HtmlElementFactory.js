import BaseElement from '../htmlelements/BaseElement.js'

/**
 * The HtmlElementFactory class is used to create default html elements.
 * @class
 */
export default class HtmlElementFactory {
  /**
   * Creates a new HtmlElementFactory instance.
   * @param   {string}  tag                    - The tag that should be created (e.g. div, table, etc.)
   * @param   {object}  options                - object containing the options for the element so we can use destructuring
   * @param   {object}  options.attributes     - The attributes of the element
   * @param   {Array}   options.classList      - The classList of the element
   * @param   {Array}   options.children       - The array of child elements to add to the element
   * @param   {string}  options.color          - The color property of the element
   * @param   {object}  options.eventListeners - The eventListeners in the form of an object { <eventType>, <callback> }
   * @param   {string}  options.id             - The id of the html element
   * @param   {string}  options.textContent    - The textContent of the element
   * @returns {HTMLElement|undefined}          - The MiscElement generated
   * @public
   * @static
   */
  static create(tag, options = {}) {
    const htmlElement = new BaseElement(tag, options)
    return htmlElement.getElement()
  }
}
