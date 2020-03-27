import React, { PureComponent } from 'react'
import * as Animatable from 'react-native-animatable'
import { StyleSheet, Image } from 'react-native'
import { navigationReplace } from '../../utils/navigation'
import { images } from '../../../assets/elements'

export default class FadeLoading extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      active: false,
      rotation: false
    }
  }

  static getDerivedStateFromProps (nextProps, state) {
    const { active, navigation } = nextProps
    if (active !== state.active && active) {
      navigationReplace(navigation, nextProps.mainPage)
    }
    return {
      active
    }
  }

  componentDidMount () {
    const { init, navigation, mainPage, time } = this.props
    this.timeout = init && setTimeout(() => {
      navigationReplace(navigation, mainPage)
    }, time || 0)
  }

  componentWillUnmount () {
    clearTimeout(this.timeout)
  }

  render () {
    return (
      <Animatable.View animation='zoomIn' duration={3000} useNativeDriver style={styles.container}>
        <Image style={styles.image} source={images.splash} resizeMode='contain' />
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: 'center'
  }
})
