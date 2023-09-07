import TableElement        from '../../../src/userinterface/elements/TableElements.js'
import TableElementFactory from '../../../src/userinterface/factories/TableElementFactory.js'

// Mock the TableElement class
jest.mock('../../../src/userinterface/elements/TableElements.js')

describe('TableElementFactory', () => {
  // Mock document.createElement
  const mockCreateElement = jest.fn()

  global.document = {
    createElement: mockCreateElement,
  }

  const mockTableElement = {
    getElement: jest.fn(),
  }

  // Before each test, reset the mocks
  beforeEach(() => {
    jest.clearAllMocks()
    TableElement.mockImplementation(() => mockTableElement)
  })

  it.each([
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'tfoot',
  ])('should create a %s element', (type) => {
    TableElementFactory.create(type)

    expect(TableElement).toHaveBeenCalledWith(type, expect.any(Object))
    expect(mockTableElement.getElement).toHaveBeenCalled()
  })

  it('should console error on unsupported table element type', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const unsupportedType = 'unsupported'

    TableElementFactory.create(unsupportedType)

    expect(consoleErrorSpy).toHaveBeenCalledWith(`TableElement type '${ unsupportedType }' is not supported.`)
    consoleErrorSpy.mockRestore()
  })

  it('should return the element from TableElement', () => {
    const type                = 'table'
    const mockedReturnElement = {}

    mockTableElement.getElement.mockReturnValueOnce(mockedReturnElement)

    const result = TableElementFactory.create(type)

    expect(result).toBe(mockedReturnElement)
  })
})
