// Mocking the ValueTableElement and ValueListElement classes
jest.mock('../../../src/userinterface/customelements/ValueTable.js', () => jest.fn().mockImplementation(() => ({ getElement: jest.fn(() => 'mockedValueTableElement') })))
jest.mock('../../../src/userinterface/customelements/ValueLists.js', () => jest.fn().mockImplementation(() => ({ getElement: jest.fn(() => 'mockedValueListElement') })))
