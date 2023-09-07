import UserInterface     from '../../src/userinterface/UserInterface.js'
import SettingsInterface from '../../src/userinterface/container/SettingsInterface.js'

jest.mock('../../src/userinterface/container/SettingsInterface.js')

describe('UserInterface', () => {
  let configManagerInstance
  let mockElement

  beforeEach(() => {
    configManagerInstance = {
      getCurrentConfig: jest.fn().mockReturnValue({
        userInterface: {
          css: 'test-css',
        },
      }),
    }

    mockElement = {
      after : jest.fn(),
      style : {},
    }

    // Mocking document.querySelector
    global.document = {
      querySelector: jest.fn().mockReturnValue(mockElement),
    }

    // Mocking window.getComputedStyle
    global.window = {
      getComputedStyle: jest.fn().mockReturnValue({
        margin    : '10px',
        alignSelf : 'center',
        width     : '100px',
      }),
    }

    // Mocking GM.addStyle
    global.GM = {
      addStyle: jest.fn(),
    }

    // Mocking SettingsInterface
    const mockSettingsInterfaceInstance = {
      getElement: jest.fn().mockReturnValue(mockElement),
    }

    SettingsInterface.mockImplementation(() => mockSettingsInterfaceInstance)
  })

  it('should initialize UserInterface with correct elements and styles', () => {
    const instance = new UserInterface(configManagerInstance)

    expect(document.querySelector).toHaveBeenCalledWith('.table569')
    expect(window.getComputedStyle).toHaveBeenCalledWith(mockElement)
    expect(GM.addStyle).toHaveBeenCalledWith('test-css')
    expect(mockElement.after).toHaveBeenCalledWith(mockElement)
  })

  it('should clone width and styles from reference element', () => {
    const instance = new UserInterface(configManagerInstance)

    expect(mockElement.style.margin).toBe('10px')
    expect(mockElement.style.alignSelf).toBe('center')
    expect(mockElement.style.width).toBe('100px')
  })
})
