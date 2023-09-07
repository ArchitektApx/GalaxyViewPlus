export default class UsernameRecolor {
  constructor(configData) {
    this.userRecolorData = configData
  }

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
