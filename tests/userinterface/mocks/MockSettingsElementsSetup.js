import './MockGlobalDocumentSetup.js'
import HtmlElementFactory from '../../../src/userinterface/factories/HtmlElementFactory.js'
import SettingsBody       from '../../../src/userinterface/customelements/SettingsBody.js'
import SettingsHeader     from '../../../src/userinterface/customelements/SettingsHeader.js'

jest.mock('../../../src/userinterface/customelements/SettingsBody.js')
jest.mock('../../../src/userinterface/customelements/SettingsHeader.js')
jest.mock('../../../src/userinterface/factories/HtmlElementFactory.js')

HtmlElementFactory.create           = jest.fn().mockReturnValue({
  appendChild : jest.fn(),
  classList   : {
    add: jest.fn(),
  },
  append: jest.fn(),
})
SettingsBody.prototype.getElement   = jest.fn().mockReturnValue({
  appendChild : jest.fn(),
  classList   : {
    add: jest.fn(),
  },
  append: jest.fn(),
})
SettingsHeader.prototype.getElement = jest.fn().mockReturnValue({
  appendChild : jest.fn(),
  classList   : {
    add: jest.fn(),
  },
  append: jest.fn(),
})

export { default as HtmlElementFactory } from '../../../src/userinterface/factories/HtmlElementFactory.js'
export { default as SettingsBody } from '../../../src/userinterface/customelements/SettingsBody.js'
export { default as SettingsHeader } from '../../../src/userinterface/customelements/SettingsHeader.js'
