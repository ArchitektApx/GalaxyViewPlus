import DataTypeFactory from '../../../src/userinterface/factories/DataTypeFactory.js'

// Mocking the ValueTableElement and ValueListElement classes
jest.mock('../../../src/userinterface/customelements/ValueTable.js', () => jest.fn().mockImplementation(() => ({ getElement: jest.fn(() => 'mockedValueTableElement') })))

jest.mock('../../../src/userinterface/customelements/ValueLists.js', () => jest.fn().mockImplementation(() => ({ getElement: jest.fn(() => 'mockedValueListElement') })))

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
