import React, { memo } from 'react'
import { SafeAreaView, StatusBar } from 'react-native'
import * as Animatable from 'react-native-animatable'
import commonStyles from '../../styles/common'

const supportAnimations = {
  up: {
    from: {
      opacity: 0.8,
      transform: [{
        translateY: 60
      }]
    },
    to: {
      opacity: 1,
      transform: [{
        translateY: 0
      }]
    }
  }
}

export default memo(({ ...props }) => {
  const { children, containerStyle = {}, tab = false, header = true, animation, animations } = props
  const bgColor = (props.type === 'secondary')
    ? commonStyles.bg_secondary
    : !tab
      ? commonStyles.bg_primary
      : commonStyles.tab_content_background_color
  let animationProps = {}
  let Wrapper = SafeAreaView
  if (animations) {
    animationProps = { ...animations }
    Wrapper = Animatable.View
  }
  if (animation && supportAnimations[animation]) {
    animationProps = { animation: supportAnimations[animation], useNativeDriver: true, easing: 'ease-in-out-cubic' }
    Wrapper = Animatable.View
  }
  return (
    <Wrapper
      style={[commonStyles.default_page, bgColor, containerStyle]}
      {...animationProps}
    >
      {header && <StatusBar backgroundColor='#051C3F' barStyle='light-content' />}
      {children}
    </Wrapper>
  )
})
