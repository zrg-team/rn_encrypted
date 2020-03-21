import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { View, Text } from 'react-native-ui-lib'
import commonStyles from '../../styles/common'

export default props => {
  return (
    <View style={[styles.container, commonStyles.shadow_light, props.style]}>
      {props.handleBack ? (
        <TouchableOpacity
          style={styles.btn_close}
          onPress={() =>
            props.handleBack()}
        >
          <Icon name='chevron-left' style={styles.icon_back} />
        </TouchableOpacity>
      ) : null}
      <Text h={2} style={styles.title}>
        {props.title}
      </Text>
      {props.visibleBtnClose ? (
        <TouchableOpacity
          style={styles.btn_close} onPress={() =>
            props.onClose()}
        >
          <Icon name='ios-close' style={styles.icon_power} />
        </TouchableOpacity>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 62,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row'
  },
  title: {
    color: '#152934',
    textAlign: 'center'
  },
  image: {
    marginRight: 10,
    width: 25,
    height: 30
  },
  btn_close: {
    position: 'absolute',
    left: 0,
    top: 8,
    width: 50,
    height: 50,
    color: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon_power: {
    fontSize: 30,
    color: '#fff'
  },
  icon_back: {
    fontSize: 42,
    color: '#5A6872'
  }
})
