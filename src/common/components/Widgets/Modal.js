import React, { PureComponent } from 'react'
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  AppState,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  findNodeHandle
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { appHeight } from '../../../styles/common'

let instance = null
const { width } = Dimensions.get('window')
class Modal extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      show: false,
      appActive: true,
      rotation: false,
      translateY: new Animated.Value(0.5),
      formComponent: null,
      touchOutSideToHide: true,
      enableAnimation: true,
      backButtonClose: false
    }
    instance = this
    this.show = this.show.bind(this)
    this.onBack = this.onBack.bind(this)
    this.handleTouchOutSide = this.handleTouchOutSide.bind(this)
    this.isShow = this.isShow.bind(this)
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

  isShow () {
    return this.state.show
  }

  hide (callback) {
    this.setState({
      show: false,
      callback: null,
      formComponent: null
    })
    callback && callback()
  }

  onBack () {
    BackHandler.removeEventListener('hardwareBackPress', this.onBack)
    if (this.state.backButtonClose) {
      this.hide()
    }
    return true
  }

  show (formComponent, touchOutSideToHide, backButtonClose, enableAnimation) {
    BackHandler.addEventListener('hardwareBackPress', this.onBack)
    const { parentRef } = this.props
    if (parentRef) {
      this.blurNode = findNodeHandle(parentRef)
    }
    this.setState({
      show: true,
      formComponent,
      touchOutSideToHide,
      enableAnimation,
      backButtonClose
    })
  }

  handleTouchOutSide () {
    const { touchOutSideToHide } = this.state
    if (touchOutSideToHide) {
      this.hide()
    }
  }

  renderBackground () {
    const {
      appActive
    } = this.state

    return appActive
      ? (
        <View
          style={styles.overlay_blur}
        >
          <BlurView
            viewRef={this.blurNode}
            blurType='light'
            blurAmount={10}
            downsampleFactor={4}
          />
        </View>
      ) : (
        <View
          key='overlay'
          style={[
            styles.overlay
          ]}
        />
      )
  }

  render () {
    const { show, enableAnimation } = this.state
    if (!show) {
      return null
    }

    if (this.state.formComponent != null) {
      Animated.timing(this.state.translateY, {
        toValue: 1,
        easing: Easing.in(),
        duration: 300,
        useNativeDriver: true
      }).start()
    }

    return [
      this.renderBackground(),
      <View key='main' style={styles.container}>
        <Animated.View
          style={[
            styles.formContainer,
            enableAnimation
              ? {
                transform: [{ scale: this.state.translateY }]
              }
              : {}
          ]}
        >
          <TouchableOpacity
            style={{ position: 'absolute', top: 0, left: 0, width }}
            activeOpacity={1}
            onPress={this.handleTouchOutSide}
          />
          {this.state.formComponent}
        </Animated.View>
      </View>
    ]
  }
}
const Content = (props, context) => {
  return [
    <View
      key='main'
      style={[
        styles.modalWrapper,
        props.modalWrapper,
        { backgroundColor: '#FFFFFF' }
      ]}
    >
      <View style={[styles.modal_header]}>{props.modal_header}</View>
      <ScrollView bounces={false}>
        <View style={[styles.modal_body, props.modalBodyStyle]}>{props.modal_body}</View>
      </ScrollView>
      <View style={[styles.modal_footer, props.modal_footer || {}]}>
        {props.primaryAction && <View style={[{ marginBottom: 24 }, props.primaryStyle || {}]}>{props.primaryAction}</View>}
        {props.handleCancelAction ? (
          <View style={styles.buttonCancelWrapper}>
            <TouchableOpacity onPress={props.handleCancelAction}>
              <Text align='center' weight='500'>
                {props.titleSecondary ? props.titleSecondary : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>,
    props.outComponent || null
  ]
}

const styles = StyleSheet.create({
  container: {
    zIndex: 998,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: appHeight,
    marginTop: StatusBar.currentHeight,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    bottom: 0,
    top: 0,
    left: 0
  },
  overlay: {
    opacity: 0.3,
    backgroundColor: '#000',
    position: 'absolute',
    width: '100%',
    height: '100%',
    // opacity: 0.2,
    left: 0,
    top: 0
  },
  overlay_blur: {
    // opacity: 0.3,
    position: 'absolute',
    width: '100%',
    height: '100%',
    // opacity: 0.2,
    left: 0,
    top: 0
  },
  modalWrapper: {
    borderRadius: 8,
    marginHorizontal: 24,
    height: '70%'
  },
  modal_body: {
    paddingVertical: 24
  },
  buttonCancelWrapper: {
    paddingBottom: 24
  },
  modal_footer: {
    marginTop: 10
  },
  modal_header: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden'
  }
})

const ModalPage = {
  Component: Modal,
  show (formComponent, touchOutSideToHide = false, backButtonClose = false, enableAnimation = true) {
    instance &&
      instance.show(formComponent, touchOutSideToHide, backButtonClose, enableAnimation)
  },
  hide (callback = () => {}) {
    instance && instance.isShow() && instance.hide(callback)
  },
  Content: props => <Content {...props} />,
  isShow () { return instance.isShow() }
}

export default ModalPage
