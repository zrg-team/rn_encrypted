import { StyleSheet, Dimensions, StatusBar } from 'react-native'
import { isIphoneX } from '../libraries/iphonex'
import {
  STYLE_SHEET
} from '../configs'
import _ from 'lodash'
const { height } = Dimensions.get('window')
const { height: screentHeight } = Dimensions.get('screen')

export const DEFAULT_HEADER_HEIGHT = isIphoneX() ? 80 : 60
export const isFixedSize = parseInt(height) === parseInt(screentHeight - StatusBar.currentHeight)
// export const appHeight = height - (!isFixedSize ? StatusBar.currentHeight : 0)
export const appHeight = height

const style = {
  bg_secondary: {
  },
  default_page: {
    flex: 1,
    width: '100%'
  }
}

export default StyleSheet.create(_.merge(style, STYLE_SHEET))
