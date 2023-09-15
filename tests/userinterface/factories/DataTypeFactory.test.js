import '../mocks/MockValueElementsSetup.js'
import DataTypeFactory from '../../../src/userinterface/factories/DataTypeFactory.js'

describe('DataTypeFactory', () => {
  const mockConfig         = { dataType: '' }
  const mockConfigCallback = jest.fn()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each([
    [ 'ValueTable', 'mockedValueTableElement' ],
    [ 'ValueList', 'mockedValueListElement' ],
  ])('should create %s and return a mocked element', (dataType, expectedElement) => {
    mockConfig.dataType = dataType

    const element = DataTypeFactory.create(mockConfig, mockConfigCallback)

    expect(element).toBe(expectedElement)
  })

  it('should log an error for unsupported data type', () => {
    const originalConsoleError = console.error

    console.error = jest.fn()

    mockConfig.dataType = 'UnsupportedType'
    DataTypeFactory.create(mockConfig, mockConfigCallback)

    expect(console.error).toHaveBeenCalledWith("DataType 'UnsupportedType' is not supported.")

    console.error = originalConsoleError
  })
})
