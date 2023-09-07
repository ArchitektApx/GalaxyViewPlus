import BaseWrapper from './BaseWrapper.js'

export default class RemoveRowButtonWrapper extends BaseWrapper {
  constructor(eventType, inputCallback) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(inputCallback)
  }

  buildWrapperObject(inputCallback) {
    return {
      eventType : this.eventType,
      callback  : (event_) => {
        const row  = BaseWrapper.extractParentRowFromCellEvent(event_)
        const data = BaseWrapper.extractInputPairData(event_)

        inputCallback('removeRow', data)
        row.remove()
      },
    }
  }
}
