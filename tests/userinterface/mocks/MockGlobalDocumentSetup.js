global.document = {
  createElement: jest.fn().mockReturnValue({
    appendChild : jest.fn(),
    classList   : {
      add: jest.fn(),
    },
    append: jest.fn(),
  }),
}
