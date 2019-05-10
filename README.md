# Testing

This is a **guide** for testing **React** and **React Native**.

We will use **Jest** and **Enzyme** for this task

- [Jest docs](https://jestjs.io/docs/en/getting-started)
- [Enzyme docs](https://airbnb.io/enzyme/docs/api/)

# Getting started

First clone the project and install all

```bash
git clone https://github.com/KarlosQ/react-testing
yarn install
```

## Types of tests

Mainly there are four types of testing

### Static tests

This test check syntax erros and type errors.

For resolve this we use [eslint](https://eslint.org/docs/user-guide/getting-started) and [flow](https://flow.org/en/docs/getting-started/).

### Unit tests

They are the test core and too the easiest to write because only the component itself was involved.

This type of tests not contain api calls.

Things that can be tested in a unit test:

- Render test
- Check if the number of elements is correct
- Check his internal functionallity works good

Unit tests are the best for pure functions.

### Integration tests

The integration test implicate make api calls or test a functionallity between two or more components/functions.

Things that can be tested in a integration test:

- API calls
- Check if a redux action change use a reducer and change correctly the state
- Test if when a input change the screen receive the value of the input

### End to end tests

With them, we can test the app or web like as if a human did it.

In React Native we must use [Detox](https://github.com/wix/Detox) and for web [Cypress](https://github.com/cypress-io/cypress)

They are very important before a production launch, because can test all without mock nothing, in a real environment.

## Writing tests

We can understand better with a example.

We create a simple button. This button would be in components folder.

### Folder structure :open_file_folder:

We write own tests inside a **\_\_tests\_\_** folder inside the component folder.

The naming of own tests are:

- Unit tests: Button.unit.test.js
- Integration tests: App.int.test.js

Button doesn't need a integration tests because it's very simple.

E2E tests is for test all the proyect and will be in root project.

```bash
.
├── components                              # Components folder.
│   │── Button                              # Button folder.
│   │   ├── Button.js                       # Button component file.
│   │   ├── types.js                        # Flow types for Button.
│   │   ├── __tests__                       # Tests folder.
│   │   │  ├── Button.unit.test.js          # Unit test file.
│   │   │  ├── setup.js	                    # Setup for testing.
├── App                                     # App folder.
│   │── App.js                              # App component file.
│   │── types.js                            # Flow types for App.
│   │── __tests__                           # Tests folder.
│   │   │── App.int.test                    # Integration test file.
│   │   │── mock.json                       # Mock response file.
```

### React component

This is the react components

```jsx
// Button.js
// @flow
import React from 'react'
import type { Props } from './types'
const Button = (props: Props) => (
    <button onClick={props.onPress}>{props.text}</button>
)
export default Button
```

```jsx
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
```

### Static test

For static test we use flow and eslint

```js
// Button types.js
// @flow
export type Props = {
    onPress: () => void,
    text: string,
}
```

```js
// App types.js
// @flow
export type State = {
    data: any,
}
```

```js
// .eslintrc
{
    "extends": ["standard", "standard-react"],
    "parser": "babel-eslint",
    "plugins": ["jest"],
    "rules": {
        "space-before-function-paren": [
            "error",
            { "anonymous": "never", "named": "never", "asyncArrow": "always" }
        ],
        "comma-dangle": ["error", "only-multiline"],
        "indent": ["error", 4, { "SwitchCase": 1 }],
        "react/jsx-indent": [4, 2, { "indentLogicalExpressions": true }],
        "react/jsx-indent-props": [4, 2],
        "react/self-closing-comp": [
            "error",
            {
                "component": false
            }
        ],
        "curly": "off",
        "no-useless-escape": "off"
    },
    "env": {
        "commonjs": true,
        "mocha": true
    },
    "globals": {
        "fetch": false,
        "expect": false,
        "jest": false,
        "FormData": false
    }
}
```

### Unit test

In the unit test we test the functionality of the component

```js
// Button setup.js
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
```

```js
// Button.unit.test.js
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
```

### Integration test

In the integration test we test if the diferent component works well between them and if the api call work well too.

```js
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
```

### Mock file

This mock file is for mock the api call

```js
// mock.json
[
    {
        "id": 6104546,
        {...}
    }
]
```

## TODO

We need improve the tests, do a e2e test and create a repo for react-native testing