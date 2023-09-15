const event_ = {
  target: {
    checked       : true,
    parentElement : {
      children      : [ { firstChild: {} }, { firstChild: {} }, { firstChild: {} } ],
      parentElement : {},
      nextSibling   : {
        classList: {
          add    : jest.fn(),
          remove : jest.fn(),
        },
      },
    },
    dataset: {
      lastvalue: 'test old',
    },
    type  : 'text',
    value : 'test',
  },
}

export default event_
