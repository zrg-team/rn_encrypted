import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Icon = ({ name, size, color }) => {
  return <MaterialIcons name={name} size={size} color={color} />;
};

export default Icon;