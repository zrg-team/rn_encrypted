import React from 'react';
import { View, Text } from 'react-native';
import DefaultPage from '../common/hocs/DefaultPage';
import styles from '../styles/MainPage.module.css';

const MainPage = () => {
  return (
    <DefaultPage containerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Main Page</Text>
      </View>
      {/* Add more components as needed */}
    </DefaultPage>
  );
};

export default MainPage;