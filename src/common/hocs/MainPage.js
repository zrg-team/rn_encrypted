import React, { Component } from 'react'
import i18n from 'i18n-js'
import NetInfo from '@react-native-community/netinfo'
import splashScreen from 'react-native-splash-screen'
import {
  View,
  Linking,
  AppState,
  StatusBar,
  BackHandler
} from 'react-native'
import {
  setApplicationState,
  setNavigationPage,
  setNetworkStatus
} from '../actions/common'
import commonStyle from '../../styles/common'
import Modal from '../components/Widgets/Modal'
import ProgressBar from '../components/Widgets/ProgressBar'
import Camera from '../components/Widgets/Camera'
import Toast from '../components/Widgets/Toast'
import CommonLoading from '../components/Widgets/CommonLoading'
import BottomSheet from '../components/Widgets/BottomSheet'
import { setTopLevelNavigator } from '../utils/navigation'

// gets the current screen from navigation state
function getActiveRouteName (navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route)
  }
  return route.routeName
}

let time = 15
let AppRouteComponent = null
export default class MainPage extends Component {
  constructor (props) {
    super(props)
    this.network = false
    this.state = {
      loading: true,
      lazy: true
    }
    this.navigatorRef = null
    this.getNavigator = this.getNavigator.bind(this)
    this.getNavigatorRef = this.getNavigatorRef.bind(this)
    this.handleNavigationStateChange = this.handleNavigationStateChange.bind(this)

    BackHandler.addEventListener('hardwareBackPress', () => true)
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange.bind(this)
    )
    AppState.addEventListener('change', this.onAppStateChange.bind(this))
    AppState.addEventListener('memoryWarning', this.onMemoryWarning.bind(this))

    this.initial()
  }

  processSplashScreen () {
    if (time <= 0) {
      return clearTimeout(this.splashScreenTime)
    }
    this.splashScreenTime = setTimeout(() => {
      splashScreen.hide()
      this.processSplashScreen()
      time -= 1
    }, 400)
  }

  getNavigatorRef (ref) {
    this.navigatorRef = ref
  }

  onMemoryWarning () {
    console.debug('[MAINPAGE] App Memory Warning')
  }

  onAppStateChange (currentAppState) {
    const { dispatch } = this.props
    // Should dispatch to redux network status
    console.info('[MAINPAGE] App change state', currentAppState)
    dispatch(setApplicationState(currentAppState))
  }

  getNavigator (loginKey, language) {
    if (`${loginKey}_${language}` === this.unique) {
      return this.AppNavigator
    }
    const { persistor, dispatch } = this.props
    if (!AppRouteComponent) {
      AppRouteComponent = require('../routes').default
    }
    this.AppNavigator = AppRouteComponent({
      persistor,
      dispatch,
      loginKey,
      setTopLevelNavigator,
      onNavigationStateChange: this.handleNavigationStateChange
    })
    this.unique = `${loginKey}_${language}`
    return this.AppNavigator
  }

  // Keep up with network information
  handleFirstConnectivityChange (connectionInfo) {
    const { dispatch } = this.props
    // Should dispatch to redux network status
    dispatch(setNetworkStatus(connectionInfo))
    if (!connectionInfo) {
      Toast.show(i18n.t('errors.network_connection_warning'), { type: 'error', duration: 15000 })
    }
  }

  // Usefull in analysis report
  handleNavigationStateChange (prevState, currentState) {
    const { dispatch } = this.props
    const currentPage = getActiveRouteName(currentState)
    const previousPage = getActiveRouteName(prevState)
    dispatch(setNavigationPage({ currentPage, previousPage }))
  }

  // Whole app will rerender. So be carefull
  shouldComponentUpdate (nextProps, nextState) {
    const { loginKey, language } = this.props
    const { loading, lazy } = this.state

    if (
      language !== nextProps.language ||
      loginKey !== nextProps.loginKey ||
      loading !== nextState.loading ||
      lazy !== nextProps.lazy
    ) {
      return true
    }
    return false
  }

  async componentWillUnmount () {
    clearTimeout(this.splashScreenTime)
    BackHandler.removeEventListener('hardwareBackPress', () => {})
    Linking.removeEventListener('url', () => {})
    AppState.removeEventListener('change', this.onAppStateChange)
    AppState.removeEventListener('memoryWarning', this.onMemoryWarning)
    NetInfo.removeEventListener(
      'connectionChange',
      this.handleFirstConnectivityChange
    )
  }

  async componentDidMount () {
    const { onLoadingDone } = this.props
    this.setState({
      loading: false
    }, () => {
      setTimeout(() => {
        if (!this.splashComplete) {
          splashScreen.hide()
          this.processSplashScreen()
        }
        this.splashComplete = true
        onLoadingDone && onLoadingDone()
      }, 0)
    })
  }

  initial () {
    const { persistor, dispatch, loginKey, language } = this.props
    // TODO: Loading page
    this.unique = `${loginKey}_${language}`
    if (!AppRouteComponent) {
      AppRouteComponent = require('../routes').default
    }
    this.AppNavigator = AppRouteComponent({
      persistor,
      dispatch,
      loginKey,
      setTopLevelNavigator,
      onNavigationStateChange: this.handleNavigationStateChange
    })
  }

  render () {
    const { loginKey, language } = this.props
    const { loading } = this.state
    const AppNavigator = this.getNavigator(loginKey, language)
    return [
      <View
        key='main'
        style={[
          {
            opacity: loading ? 0 : 1,
            height: '100%',
            paddingTop: StatusBar.currentHeight
          },
          commonStyle.bg_secondary
        ]}
        ref={this.getNavigatorRef}
      >
        {AppNavigator}
      </View>,
      <Modal.Component key='common-modal' parentRef={this.navigatorRef} global />,
      <BottomSheet.Component zIndex={2} parentRef={this.navigatorRef} key='common-bottom-sheet' global />,
      <ProgressBar.Component key='progress-bar' global />,
      <CommonLoading.Component parentRef={this.navigatorRef} key='common-bar' global />,
      <Camera.Component key='app-camera' zIndex={5} global />,
      <Toast.Component key='toast-bar' global />
    ]
  }
}
