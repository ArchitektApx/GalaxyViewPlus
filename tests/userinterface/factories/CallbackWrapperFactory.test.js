import CallbackWrapperFactory from '../../../src/userinterface/factories/CallbackWrapperFactory.js'

describe('CallbackWrapperFactory', () => {
  const mockCallback = jest.fn()

  // Helper function to mock the console.error method
  const mockConsoleError = () => {
    const originalError = console.error

    console.error = jest.fn()

    return originalError
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it.each([
    [ 'ActiveCheckBoxWrapper' ],
    [ 'AddRowButtonWrapper' ],
    [ 'InputPairWrapper' ],
    [ 'InputWrapper' ],
    [ 'RemoveRowButtonWrapper' ],
    [ 'ResetConfigWrapper' ],
    [ 'SaveConfigWrapper' ],
    [ 'SortCheckboxWrapper' ],
  ])('should create %s and return a wrapper', (type) => {
    const wrapper = CallbackWrapperFactory.create(type, mockCallback)

    // Since the 'create' method returns the result of 'getWrapper', we only need to check if a value is returned
    expect(wrapper).toBeTruthy()
  })

  it('should log an error for unsupported wrapper type', () => {
    const originalError = mockConsoleError()

    CallbackWrapperFactory.create('UnsupportedWrapper', mockCallback)

    expect(console.error).toHaveBeenCalledWith("Wrapper type 'UnsupportedWrapper' is not supported.")

    console.error = originalError
  })
})
