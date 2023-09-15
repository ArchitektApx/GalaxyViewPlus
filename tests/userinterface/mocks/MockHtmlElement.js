export default class MockHTMLElement {
  constructor(tagName) {
    // html tag
    this.tagName = tagName.toUpperCase()

    // basic methods
    this.classList        = {
      add: jest.fn(),
    }
    this.addEventListener = jest.fn()
    this.setAttribute     = jest.fn()
    this.after            = jest.fn()
    this.append           = jest.fn(child => this.children.push(child))
    this.children         = []
  }
}
