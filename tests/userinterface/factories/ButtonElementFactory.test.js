import ButtonElement        from '../../../src/userinterface/elements/ButtonElements.js'
import ButtonElementFactory from '../../../src/userinterface/factories/ButtonElementFactory.js'

jest.mock('../../../src/userinterface/elements/ButtonElements.js', () => {
  const capturedArguments = {
    value: null,
  }

  const MockButtonElement = function (options = {}) {
    capturedArguments.value = options

    return {
      getElement: jest.fn().mockReturnValue({
        dummy       : 'element',
        classList   : { add: jest.fn() },
        textContent : options.textContent || '',
      }),
    }
  }

  MockButtonElement.capturedArgs = capturedArguments

  return MockButtonElement
})

describe('ButtonElementFactory', () => {
  let mockButtonElementInstance

  global.document = {
    createElement: jest.fn().mockReturnValue({
      dummy     : 'element',
      classList : {
        add: jest.fn(),
      },
      textContent: '',
    }),
  }

  beforeEach(() => {
    mockButtonElementInstance = new ButtonElement()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should create an "addRow" button with defaults', () => {
    const button = ButtonElementFactory.create('addRow')

    expect(button).toEqual({
      dummy       : 'element',
      textContent : 'Hinzufügen',
      classList   : { add: expect.any(Function) },  // Expect any function here
    })
  })

  it('should create a generic "button" without any defaults', () => {
    const button = ButtonElementFactory.create('button')

    expect(button).toEqual({
      dummy       : 'element',
      textContent : '',
      classList   : { add: expect.any(Function) },  // Expect any function here
    })
  })

  it('should create a "removeRow" button with defaults', () => {
    const button = ButtonElementFactory.create('removeRow')

    expect(button).toEqual({
      dummy       : 'element',
      textContent : 'Löschen',
      classList   : { add: expect.any(Function) },
    })
  })

  it('should create a "reset" button with defaults', () => {
    const button = ButtonElementFactory.create('reset')

    expect(button).toEqual({
      dummy       : 'element',
      textContent : 'Zurücksetzen',
      classList   : { add: expect.any(Function) },
    })
  })

  it('should create a "save" button with defaults', () => {
    const button = ButtonElementFactory.create('save')

    expect(button).toEqual({
      dummy       : 'element',
      textContent : 'Speichern',
      classList   : { add: expect.any(Function) },
    })
  })

  it('should console.error if unsupported button type is provided', () => {
    console.error = jest.fn()
    ButtonElementFactory.create('unsupportedType')
    expect(console.error).toHaveBeenCalledWith("Button type 'unsupportedType' is not supported.")
  })
})
