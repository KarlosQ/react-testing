// button.unit.test.js
import setup from './setup'
describe('Button test', () => {
    const { wrapper, props } = setup()
    describe('should be render with a button', () => {
        test('should have one button', () => {
            expect(wrapper.find('button')).toHaveLength(1)
        })
        test('should have a text', () => {
            expect(wrapper.find('button').text()).toEqual(props.text)
        })
    })
    describe('should be launch onPress onClick', () => {
        test('should not pressed', () => {
            expect(props.onPress).toHaveBeenCalledTimes(0)
        })
        test('should press one time', () => {
            wrapper
                .find('button')
                .first()
                .props()
                .onClick()
            expect(props.onPress).toHaveBeenCalledTimes(1)
        })
    })
})
