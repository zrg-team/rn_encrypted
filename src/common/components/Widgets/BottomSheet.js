import React, { PureComponent } from 'react'
import {
  View,
  AppState,
  StyleSheet,
  BackHandler,
  findNodeHandle,
  StatusBar,
  TouchableOpacity
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import SwipeablePanel from '../../../libraries/components/SwipeablePanel'
import commonStyles, { appHeight } from '../../../styles/common'
import BottomSheetHeader from '../BottomSheetHeader'

let instance = null
export const SNAPPOINTS = [
  0,
  appHeight * 0.1,
  appHeight * 0.2,
  appHeight * 0.3,
  appHeight * 0.4,
  appHeight * 0.5,
  appHeight * 0.6,
  appHeight * 0.7,
  appHeight * 0.8,
  appHeight * 0.9,
  appHeight * 0.95,
  appHeight
]

class BottomSheetComponent extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      level: 0,
      title: '',
      appActive: true,
      component: null,
      onTouchOut: null,
      headerBack: null,
      temporaryHide: false,
      onCloseCallback: null,
      prevertTouchOut: false
    }
    instance = this
    this.show = this.show.bind(this)
    this.onBack = this.onBack.bind(this)
    this.isShow = this.isShow.bind(this)
    this.handleHide = this.handleHide.bind(this)
    this.renderInner = this.renderInner.bind(this)
    this.temporaryShow = this.temporaryShow.bind(this)
    this.handleOnClose = this.handleOnClose.bind(this)
    this.renderBackground = this.renderBackground.bind(this)
    this.handleTemporaryHide = this.handleTemporaryHide.bind(this)
    this.handleTouchOutside = this.handleTouchOutside.bind(this)

    AppState.addEventListener('change', this.onAppStateChange.bind(this))
  }

  onAppStateChange (currentAppState) {
    switch (currentAppState) {
      case 'inactive':
      case 'background':
        this.setState({
          appActive: false
        })
        break
      case 'active': {
        this.setState({
          appActive: true
        })
      }
    }
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this.onAppStateChange)
  }

  handleOnClose () {
    const { onCloseCallback } = this.state
    BackHandler.removeEventListener('hardwareBackPress', this.onBack)
    this.setState({
      level: 0,
      title: '',
      show: false,
      callback: null,
      component: null,
      onTouchOut: null,
      headerBack: null,
      temporaryHide: false,
      onCloseCallback: null,
      prevertTouchOut: false
    })
    this.blurNode = null
    onCloseCallback && onCloseCallback()
  }

  getHeight () {
    const { level } = this.state
    return SNAPPOINTS[level] - 90
  }

  isShow () {
    return this.state.show
  }

  setHandleBack (callback) {
    this.setState({
      headerBack: callback
    })
  }

  handleHide () {
    const { onCloseCallback } = this.state
    this.setState({
      level: 0,
      title: '',
      show: false,
      callback: null,
      onTouchOut: null,
      headerBack: null,
      onCloseCallback: null,
      temporaryHide: false,
      prevertTouchOut: false
    }, () => {
      this.closeTimeout = setTimeout(() => {
        this.blurNode = null
        this.setState({
          component: null
        })
      }, 250)
    })
    BackHandler.removeEventListener('hardwareBackPress', this.onBack)
    onCloseCallback && onCloseCallback()
  }

  handleTemporaryHide () {
    this.setState({
      temporaryHide: true
    })
  }

  temporaryShow () {
    this.setState({
      temporaryHide: false
    })
  }

  onBack () {
    if (this.state.backButtonClose) {
      this.handleHide()
    }
    return true
  }

  show (component, {
    title,
    level = 6,
    onTouchOut,
    prevertTouchOut,
    onCloseCallback,
    backButtonClose = true
  }) {
    const { parentRef } = this.props
    clearTimeout(this.closeTimeout)
    if (parentRef) {
      this.blurNode = findNodeHandle(parentRef)
    }
    BackHandler.addEventListener('hardwareBackPress', this.onBack)
    this.setState({
      title,
      show: true,
      component,
      level,
      onTouchOut,
      temporaryHide: false,
      prevertTouchOut,
      backButtonClose,
      onCloseCallback
    })
  }

  handleTouchOutside () {
    const { onTouchOut, prevertTouchOut } = this.state
    if (onTouchOut && typeof onTouchOut === 'function') {
      return onTouchOut()
    } else if (!prevertTouchOut) {
      this.handleHide()
    }
  }

  renderInner () {
    const { component } = this.state
    return component
  }

  renderBackground () {
    const { appActive } = this.state
    if (this.blurNode && appActive) {
      return (
        <TouchableOpacity onPress={this.handleTouchOutside} style={styles.overlay}>
          <BlurView
            viewRef={this.blurNode}
            blurType='light'
            blurAmount={10}
            downsampleFactor={4}
          />
        </TouchableOpacity>
      )
    }
    return <TouchableOpacity onPress={this.handleTouchOutside} style={styles.overlay_background} />
  }

  render () {
    const { show, level, component, temporaryHide, title, headerBack } = this.state
    const extraStyles = temporaryHide ? { height: 0, overflow: 'hidden' } : {}
    return (
      <View style={styles.container}>
        {(show || component)
          ? this.renderBackground()
          : null}
        <SwipeablePanel
          fullWidth
          isActive={show}
          openLarge
          onlyLarge
          style={[extraStyles, commonStyles.shadow]}
          height={SNAPPOINTS[+level]}
          onClose={this.handleOnClose}
          header={<BottomSheetHeader handleBack={headerBack} title={title} />}
          scrollStyle={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FFFFFF'
          }}
        >
          {this.renderInner()}
        </SwipeablePanel>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  overlay_background: {
    position: 'absolute',
    backgroundColor: '#000',
    opacity: 0.5,
    width: '100%',
    top: StatusBar.currentHeight,
    height: '100%'
  }
})

export default {
  Component: BottomSheetComponent,
  show (component, options = {}) {
    if (instance) {
      instance.show(component, options)
    }
  },
  hide () {
    instance && instance.handleHide()
  },
  temporaryShow () {
    if (instance) {
      instance.temporaryShow()
    }
  },
  temporaryHide () {
    instance && instance.handleTemporaryHide()
  },
  isShow () {
    return (instance && instance.isShow()) || false
  },
  setHandleBack (callback) {
    instance && instance.setHandleBack(callback)
  },
  getHeight () {
    return (instance && instance.getHeight()) || 0
  }
}
