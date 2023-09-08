import BaseWrapper from './BaseWrapper.js'

export default class InputWrapper extends BaseWrapper {
  constructor(eventType, inputCallback) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(inputCallback)
  }

  buildWrapperObject(inputCallback) {
    return {
      callback: (event_) => {
        const data = BaseWrapper.extractInputData(event_.target)

        inputCallback('changeData', data)

        // update data-lastvalue attribute for next callback
        BaseWrapper.refreshLastValue(event_)
      },
      eventType: this.eventType,
    }
  }
}
