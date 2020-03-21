import 'react-native-gesture-handler'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { enableScreens } from 'react-native-screens'
import { PersistGate } from 'redux-persist/es/integration/react'
import store from './common/store'
import Root from './common/hocs/Root'

// Disable message in the bottom
console.disableYellowBox = true
enableScreens()
// Pure class no need Component
class App extends Component {
  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <Provider store={store.store}>
        <PersistGate loading={null} persistor={store.persistor}>
          <Root />
        </PersistGate>
      </Provider>
    )
  }
}

export default App
