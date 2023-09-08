import BaseWrapper from './BaseWrapper.js'

export default class SaveConfigWrapper extends BaseWrapper {
  constructor(eventType, inputCallback) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(inputCallback)
  }

  buildWrapperObject(inputCallback) {
    return {
      callback: (event_) => {
        const data = BaseWrapper.extractInputData(event_.target)

        inputCallback('saveConfig', data)
      },
      eventType: this.eventType,
    }
  }
}
