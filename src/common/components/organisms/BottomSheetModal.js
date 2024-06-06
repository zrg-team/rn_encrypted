import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Header from '../molecules/Header';

const BottomSheetModal = ({ visible, onClose, children }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.container}>
        <Header title="Details" onBack={onClose} />
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
    padding: 16,
  },
});

export default BottomSheetModal;