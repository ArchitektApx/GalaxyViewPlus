/**
 * InactiveRecolor - recolors inactive and long inactive elements
 * @class
 * @param {Array} colors - The colors to use
 * @returns {InactiveRecolor} - The InactiveRecolor instance
 */
export default class InactiveRecolor {
  static inactiveSelector = '.galaxy-short-inactive,.galaxy-short-longinactive'

  /**
   * Creates a new InactiveRecolor instance.
   * @param {Array} colors - The colors to use
   * @param {string} colors."0" - The color for inactive elements
   * @param {string} colors."1" - The color for long inactive elements
   * @returns {InactiveRecolor} - The InactiveRecolor instance
   * @class
   */
  constructor([ { value: inactive }, { value: longinactive } ]) {
    this.inactiveColor     = inactive
    this.longInactiveColor = longinactive
  }

  /**
   * Executes the command.
   * @param {HTMLElement} currentElement - The current element
   * @returns {void}
   */
  execute(currentElement) {
    const inactiveElements = (
      currentElement.nextElementSibling?.tagName === 'A'
      && currentElement.nextElementSibling.firstChild?.tagName === 'I')
      ? currentElement.parentNode.querySelectorAll(InactiveRecolor.inactiveSelector)
      : currentElement.querySelectorAll(InactiveRecolor.inactiveSelector)

    if (!inactiveElements) {
      return
    }

    inactiveElements.forEach((element) => {
      element.style.color = inactiveElements?.length === 1
        ? this.inactiveColor
        : this.longInactiveColor

      element.style.fontWeight = 'bold'
    })
  }
}
