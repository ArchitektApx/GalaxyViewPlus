/* eslint-disable sonarjs/no-duplicate-string */
import ValueTableElement      from '../../../src/userinterface/customelements/ValueTable.js'
import ButtonElementFactory   from '../../../src/userinterface/factories/ButtonElementFactory.js'
import CallbackWrapperFactory from '../../../src/userinterface/factories/CallbackWrapperFactory.js'
import HtmlElementFactory     from '../../../src/userinterface/factories/HtmlElementFactory.js'
import InputElementFactory    from '../../../src/userinterface/factories/InputElementFactory.js'

// Mock for document.createElement
const mockElement = {}

global.document = {
  createElement: jest.fn().mockReturnValue(mockElement),
}

jest.mock('../../../src/userinterface/factories/ButtonElementFactory.js')
jest.mock('../../../src/userinterface/factories/CallbackWrapperFactory.js')
jest.mock('../../../src/userinterface/factories/InputElementFactory.js')
jest.mock('../../../src/userinterface/factories/HtmlElementFactory.js', () => ({
  create: jest.fn(() => mockElement), // Return a mock table element
}))

describe('ValueTableElement', () => {
  beforeEach(() => {
    ButtonElementFactory.create.mockClear()
    CallbackWrapperFactory.create.mockClear()
    InputElementFactory.create.mockClear()
    HtmlElementFactory.create.mockClear()
  })

  it('should create a ValueTableElement instance', () => {
    const config = {
      htmlPrefix       : 'test-prefix',
      dataType         : 'ValueTable',
      keyInputType     : 'text',
      valueInputType   : 'text',
      keyDefault       : 'defaultKey',
      valueDefault     : 'defaultValue',
      keyDisplayName   : 'Key',
      valueDisplayName : 'Value',
      data             : [ { key: 'key1', value: 'value1' } ],
    }

    const configCallback = jest.fn()
    const instance       = new ValueTableElement(config, configCallback)

    expect(instance).toBeInstanceOf(ValueTableElement)

    expect(HtmlElementFactory.create).toHaveBeenCalled()
  })

  it('should return the created element', () => {
    const config = {
      htmlPrefix       : 'test-prefix',
      dataType         : 'ValueTable',
      keyInputType     : 'text',
      valueInputType   : 'text',
      keyDefault       : 'defaultKey',
      valueDefault     : 'defaultValue',
      keyDisplayName   : 'Key',
      valueDisplayName : 'Value',
      data             : [ { key: 'key1', value: 'value1' } ],
    }

    const configCallback  = jest.fn()
    const instance        = new ValueTableElement(config, configCallback)
    const returnedElement = instance.getElement()

    expect(returnedElement).toBeDefined()
  })

  it('should add a default table row', () => {
    const config = {
      htmlPrefix       : 'test-prefix',
      dataType         : 'ValueTable',
      keyInputType     : 'text',
      valueInputType   : 'text',
      keyDefault       : 'defaultKey',
      valueDefault     : 'defaultValue',
      keyDisplayName   : 'Key',
      valueDisplayName : 'Value',
      data             : [],
    }

    const configCallback = jest.fn()
    const instance       = new ValueTableElement(config, configCallback)

    // Mock tbodyReference to capture the append call
    const mockTbody = {
      append: jest.fn(),
    }

    instance.addDefaultTableRow(mockTbody, configCallback)

    expect(mockTbody.append).toHaveBeenCalled()
  })

  it('should build a table header with default values', () => {
    const config = {
      htmlPrefix       : 'test-prefix',
      dataType         : 'ValueTable',
      keyInputType     : 'text',
      valueInputType   : 'text',
      keyDefault       : 'defaultKey',
      valueDefault     : 'defaultValue',
      keyDisplayName   : 'Key',
      valueDisplayName : 'Value',
      data             : [],
    }

    const configCallback = jest.fn()
    const instance       = new ValueTableElement(config, configCallback)

    const classList = 'test-classList'

    const headerElement = instance.buildTableHeader(classList)
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(1, 'th', {
      id          : 'test-prefixcell-key',
      textContent : 'Key',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(2, 'th', {
      id          : 'test-prefixcell-value',
      textContent : 'Value',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(3, 'th', {
      id          : 'test-prefixcell-delete',
      textContent : 'Löschen',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(4, 'tr', {
      children  : [ expect.anything(), expect.anything(), expect.anything() ],
      classList : 'valuetable-header valuetable-header-row',
      id        : 'test-prefixrow',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(5, 'thead', {
      children  : expect.anything(),
      classList : 'valuetable-header',
      id        : 'test-prefix-tableheader',
    })

    expect(instance).toBeDefined()
    expect(HtmlElementFactory.create).toHaveBeenCalledTimes(12)
  })

  it('should build a table header with provided values', () => {
    const config = {
      htmlPrefix       : 'test-prefix',
      dataType         : 'ValueTable',
      keyInputType     : 'text',
      valueInputType   : 'text',
      keyDefault       : 'defaultKey',
      valueDefault     : 'defaultValue',
      keyDisplayName   : 'Key',
      valueDisplayName : 'Value',
      data             : [],
    }

    const configCallback = jest.fn()
    const instance       = new ValueTableElement(config, configCallback)

    const classList = 'test-classList'
    const thNames   = [ 'Name1', 'Name2', 'Name3' ]
    const thIds     = [ 'id1', 'id2', 'id3' ]

    const headerElement = instance.buildTableHeader(classList, thNames, thIds)

    expect(headerElement).toBeDefined()
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(8, 'th', {
      id          : 'test-prefixcell-id1',
      textContent : 'Name1',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(9, 'th', {
      id          : 'test-prefixcell-id2',
      textContent : 'Name2',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(10, 'th', {
      id          : 'test-prefixcell-id3',
      textContent : 'Name3',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(11, 'tr', {
      children  : [ expect.anything(), expect.anything(), expect.anything() ],
      classList : 'test-classList test-classList-row',
      id        : 'test-prefixrow',
    })
    expect(HtmlElementFactory.create).toHaveBeenNthCalledWith(12, 'thead', {
      children  : expect.anything(),
      classList : 'valuetable-header',
      id        : 'test-prefix-tableheader',
    })

    expect(HtmlElementFactory.create).toHaveBeenCalledTimes(12)
  })
})
