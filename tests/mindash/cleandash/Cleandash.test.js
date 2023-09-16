/* eslint-disable quotes */
/* eslint-disable babel/quotes */
import Cleandash from '../../../src/mindash/cleandash/Cleandash.js'

describe('Cleandash', () => {
  describe('Escaping and Sanitizing', () => {
    const testresult = '&quot;&lt;&amp;&#x27;&#x2F;&quot;&gt;'

    it('should escape special characters in a string', () => {
      const string_       =  '"<&\'/">'
      const escapedString = Cleandash.escapeString(string_)

      expect(escapedString).toBe(testresult)
    })

    it('should return the same string if no special characters are present', () => {
      const string_       = 'normalString'
      const escapedString = Cleandash.escapeString(string_)

      expect(escapedString).toBe('normalString')
    })

    it('should escape strings for special characters', () => {
      const input  = [ `"<&'/">`, `second<&'/">` ]
      const result = Cleandash.sanitizeStrings(input)

      expect(result[0]).toBe(testresult)
      expect(result[1]).toBe('second&lt;&amp;&#x27;&#x2F;&quot;&gt;')
    })

    it('should handle single string input', () => {
      const input  = `"<&'/">`
      const result = Cleandash.sanitizeStrings(input)

      expect(result).toBe(testresult)
    })
  })

  describe('Color Validation', () => {
    it('should validate hex color values', () => {
      expect(Cleandash.validateColorInput('#FFFFFF')).toBe(true)
      expect(Cleandash.validateColorInput('#FFFAAA')).toBe(true)
      expect(Cleandash.validateColorInput('#ffffff')).toBe(true)
      expect(Cleandash.validateColorInput('#000')).toBe(false) // not a 6 character hex
      expect(Cleandash.validateColorInput('#GGGGGG')).toBe(false) // not valid hex characters
      expect(Cleandash.validateColorInput('FFFFFF')).toBe(false)  // missing #
    })

    it('should validate html color names if strict is set to false', () => {
      expect(Cleandash.validateColorInput('green', false)).toBe(true)
      expect(Cleandash.validateColorInput('black', false)).toBe(true)
      expect(Cleandash.validateColorInput('white', false)).toBe(true)
      expect(Cleandash.validateColorInput('gray', false)).toBe(true)
    })

    it('should not validate invalid html color names if strict is set to false', () => {
      expect(Cleandash.validateColorInput('notAColor', false)).toBe(false)
      expect(Cleandash.validateColorInput('notAColor', true)).toBe(false)
    })

    it('should not validate html color names if strict is set to true', () => {
      expect(Cleandash.validateColorInput('green', true)).toBe(false)
      expect(Cleandash.validateColorInput('black', true)).toBe(false)
      expect(Cleandash.validateColorInput('white', true)).toBe(false)
      expect(Cleandash.validateColorInput('gray', true)).toBe(false)
    })
  })

  describe('validateNumberInput', () => {
    it('should validate numerical strings', () => {
      expect(Cleandash.validateNumberInput('123')).toBe(true)
      expect(Cleandash.validateNumberInput('00123')).toBe(true)
      expect(Cleandash.validateNumberInput('-123')).toBe(false)  // negative number
      expect(Cleandash.validateNumberInput('123.45')).toBe(false) // decimal number
      expect(Cleandash.validateNumberInput('ABC')).toBe(false)    // not a number
    })
  })

  describe('validateStringInput', () => {
    it('should validate alphanumeric and some special characters', () => {
      expect(Cleandash.validateStringInput('test_String-123')).toBe(true)
      expect(Cleandash.validateStringInput('test String')).toBe(true)
      expect(Cleandash.validateStringInput('test_String_')).toBe(true)
      expect(Cleandash.validateStringInput('test!String')).toBe(false) // has !
    })
  })
})
