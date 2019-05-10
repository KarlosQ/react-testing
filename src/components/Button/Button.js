// button.js
// @flow
import React from 'react'
import type { Props } from './types'
const Button = (props: Props) => (
    <button onClick={props.onPress}>{props.text}</button>
)
export default Button
