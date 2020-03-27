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

export const defaultTheme = {
  colors: {
    primaryColor: '#2364AA',
    secondaryColor: '#81C3D7',
    textColor: '##221D23',
    errorColor: '#E63B2E',
    successColor: '#ADC76F',
    warnColor: '##FF963C'
  },
  typography: {
    h1: { fontSize: 50, fontWeight: 'bold' },
    h2: { fontSize: 46, fontWeight: '800' },
    h3: { fontSize: 40, fontWeight: '800' },
    h4: { fontSize: 32, fontWeight: '700' },
    h5: { fontSize: 28, fontWeight: '600' },
    h6: { fontSize: 24, fontWeight: '500' }
  },
  spacings: {
    page: 20,
    card: 12,
    gridGutter: 16
  }
}

export default StyleSheet.create(_.merge(style, STYLE_SHEET))
