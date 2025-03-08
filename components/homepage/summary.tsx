import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Summary() {
  return (
    <View style={styles.container}>
      {/* Attendance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attendance</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionItem}>Present: 20</Text>
          <Text style={styles.sectionItem}>Absent: 2</Text>
          <Text style={styles.sectionItem}>Late: 2</Text>
          <Text style={styles.sectionItem}>Absent With Apology: 2</Text>
        </View>
      </View>

      {/* Shares Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shares</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionItem}>Previous Shares: 50</Text>
          <Text style={styles.sectionItem}>This meeting's Shares: 50</Text>
        </View>
      </View>

      {/* Fines Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fines</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionItem}>Previous Fines: 500</Text>
          <Text style={styles.sectionItem}>This meeting's Shares: 100</Text>
        </View>
      </View>

      {/* Loans Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loans</Text>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionItem}>Previous Loans: 500</Text>
          <Text style={styles.sectionItem}>This meeting's Loans: 100</Text>
        </View>
      </View>

      {/* Total Section */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalTitle}>Total:</Text>
        <Text style={styles.totalAmount}>Ksh. 50,000.00</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  sectionItem: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  totalTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#002855',
    borderRadius: 8,
    padding: 16,
    marginTop: 'auto',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 8,
  },
});