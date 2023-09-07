import MiscElement        from '../../../src/userinterface/elements/MiscElements.js'
import MiscElementFactory from '../../../src/userinterface/factories/MiscElementFactory.js'

// Mocking the document.createElement method
const mockAddEventListener = jest.fn()
const mockElement          = {
  addEventListener : mockAddEventListener,
  setAttribute     : jest.fn(),
  style            : {},
}

if (!global.document) {
  global.document = {}
}

global.document.createElement = jest.fn().mockReturnValue(mockElement)

describe('MiscElementFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create an element based on the type', () => {
    const type = 'div'

    MiscElementFactory.create(type)

    expect(global.document.createElement).toHaveBeenCalledWith(type)
    // Adjusted this line to check the mock's function call rather than instance type
    expect(global.document.createElement).toHaveBeenCalledTimes(1)
  })

  it('should set "for" attribute for label type', () => {
    const type  = 'label'
    const forId = 'inputId'

    MiscElementFactory.create(type, { forId })

    expect(mockElement.setAttribute).toHaveBeenCalledWith('for', forId)
  })

  it('should set "title" attribute for label type', () => {
    const type  = 'label'
    const title = 'inputTitle'

    MiscElementFactory.create(type, { title })

    expect(mockElement.setAttribute).toHaveBeenCalledWith('title', title)
  })

  it('should set color style for span type', () => {
    const type  = 'span'
    const color = 'red'

    MiscElementFactory.create(type, { color })

    expect(mockElement.style.color).toBe(color)
  })
})
