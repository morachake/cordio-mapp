import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function LoanRequest() {
  const [selectedUser, setSelectedUser] = useState({
    name: 'Hassan Hamadi Boi',
    amount: 'Ksh. 6,699.0'
  });
  
  return (
    <View style={styles.container}>
      {/* User Info Card */}
      <View style={styles.userCard}>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={30} color="#999" />
          </View>
          <Text style={styles.userName}>{selectedUser.name}</Text>
        </View>

        {/* Loan Amount */}
        <View style={styles.loanInfoContainer}>
          <Text style={styles.loanLabel}>Loan Amount</Text>
          <Text style={styles.loanAmount}>{selectedUser.amount}</Text>
        </View>
      </View>

      {/* Form Container */}
      <View style={styles.formContainer}>
        {/* Select User Button */}
        <TouchableOpacity style={styles.selectUserButton}>
          <Text style={styles.selectUserText}>+ Select A User</Text>
        </TouchableOpacity>

        {/* Amount Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
          />
        </View>

        {/* Collateral Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Collateral</Text>
          <TextInput
            style={styles.input}
            placeholder="+ Collateral"
            placeholderTextColor="#999"
          />
        </View>

        {/* Request Loan Button */}
        <TouchableOpacity style={styles.requestButton}>
          <Text style={styles.requestButtonText}>Request Loan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loanInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanLabel: {
    fontSize: 14,
    color: '#333',
  },
  loanAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  selectUserButton: {
    marginVertical: 16,
  },
  selectUserText: {
    color: '#3563E9',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  requestButton: {
    backgroundColor: '#002855',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});