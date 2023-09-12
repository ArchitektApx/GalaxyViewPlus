import SettingsInterface from './container/SettingsInterface.js'

/**
 * The UserInterface class is used to display the settings interface.
 * @class
 */
export default class UserInterface {
  /**
   * Creates a new UserInterface instance.
   * @param   {configManagerInstance} configManagerInstance - The config manager instance
   * @returns {UserInterface} - The UserInterface instance
   * @class
   */
  constructor(configManagerInstance) {
    this.SettingsInterface = (new SettingsInterface(configManagerInstance)).getElement()
    this.galaxyTable       = document.querySelector('.table569')
    this.SettingsInterface = UserInterface.#cloneWidth(this.SettingsInterface, this.galaxyTable)
    UserInterface.#attachCSS(configManagerInstance.getCurrentConfig().userInterface.css)

    this.galaxyTable.after(this.SettingsInterface)
  }

  /**
   * Attaches the given css to the page.
   * @param   {string} css - The css to attach
   * @returns {void}
   * @private
   * @static
   */
  static #attachCSS(css) {
    GM.addStyle(css)
  }

  /**
   * Clones the width of the given reference element to the given element.
   * @param   {object} element   - The element to clone the width to
   * @param   {object} reference - The reference element
   * @returns {object}           - The element with the cloned width
   * @private
   * @static
   */
  static #cloneWidth(element, reference) {
    const referenceStyle = window.getComputedStyle(reference)
    const returnElement  = element

    returnElement.style.margin    = referenceStyle.margin
    returnElement.style.alignSelf = referenceStyle.alignSelf
    returnElement.style.width     = referenceStyle.width

    return returnElement
  }
}
