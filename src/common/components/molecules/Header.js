import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from '../atoms/Icon';

const Header = ({ title, onBack }) => {
  return (
    <View style={styles.container}>
      <Icon name="chevron-left" size={30} color="#000" onPress={onBack} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default Header;