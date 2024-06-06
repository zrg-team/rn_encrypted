import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Avatar = ({ source, size }) => {
  const style = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return <Image source={source} style={[styles.avatar, style]} />;
};

const styles = StyleSheet.create({
  avatar: {
    resizeMode: 'cover',
  },
});

export default Avatar;