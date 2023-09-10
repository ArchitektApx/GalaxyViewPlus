import Mindash from '../../mindash/Mindash.js'

export default class Element {
  constructor(id = '', classList = [], attributes = {}) {
    this.id         = id
    this.classList  = classList
    this.attributes = attributes
    this.element    = undefined // This will be assigned in derived classes
  }

  // public methods
  addClass(className) {
    this.element.classList.add(className)
  }

  addEventListener(eventType, callback) {
    this.element.addEventListener(eventType, callback)
  }

  after(childElement) {
    this.#attachElement(childElement, 'after')
  }

  append(childElement) {
    this.#attachElement(childElement, 'append')
  }

  getElement() {
    // set id if it is not empty
    if (this.id !== '') {
      this.element.id = this.id
    }

    // not falsy or empty object/array
    if (Mindash.isSomething(this.classList)) {
      this.#addClasses(this.classList)
    }

    if (!Mindash.isEmptyObject(this.attributes)) {
      this.#setAttributes()
    }

    // set textContent if it exists and is not empty
    if (this?.textContent) {
      this.setTextContent(this.textContent)
    }

    // output the final "real" html object
    return this.element
  }

  setAttribute(attribute, value) {
    this.element.setAttribute(attribute, value)
  }

  setTextContent(textContent) {
    if (this.element.children.length === 0) {
      this.element.textContent = textContent
    }
  }

  // private methods
  #addClasses(classList) {
    if (Array.isArray(classList)) {
      classList.forEach(className => this.addClass(className))
    }

    if (typeof classList === 'string' && classList.trim() !== '') {
      classList.trim().split(' ').forEach(className => this.addClass(className))
    }
  }

  #attachElement(childElement, method) {
    if (!(childElement instanceof Element || childElement instanceof HTMLElement)) {
      console.error(`${ method } expects an instance of Element`)
      return
    }

    if (childElement instanceof Element) {
      this.element[method](childElement.getElement())
    }

    if (childElement instanceof HTMLElement) {
      this.element[method](childElement)
    }
  }

  #setAttributes() {
    Mindash.forAny(this.attributes, ([ attribute, value ]) => {
      this.element.setAttribute(attribute, value)
    }, true)
  }
}
