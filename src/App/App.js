// @flow
// App.js
import axios from 'axios'
import React, { Component } from 'react'
import { Button } from '../components'
import type { State } from './types'

class App extends Component<{}, State> {
    state = {
        data: [],
    }
    onSubmit = async () => {
        const response = await axios.get(
            'https://api.github.com/users/mralexgray/repos'
        )
        this.setState({ data: response.data })
    }
    render() {
        return (
            <div className='App'>
                <Button
                    onPress={this.onSubmit}
                    text='I am a submit button'
                    testID='appSubmitButton'
                />
                {this.state.data.map((item, index) => (
                    <div key={index}>{item.name}</div>
                ))}
            </div>
        )
    }
}

export default App
