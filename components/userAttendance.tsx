import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";

// Updated to support the attendance status change callback
export default function UserAttendance({ user, status, markedBy, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(status || '');
  
  useEffect(() => {
    setSelectedStatus(status || '');
  }, [status]);
  
  // Get initials for the avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    return parts[0][0] || '';
  };
  
  // Determine text color based on status
  const getStatusColor = (status) => {
    switch(status) {
      case 'present':
        return '#22C55E'; // green
      case 'absent':
        return '#EF4444'; // red
      case 'apology':
        return '#F59E0B'; // yellow/amber
      case 'late':
        return '#FB923C'; // orange
      default:
        return '#6B7280'; // gray
    }
  };
  
  // Handle status selection
  const handleStatusSelect = (newStatus) => {
    setSelectedStatus(newStatus);
    if (onStatusChange) {
      onStatusChange(newStatus);
    }
    // Close the expanded view after selection
    setExpanded(false);
  };

  // Format status for display
  const formatStatus = (status) => {
    if (!status) return 'Not marked';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity 
        style={[
          styles.container, 
          expanded && styles.expandedContainer,
          selectedStatus && styles[`${selectedStatus}Container`]
        ]}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.8}
      >
        <View style={styles.userInfo}>
          <View style={[
            styles.avatar,
            selectedStatus && styles[`${selectedStatus}Avatar`]
          ]}>
            <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
          </View>
          
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user.name || 'Unknown Member'}</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>Status: </Text>
              <Text style={[
                styles.statusValue, 
                { color: getStatusColor(selectedStatus) }
              ]}>
                {formatStatus(selectedStatus)}
              </Text>
              {markedBy && <Text style={styles.markedBy}> by {markedBy}</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.optionsContainer}>
          <AttendanceOption 
            label="Present" 
            isSelected={selectedStatus === 'present'} 
            onSelect={() => handleStatusSelect('present')}
            color="#22C55E"
          />
          
          <AttendanceOption 
            label="Absent" 
            isSelected={selectedStatus === 'absent'} 
            onSelect={() => handleStatusSelect('absent')}
            color="#EF4444"
          />
          
          <AttendanceOption 
            label="Apology" 
            isSelected={selectedStatus === 'apology'} 
            onSelect={() => handleStatusSelect('apology')}
            color="#F59E0B"
          />
          
          <AttendanceOption 
            label="Late" 
            isSelected={selectedStatus === 'late'} 
            onSelect={() => handleStatusSelect('late')}
            color="#FB923C"
          />
        </View>
      )}
    </View>
  );
}

// Helper component for attendance options
function AttendanceOption({ label, isSelected, onSelect, color }) {
  return (
    <Pressable 
      style={[
        styles.optionButton,
        isSelected && styles.selectedOption,
        isSelected && { backgroundColor: `${color}20` } // 20% opacity of the color
      ]}
      onPress={onSelect}
    >
      <Text style={[
        styles.optionText,
        isSelected && styles.selectedOptionText,
        isSelected && { color }
      ]}>
        {label}
      </Text>
      
      {isSelected && (
        <View style={[styles.checkIcon, { backgroundColor: color }]}>
          <Text style={styles.checkText}>✓</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '95%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    backgroundColor: 'white',
  },
  expandedContainer: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  presentContainer: {
    borderColor: '#22C55E30',
  },
  absentContainer: {
    borderColor: '#EF444430',
  },
  apologyContainer: {
    borderColor: '#F59E0B30',
  },
  lateContainer: {
    borderColor: '#FB923C30',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6C3CE3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  presentAvatar: {
    backgroundColor: '#22C55E',
  },
  absentAvatar: {
    backgroundColor: '#EF4444',
  },
  apologyAvatar: {
    backgroundColor: '#F59E0B',
  },
  lateAvatar: {
    backgroundColor: '#FB923C',
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
    paddingVertical: 16,
    marginTop: -1,
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
    position: 'relative',
  },
  selectedOption: {
    backgroundColor: '#E6E0FA', // Default selected background
  },
  optionText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '400',
  },
  selectedOptionText: {
    color: '#6C3CE3', // Default selected text color
    fontWeight: '500',
  },
  checkIcon: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#673AB7', // Default check background
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  }
});