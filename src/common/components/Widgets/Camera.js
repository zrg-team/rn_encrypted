import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar
} from 'react-native'
// import i18n from 'i18n-js'
import { Button } from 'react-native-ui-lib'
import { RNCamera } from 'react-native-camera'
import Permissions from 'react-native-permissions'
import BottomSheet from './BottomSheet'
import { icons } from '../../../assets/elements'

const { width, height } = Dimensions.get('screen')

let instance = null
class QRCodeScan extends Component {
  constructor (props) {
    super(props)

    this.state = {
      cameraAvailable: false,
      cameraDisabledPopupVisible: false,
      show: false,
      qrCode: false,
      image: null,
      imageData: null,
      capureType: 'data-uri'
    }
    instance = this
    this.captureCallback = null

    this.handleHide = this.handleHide.bind(this)
    this.handleCapture = this.handleCapture.bind(this)
    this.showQrcode = this.showQrcode.bind(this)
    this.cameraRequest = this.cameraRequest.bind(this)
  }

  handleHide () {
    this.setState({
      show: false,
      image: null
    }, () => {
      this.onCaptureCallback = null
      if (BottomSheet.isShow()) {
        BottomSheet.temporaryShow()
      }
    })
  }

  async handleCapture () {
    try {
      if (this.camera) {
        const options = {
          quality: 0.1,
          base64: true,
          pauseAfterCapture: true,
          orientation: 'portrait',
          fixOrientation: true
        }
        const data = await this.camera.takePictureAsync(options)
        this.onCaptureCallback && this.onCaptureCallback(data)
        this.setState({
          cameraAvailable: false,
          cameraDisabledPopupVisible: false,
          show: false,
          image: null,
          imageData: null,
          capureType: 'data-uri'
        })
        this.captureCallback = null
        this.handleHide()
      }
    } catch (err) {
      console.debug('[CAMERA] handleCapture', err)
    }
  }

  showQrcode (captureCallback) {
    this.onCaptureCallback = captureCallback
    this.cameraRequest()
    this.setState({
      show: true,
      qrCode: true
    }, () => {
      if (BottomSheet.isShow()) {
        BottomSheet.temporaryHide()
      }
    })
  }

  show (captureCallback, image) {
    this.onCaptureCallback = captureCallback
    this.cameraRequest()
    this.setState({
      show: true,
      image,
      qrCode: false
    }, () => {
      if (BottomSheet.isShow()) {
        BottomSheet.temporaryHide()
      }
    })
  }

  cameraRequest () {
    Permissions.check(Permissions.PERMISSIONS.ANDROID.CAMERA).then(response => {
      if (response === Permissions.RESULTS.GRANTED) {
        this.setState({ cameraAvailable: true })
      } else {
        Permissions.request(Permissions.PERMISSIONS.ANDROID.CAMERA)
          .then(res => {
            if (res === Permissions.RESULTS.GRANTED) {
              this.setState({ cameraAvailable: true })
            } else {
              this.handleHide()
              this.setState({ cameraDisabledPopupVisible: true })
            }
          })
      }
    })
  }

  render () {
    const { zIndex } = this.props
    const { show, image, qrCode, cameraAvailable } = this.state
    if (!show) {
      return null
    }
    return (
      <View style={[styles.container, { zIndex }]}>
        <View style={{ flex: 1 }}>
          {cameraAvailable
            ? (
              <RNCamera
                ref={camera => {
                  this.camera = camera
                }}
                onBarCodeRead={qrCode ? this.onCaptureCallback : undefined}
                barCodeTypes={qrCode ? [RNCamera.Constants.BarCodeType.qr] : []}
                style={styles.camera}
                type={RNCamera.Constants.Type.back}
                captureAudio={false}
              >
                {image && (
                  <Image
                    source={{ uri: image }}
                    style={{ width: '100%', height: '100%', opacity: 1 }}
                    resizeMode='stretch'
                  />
                )}
                {qrCode && [
                  <TouchableOpacity style={styles.icon_wrapper} key='0' onPress={this.handleHide}>
                    <Image
                      source={icons.close}
                      style={styles.icon_close}
                      resizeMode='stretch'
                    />
                  </TouchableOpacity>,
                  <View style={styles.horizontalTopOverlay} key='1' />,
                  <View style={styles.verticalLeftOverlay} key='2' />,
                  <View key='3' style={styles.zoom_view}>
                    {/* <Image source={images.camera_focus} style={styles.image} /> */}
                  </View>,
                  <View style={styles.verticalRightOverlay} key='4' />,
                  <View style={styles.horizontalBottomOverlay} key='5' />
                ]}
              </RNCamera>
            ) : null}
        </View>
        {!qrCode ? (
          <View
            style={styles.button_container}
          >
            <Button
              full
              title='Capture'
              onPress={this.handleCapture}
            />
          </View>
        ) : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    height
  },
  zoom_view: {
    zIndex: 2,
    opacity: 1,
    width: width - 60
  },
  header: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.3
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  image: {
    width: width - 60,
    height: width - 60
  },
  button_container: {
    height: 60,
    paddingHorizontal: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon_wrapper: {
    right: 30,
    top: StatusBar.currentHeight + 32,
    // top: 32,
    position: 'absolute',
    zIndex: 99
  },
  icon_close: {
    width: 52,
    height: 52
  },
  // https://github.com/react-native-community/react-native-masked-view too heavy
  horizontalTopOverlay: {
    top: 0,
    backgroundColor: '#000',
    opacity: 0.5,
    position: 'absolute',
    height: (height - (width - 60)) / 2,
    width
  },
  horizontalBottomOverlay: {
    bottom: 0,
    backgroundColor: '#000',
    opacity: 0.5,
    position: 'absolute',
    height: (height - (width - 60)) / 2,
    width
  },
  verticalLeftOverlay: {
    width: 30,
    height: width - 60,
    left: 0,
    top: (height - (width - 60)) / 2,
    backgroundColor: '#000',
    opacity: 0.5,
    position: 'absolute'
  },
  verticalRightOverlay: {
    width: 30,
    height: width - 60,
    right: 0,
    top: (height - (width - 60)) / 2,
    backgroundColor: '#000',
    opacity: 0.5,
    position: 'absolute'
  }
})

export default {
  Component: QRCodeScan,
  show (callback, image = null) {
    instance &&
      instance.show(callback, image)
  },
  showQrcode (callback) {
    instance &&
      instance.showQrcode(callback)
  },
  hide () {
    instance && instance.handleHide()
  }
}
