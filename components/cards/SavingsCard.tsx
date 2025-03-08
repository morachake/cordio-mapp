import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SavingsCard  ({ name, amount, onPress, isExpanded, isChecked })  {
  return (
    <TouchableOpacity style={styles.memberCard} onPress={onPress}>
      <View style={styles.memberInfo}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>H</Text>
        </View>
        <View style={styles.nameAmountContainer}>
          <Text style={styles.memberName}>{name}</Text>
          <Text style={styles.memberAmount}>Ksh. {amount}</Text>
        </View>
      </View>
      {isChecked ? (
        <View style={styles.checkedIcon}>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </View>
      ) : (
        <Ionicons 
          name={isExpanded ? "chevron-up" : "chevron-down"} 
          size={24} 
          color="#777" 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e6f0fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkedIcon: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
     
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0a4d8f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  nameAmountContainer: {
    flexDirection: 'column',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
  },
  memberAmount: {
    fontSize: 14,
    color: '#666',
  },

});