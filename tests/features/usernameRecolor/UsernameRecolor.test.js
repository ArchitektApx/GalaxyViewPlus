import UsernameRecolor from '../../../src/features/usernameRecolor/UsernameRecolor.js'

describe('UsernameRecolor', () => {
  let instance

  const mockConfigData = [
    { key: 'UserA', value: 'red' },
    { key: 'UserB', value: 'blue' },
  ]

  beforeEach(() => {
    instance = new UsernameRecolor(mockConfigData)
  })

  it('should be instantiated with correct user recolor data', () => {
    expect(instance.userRecolorData).toEqual(mockConfigData)
  })

  describe('execute', () => {
    let currentElement
    let mockElement

    beforeEach(() => {
      mockElement    = {
        textContent : 'UserA',
        style       : {},
      }
      currentElement = {
        children: [ mockElement ],
      }
    })

    it('should recolor user element when matching username found', () => {
      instance.execute(currentElement)

      expect(mockElement.style.color).toBe('red')
    })

    it('should not recolor user element when no matching username found', () => {
      mockElement.textContent = 'UserC'

      instance.execute(currentElement)

      expect(mockElement.style.color).toBeUndefined()
    })

    it('should not throw error when no children present', () => {
      currentElement.children = []

      expect(() => {
        instance.execute(currentElement)
      }).not.toThrow()
    })
  })
})
