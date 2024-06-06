import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#e7e7e7',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default Footer;