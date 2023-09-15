import './MockGlobalDocumentSetup.js'

// Mock the factories directly
jest.mock('../../../src/userinterface/factories/ButtonElementFactory.js', () => ({
  create: jest.fn().mockReturnValue({
    appendChild : jest.fn(),
    classList   : {
      add: jest.fn(),
    },
    append: jest.fn(),
  }),
}))
jest.mock('../../../src/userinterface/factories/CallbackWrapperFactory.js', () => ({
  create: jest.fn().mockReturnValue({
    appendChild : jest.fn(),
    classList   : {
      add: jest.fn(),
    },
    append: jest.fn(),
  }),
}))
jest.mock('../../../src/userinterface/factories/InputElementFactory.js', () => ({
  create: jest.fn().mockReturnValue({
    appendChild : jest.fn(),
    classList   : {
      add: jest.fn(),
    },
    append: jest.fn(),
  }),
}))
jest.mock('../../../src/userinterface/factories/FeatureSettingsFactory.js', () => ({
  create: jest.fn().mockReturnValue({
    appendChild : jest.fn(),
    classList   : {
      add: jest.fn(),
    },
    append: jest.fn(),
  }),
}))
jest.mock('../../../src/userinterface/factories/HtmlElementFactory.js', () => ({
  create: jest.fn().mockReturnValue({
    appendChild : jest.fn(),
    classList   : {
      add: jest.fn(),
    },
    append : jest.fn(),
    after  : jest.fn(),
  }),
}))
jest.mock('../../../src/userinterface/factories/DataTypeFactory.js')

// Export the mocked factories
export { default as ButtonElementFactory } from '../../../src/userinterface/factories/ButtonElementFactory.js'
export { default as CallbackWrapperFactory } from '../../../src/userinterface/factories/CallbackWrapperFactory.js'
export { default as InputElementFactory } from '../../../src/userinterface/factories/InputElementFactory.js'
export { default as DataTypeFactory } from '../../../src/userinterface/factories/DataTypeFactory.js'
export { default as FeatureSettingsFactory } from '../../../src/userinterface/factories/FeatureSettingsFactory.js'
export { default as HtmlElementFactory } from '../../../src/userinterface/factories/HtmlElementFactory.js'
