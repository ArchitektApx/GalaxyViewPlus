import HtmlElementFactory   from '../../../src/userinterface/factories/HtmlElementFactory.js'
import MockHtmlElementSetup from '../mocks/MockHtmlElementSetup.js'

// Mock HTMLElement Type and document.createElement
const { createElementMock } = MockHtmlElementSetup()

describe('HtmlElementFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create an element with the given tag', () => {
    const element = HtmlElementFactory.create('div')
    expect(createElementMock).toHaveBeenCalledWith('div')
    expect(element.tagName).toBe('DIV')
  })

  it('should apply provided options to the created element', () => {
    const child1  = HtmlElementFactory.create('div')
    const options = {
      attributes     : { style: 'somestyle' },
      classList      : [ 'test-class' ],
      children       : [ child1 ],
      eventListeners : [ { eventType: 'click', callback: jest.fn() } ],
      id             : 'test-id',
    }

    const element = HtmlElementFactory.create('div', options)
    expect(element.setAttribute).toHaveBeenCalledWith('style', 'somestyle')
    expect(element.classList.add).toHaveBeenCalledWith('test-class')
    expect(element.children).toHaveLength(1)
    expect(element.id).toBe('test-id')
  })
})
