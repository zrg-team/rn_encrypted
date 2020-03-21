/**
 * @format
 */
import './shim.js'
import './src/libraries/logger'
import './src/libraries/storage'
import './src/libraries/firebase'
import { name as appName } from './app.json'
import { AppRegistry } from 'react-native'
import App from './src/App'

AppRegistry.registerComponent(appName, () => App)
