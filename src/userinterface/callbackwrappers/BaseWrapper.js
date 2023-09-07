export default class BaseWrapper {
  constructor(eventType) {
    this.eventType     = eventType
    this.wrapperObject = undefined // This will be assigned in derived classes
  }

  // public methods
  getWrapper() {
    return this.wrapperObject
  }

  // static methods
  static extractInputData({
    checked, className,
    dataset = {},
    id, name, type, value: valueIn,
  }) {
    const { lastvalue: lastvalueIn } = dataset
    // extract callBackData from a given input
    const value     = type === 'number' ? Number.parseInt(valueIn, 10) : valueIn
    const lastvalue = type === 'number' ? Number.parseInt(lastvalueIn, 10) : lastvalueIn

    return { checked, className, id, lastvalue, name, type, value }
  }

  static extractInputPairData(event_) {
    const row       = BaseWrapper.extractParentRowFromCellEvent(event_)
    const inputPair = BaseWrapper.extractInputPairFromRow(row)

    return inputPair.map(input => BaseWrapper.extractInputData(input))
  }

  static extractInputPairFromRow(
    { children: [ { firstChild: keyInput }, { firstChild: valueInput } ] }
  ) {
    // extract both input elements of a given row
    return [ keyInput, valueInput ]
  }

  static extractParentRowFromCellEvent({ target: { parentElement: { parentElement: row } } }) {
    // extract the parent row from a cell click event
    return row
  }

  static refreshLastValue({ target }) {
    if (target && target.dataset) {
      target.dataset.lastvalue = target.type === 'checkbox' || target.type === 'radio' ? target.checked : target.value
    }
  }
}
