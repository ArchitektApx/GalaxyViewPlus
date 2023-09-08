import BaseWrapper from './BaseWrapper.js'

export default class ResetConfigWrapper extends BaseWrapper {
  constructor(eventType, inputCallback) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(inputCallback)
  }

  buildWrapperObject(inputCallback) {
    return {
      callback: (event_) => {
        const data = BaseWrapper.extractInputData(event_.target)

        inputCallback('resetConfig', data)
      },
      eventType: this.eventType,
    }
  }
}
