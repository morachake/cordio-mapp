import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CodesList = ({ codes, onRemoveCode }) => {
  return (
    <View style={styles.codesList}>
      {codes.map((code, index) => (
        <View key={index} style={styles.codeItem}>
          <Text style={styles.codeText}>{code}</Text>
          <TouchableOpacity
            onPress={() => onRemoveCode(code)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  codesList: {
    marginTop: 16,
  },
  codeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  codeText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#FF4444',
    borderRadius: 6,
    padding: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CodesList;