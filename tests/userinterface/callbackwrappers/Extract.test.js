import Extract from '../../../src/userinterface/callbackwrappers/Extract.js'

describe('Extract class', () => {
  let target

  beforeEach(() => {
    target = {
      parentElement: {
        children      : [ { firstChild: {} }, { firstChild: {} } ],
        parentElement : {},
      },
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('extractInputData method', () => {
    const data = Extract.extractInputData(target)
    expect(data).toHaveProperty('checked')
    expect(data).toHaveProperty('className')
    expect(data).toHaveProperty('id')
    expect(data).toHaveProperty('lastvalue')
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('type')
    expect(data).toHaveProperty('value')
  })

  it('extractInputPairData method', () => {
    const data = Extract.extractInputPairData(target.parentElement)
    expect(data).toHaveLength(2)
  })

  it('extractParentRow method', () => {
    const row = Extract.extractParentRow(target)
    expect(row).toBe(target.parentElement.parentElement)
  })

  it('extractTableBody method', () => {
    const tbody = Extract.extractTableBody(target)
    expect(tbody).toBe(target.parentElement.children[1])
  })

  it('extractInputData method - number type', () => {
    target.type  = 'number'
    target.value = '5'
    const data   = Extract.extractInputData(target)
    expect(data.value).toBe(5)
  })

  it('extractInputPairData method - no children', () => {
    const row             = { children: [] }
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    const result          = Extract.extractInputPairData(row)
    expect(result).toBeUndefined()
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: The row does not have the expected number of children.')
    consoleErrorSpy.mockRestore()
  })

  it('extractTableBody method - no children', () => {
    target.parentElement.children = []
    const tbody                   = Extract.extractTableBody(target)
    expect(tbody).toBeUndefined()
  })
})
