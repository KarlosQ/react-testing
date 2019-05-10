// setup.js
import React from 'react'
import { shallow } from 'enzyme'
import Button from '../Button'
const props: any = {
    onPress: jest.fn(),
    text: 'I am a button',
}
function setup(extraProps: any = {}) {
    const newProps = { ...props, ...extraProps }
    return {
        props: newProps,
        wrapper: shallow(<Button {...newProps} />),
    }
}
export default setup
