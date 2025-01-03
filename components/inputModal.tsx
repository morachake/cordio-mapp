import React, { useState } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native';

interface InputModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const InputModal = ({ visible, onClose, onSubmit }: InputModalProps) => {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    onSubmit(code);
    setCode('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter Meeting Code</Text>
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={setCode}
            placeholder="Enter code"
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
              <Text style={[styles.buttonText, styles.submitButtonText]}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding: 10,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#6C3CE3',
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
  },
});

export default InputModal;
