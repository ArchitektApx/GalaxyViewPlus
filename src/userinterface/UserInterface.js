import SettingsInterface from './container/SettingsInterface.js'

export default class UserInterface {
  constructor(configManagerInstance) {
    this.SettingsInterface = (new SettingsInterface(configManagerInstance)).getElement()

    this.galaxyTable = document.querySelector('.table569')

    this.SettingsInterface = UserInterface.#cloneWidth(this.SettingsInterface, this.galaxyTable)
    UserInterface.#attachCSS(configManagerInstance.getCurrentConfig().userInterface.css)

    this.galaxyTable.after(this.SettingsInterface)
  }

  static #attachCSS(css) {
    GM.addStyle(css)
  }

  static #cloneWidth(element, reference) {
    const referenceStyle = window.getComputedStyle(reference)
    const returnElement  = element

    returnElement.style.margin    = referenceStyle.margin
    returnElement.style.alignSelf = referenceStyle.alignSelf
    returnElement.style.width     = referenceStyle.width

    return returnElement
  }
}
