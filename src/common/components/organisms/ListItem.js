import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Avatar from '../atoms/Avatar';

const ListItem = ({ title, subtitle, avatar, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Avatar source={avatar} size={40} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e7e7e7',
  },
  textContainer: {
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default ListItem;