// App.int.test.js
import React from 'react'
import { shallow } from 'enzyme'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import App from '../'
import mockResponse from './mock'

const mockAxios = new AxiosMockAdapter(axios)

mockAxios
    .onGet('https://api.github.com/users/mralexgray/repos')
    .reply(200, mockResponse)

describe('SignIn integration test', () => {
    describe('submit button', () => {
        const wrapper = shallow(<App />)
        const instance = wrapper.instance()
        test('should submit to API and set response in state', async () => {
            const button = wrapper.findWhere(
                node => node.prop('testID') === 'appSubmitButton'
            )
            await button.props().onPress()
            expect(instance.state.data).toEqual(mockResponse)
        })
    })
})
