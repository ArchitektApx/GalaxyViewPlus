export default class InactiveRecolor {
  static inactiveSelector = '.galaxy-short-inactive,.galaxy-short-longinactive'
  constructor([ { value: inactive }, { value: longinactive } ]) {
    this.inactiveColor     = inactive
    this.longInactiveColor = longinactive
  }

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
