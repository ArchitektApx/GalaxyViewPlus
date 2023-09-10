/**
 * UsernameRecolor feature - recolors the username of a user.
 * @class
 */
export default class UsernameRecolor {
  /**
   * Creates a new UsernameRecolor instance.
   * @param {Array} configData - The config data for the feature
   * @returns {UsernameRecolor} - The UsernameRecolor instance
   */
  constructor(configData) {
    this.userRecolorData = configData
  }

  /**
   * Executes the feature.
   * @param {HTMLElement} currentElement - The element to execute the feature on
   * @returns {void}
   */
  execute(currentElement) {
    if (currentElement.children.length === 0) { return }

    const userElement      = currentElement.children[0]
    const userName         = userElement.textContent.trim()
    const matchingNameData = this.userRecolorData.find(data => data.key === userName)

    if (matchingNameData) {
      userElement.style.color = matchingNameData.value
    }
  }
}
