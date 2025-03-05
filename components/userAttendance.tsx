import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";

export default function UserAttendance({ user, status, markedBy }) {
  const [expanded, setExpanded] = useState(false);
  
  // Get initials for the avatar
  const getInitials = (name) => {
    return name.split(' ')[0][0];
  };
  
  // Determine text color based on status
  const getStatusColor = (status) => {
    switch(status) {
      case 'present':
        return '#000000';
      case 'absent':
        return '#FF0000';
      default:
        return '#000000';
    }
  };

  return (
    <View>
      <TouchableOpacity 
        style={styles.container}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
          
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>You are marked </Text>
              <Text style={[styles.statusValue, { color: getStatusColor(status) }]}>
                {status}
              </Text>
              {markedBy && <Text style={styles.markedBy}> by {markedBy}</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.optionsContainer}>
          <Pressable style={styles.optionButton}>
            <Text style={styles.optionText}>Present</Text>
          </Pressable>
          
          <Pressable style={[styles.optionButton, styles.selectedOption]}>
            <Text style={styles.selectedOptionText}>Absent</Text>
            <View style={styles.checkIcon}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          </Pressable>
          
          <Pressable style={styles.optionButton}>
            <Text style={styles.optionText}>Apology</Text>
          </Pressable>
          
          <Pressable style={styles.optionButton}>
            <Text style={styles.optionText}>Late</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7EB6E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '500',
    color: 'white',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: '#666',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  markedBy: {
    fontSize: 14,
    color: '#666',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 16,
    marginTop: -5,
    marginBottom: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#e0e0e0',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: 'white',
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    minWidth: 70,
  },
  selectedOption: {
    backgroundColor: '#E6E0FA',
    position: 'relative',
  },
  optionText: {
    fontSize: 12,
    color: '#333',
  },
  selectedOptionText: {
    fontSize: 12,
    color: '#673AB7',
    fontWeight: '500',
  },
  checkIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#673AB7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});