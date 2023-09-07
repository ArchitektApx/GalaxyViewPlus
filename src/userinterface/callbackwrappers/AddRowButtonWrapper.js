import BaseWrapper from './BaseWrapper.js'

export default class AddRowButtonWrapper extends BaseWrapper {
  // here input callback is not for config but the add row function of the ValueTable Element
  constructor(eventType, { addRow: addRowFunction, delButton: configCallback }) {
    super(eventType)
    this.wrapperObject = this.buildWrapperObject(addRowFunction, configCallback)
  }

  buildWrapperObject(addRowFunction, configCallback) {
    return {
      eventType : this.eventType,
      callback  : (event_) => {
        const { target: { parentElement: { children: [ , tbody ] } } } = event_

        addRowFunction(tbody, configCallback)
      },
    }
  }
}
