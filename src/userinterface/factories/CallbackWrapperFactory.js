import ActiveCheckBoxWrapper  from '../callbackwrappers/ActiveCheckBoxWrapper.js'
import AddRowButtonWrapper    from '../callbackwrappers/AddRowButtonWrapper.js'
import InputPairWrapper       from '../callbackwrappers/InputPairWrapper.js'
import InputWrapper           from '../callbackwrappers/InputWrapper.js'
import RemoveRowButtonWrapper from '../callbackwrappers/RemoveRowButtonWrapper.js'
import ResetConfigWrapper     from '../callbackwrappers/ResetConfigWrapper.js'
import SaveConfigWrapper      from '../callbackwrappers/SaveConfigWrapper.js'
import SortCheckboxWrapper    from '../callbackwrappers/SortCheckboxWrapper.js'

const wrapperClasses = {
  ActiveCheckBoxWrapper  : { class: ActiveCheckBoxWrapper,  event: 'click'  },
  AddRowButtonWrapper    : { class: AddRowButtonWrapper,    event: 'click'  },
  InputPairWrapper       : { class: InputPairWrapper,       event: 'change' },
  InputWrapper           : { class: InputWrapper,           event: 'change' },
  RemoveRowButtonWrapper : { class: RemoveRowButtonWrapper, event: 'click'  },
  ResetConfigWrapper     : { class: ResetConfigWrapper,     event: 'click'  },
  SaveConfigWrapper      : { class: SaveConfigWrapper,      event: 'click'  },
  SortCheckboxWrapper    : { class: SortCheckboxWrapper,    event: 'click'  },
}

export default class CallbackWrapperFactory {
  static create(type, inputCallback) {
    const wrapperConfig = wrapperClasses[type]

    if (wrapperConfig) {
      const { class: WrapperClass, event } = wrapperConfig

      return (new WrapperClass(event, inputCallback)).getWrapper()
    }

    console.error(`Wrapper type '${ type }' is not supported.`)
  }
}
