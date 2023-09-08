import BaseWrapper from './BaseWrapper.js'

export default class InputPairWrapper extends BaseWrapper {
  constructor(eventType, inputCallback) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(inputCallback)
  }

  buildWrapperObject(inputCallback) {
    return {
      callback: (event_) => {
        const data = BaseWrapper.extractInputPairData(event_)

        inputCallback('changeData', data)
        // update data-lastvalue attribute for next callback
        BaseWrapper.refreshLastValue(event_)
      },
      eventType: this.eventType,
    }
  }
}
