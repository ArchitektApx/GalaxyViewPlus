/* eslint-disable unicorn/prefer-dom-node-dataset */
import InputElement         from '../../../src/userinterface/htmlelements/InputElements.js'
import MockHtmlElementSetup from '../mocks/MockHtmlElementSetup.js'

// Mock HTMLElement Type and document.createElement
const { createElementMock } = MockHtmlElementSetup()

describe('InputElements', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create an input element with default properties', () => {
    const input = new InputElement()

    const returned = input.getElement()
    expect(createElementMock).toHaveBeenCalledWith('input')
    expect(returned.type).toBe('text')
    expect(returned.name).toBe('')
    expect(returned.value).toBe('')
  })

  it('should create an input element with provided properties', () => {
    const input = new InputElement('text', {
      name       : 'testName',
      value      : 'testValue',
      classList  : [ 'testClass' ],
      id         : 'testId',
      attributes : { title: 'testTitle' },
    })

    const returned = input.getElement()
    expect(returned.type).toBe('text')
    expect(returned.name).toBe('testName')
    expect(returned.value).toBe('testValue')
    expect(returned.classList.add).toHaveBeenCalledWith('testClass')
    expect(returned.id).toBe('testId')
    expect(returned.setAttribute).toHaveBeenCalledWith('title', 'testTitle')
  })

  it('should set checked property for checkbox type', () => {
    const input = new InputElement('checkbox', {
      checked: true,
    })

    const returned = input.getElement()
    expect(returned.type).toBe('checkbox')
    expect(returned.checked).toBe(true)
  })

  it('should set checked property for radio type', () => {
    const input = new InputElement('radio', {
      checked: true,
    })

    const returned = input.getElement()
    expect(returned.type).toBe('radio')
    expect(returned.checked).toBe(true)
  })

  it('should not set checked property for non-checkbox/radio types', () => {
    const input = new InputElement('text', {
      checked: true,
    })

    const returned = input.getElement()
    expect(returned.type).toBe('text')
    expect(returned.checked).toBeUndefined()
  })
})
