import BaseWrapper from './BaseWrapper.js'

export default class ActiveCheckBoxWrapper extends BaseWrapper {
  constructor(eventType, inputCallback) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(inputCallback)
  }

  buildWrapperObject(inputCallback) {
    return {
      eventType : this.eventType,
      callback  : (event_) => {
        const data = BaseWrapper.extractInputData(event_.target)

        inputCallback('changeStatus', data)

        // update data-lastvalue attribute for next callback
        BaseWrapper.refreshLastValue(event_)

        // find related SettingsBody
        const { target: { parentElement: { nextSibling: body } = event_ } } = event_

        if (body && body.classList) {
          data.checked === true
            ? body.classList.remove('hidden')
            : body.classList.add('hidden')
        }
      },
    }
  }
}
