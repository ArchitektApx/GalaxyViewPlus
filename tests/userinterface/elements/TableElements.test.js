/* eslint-disable no-new */
import Element      from '../../../src/userinterface/elements/BaseElement.js'
import TableElement from '../../../src/userinterface/elements/TableElements.js'

describe('TableElement', () => {
  let mockElement

  class MockElement extends Element { // Mock of your custom Element class
    constructor() {
      super()
      this.element = {}
    }

    getElement() {
      return this.element
    }
  }

  global.HTMLElement = jest.fn()

  beforeEach(() => {
    mockElement = {
      append       : jest.fn(),
      setAttribute : jest.fn(),
    }

    global.document = {
      createElement: jest.fn().mockReturnValue(mockElement),
    }
  })

  it('should create an element with the specified tag', () => {
    new TableElement('table')
    expect(document.createElement).toHaveBeenCalledWith('table')
  })

  it('should set textContent if provided', () => {
    const element = new TableElement('div', { textContent: 'Hello' })

    expect(element.textContent).toBe('Hello')
  })

  it('should append multiple children if provided in an array', () => {
    const children = [ new MockElement(), new MockElement() ] // Using the mock version of Element

    new TableElement('tr', { children: children })
    expect(mockElement.append).toHaveBeenCalledTimes(2)
    expect(mockElement.append).toHaveBeenCalledWith(children[0].getElement())
    expect(mockElement.append).toHaveBeenCalledWith(children[1].getElement())
  })

  it('should convert single child to array and append', () => {
    const singleChild = new MockElement() // Using the mock version of Element

    new TableElement('tr', { children: singleChild })
    expect(mockElement.append).toHaveBeenCalledTimes(1)
    expect(mockElement.append).toHaveBeenCalledWith(singleChild.getElement())
  })
})
