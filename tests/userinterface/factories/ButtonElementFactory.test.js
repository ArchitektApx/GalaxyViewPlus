import ButtonElementFactory from '../../../src/userinterface/factories/ButtonElementFactory.js'
import MockHtmlElementSetup from '../mocks/MockHtmlElementSetup.js'

// Mock HTMLElement Type and document.createElement
MockHtmlElementSetup()

describe('ButtonElementFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create an addRow button with default properties', () => {
    const button = ButtonElementFactory.create('addRow')
    expect(button.classList.add).toHaveBeenCalledWith('add-row-btn')
    expect(button.textContent).toBe('Add')
  })

  it('should create a removeRow button with default properties', () => {
    const button = ButtonElementFactory.create('removeRow')
    expect(button.classList.add).toHaveBeenCalledWith('remove-row-btn')
    expect(button.textContent).toBe('Delete')
  })

  it('should create a reset button with default properties', () => {
    const button = ButtonElementFactory.create('reset')
    expect(button.classList.add).toHaveBeenCalledWith('reset-config-btn')
    expect(button.textContent).toBe('Reset')
  })

  it('should create a save button with default properties', () => {
    const button = ButtonElementFactory.create('save')
    expect(button.classList.add).toHaveBeenCalledWith('save-config-btn')
    expect(button.textContent).toBe('Save')
  })

  it('should create a button with overridden properties', () => {
    const button = ButtonElementFactory.create('addRow', { textContent: 'Override' })
    expect(button.classList.add).toHaveBeenCalledWith('add-row-btn')
    expect(button.textContent).toBe('Override')
  })

  it('should log an error for unsupported button type', () => {
    console.error = jest.fn() // Mock console.error to suppress expected error messages
    const button  = ButtonElementFactory.create('unsupportedType')
    expect(console.error).toHaveBeenCalledWith("Button type 'unsupportedType' is not supported.")
    expect(button).toBeUndefined()
  })
})
