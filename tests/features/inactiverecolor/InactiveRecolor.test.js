import InactiveRecolor from '../../../src/features/inactiverecolor/InactiveRecolor.js'

describe('InactiveRecolor', () => {
  let instance

  beforeEach(() => {
    instance = new InactiveRecolor([ { value: 'red' }, { value: 'blue' } ])
  })

  it('should be instantiated with correct colors', () => {
    expect(instance.inactiveColor).toBe('red')
    expect(instance.longInactiveColor).toBe('blue')
  })

  describe('execute', () => {
    let currentElement
    let mockElement

    beforeEach(() => {
      mockElement    = {
        style            : {},
        querySelectorAll : jest.fn(),
      }
      currentElement = {
        nextElementSibling: {
          tagName    : 'A',
          firstChild : { tagName: 'I' },
        },
        parentNode       : mockElement,
        querySelectorAll : jest.fn(),
      }
    })

    it('should recolor single inactive element', () => {
      currentElement.parentNode.querySelectorAll = jest.fn().mockReturnValue([ {
        style: {},
      } ])
      instance.execute(currentElement)

      const queriedElements = currentElement.parentNode.querySelectorAll(
        InactiveRecolor.inactiveSelector
      )

      expect(queriedElements[0].style.color).toBe('red')
      expect(queriedElements[0].style.fontWeight).toBe('bold')
    })

    it('should recolor long inactive elements', () => {
      currentElement.parentNode.querySelectorAll = jest.fn().mockReturnValue([ {
        style: {},
      }, {
        style: {},
      } ])
      instance.execute(currentElement)

      const queriedElements = currentElement.parentNode.querySelectorAll(
        InactiveRecolor.inactiveSelector
      )

      queriedElements.forEach((element) => {
        expect(element.style.color).toBe('blue')
        expect(element.style.fontWeight).toBe('bold')
      })
    })

    it('should not perform any action if there are no inactive elements', () => {
      mockElement.querySelectorAll.mockReturnValueOnce([])

      instance.execute(currentElement)

      expect(mockElement.querySelectorAll).toHaveBeenCalledWith(InactiveRecolor.inactiveSelector)
    })

    // test that results in inactiveElements being undefined and checking for the return on line 16
    it('should not perform any action if there are no inactive elements2', () => {
      mockElement.querySelectorAll.mockReturnValueOnce()
      currentElement.parentNode.querySelectorAll.mockReturnValueOnce()

      instance.execute(currentElement)

      expect(mockElement.querySelectorAll).toHaveBeenCalledWith(InactiveRecolor.inactiveSelector)
      expect(instance.execute(currentElement)).toBeUndefined()
    })
  })
})
