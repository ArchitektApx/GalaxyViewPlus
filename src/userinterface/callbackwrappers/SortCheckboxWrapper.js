import BaseWrapper from './BaseWrapper.js'

export default class SortCheckboxWrapper extends BaseWrapper {
  constructor(eventType, inputCallback) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(inputCallback)
  }

  buildWrapperObject(inputCallback) {
    return {
      eventType : this.eventType,
      callback  : (event_) => {
        const data = BaseWrapper.extractInputData(event_.target)

        inputCallback('changeSorting', data)
        // update data-lastvalue attribute for next callback
        BaseWrapper.refreshLastValue(event_)
      },
    }
  }
}
