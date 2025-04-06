import React, { useCallback, useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  SafeAreaView
} from 'react-native';
import { useApp } from '../../context/AppContext';
import UserAttendance from '@/components/userAttendance';
import { Member } from '../../types/app';

interface AttendanceProps {
  onNext: (attendanceData: Member[]) => void;
  initialData?: Member[];
}

export default function Attendance({ onNext, initialData }: AttendanceProps) {
  const { state, updateAttendance } = useApp();
  const { isLoading, error } = state;

  // Initialize attendanceData from state or props
  const [attendanceData, setAttendanceData] = useState<Member[]>(
    initialData || []
  );
  
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle attendance status change
  const handleAttendanceChange = useCallback((memberId: number, status: Member['attendanceStatus']) => {
    console.log(`Updating attendance for member ${memberId} to ${status}`);
    setShowError(false);
    
    setAttendanceData(prev => {
      const newData = prev.map(member =>
        member.id === memberId ? { ...member, attendanceStatus: status } : member
      );
      return newData;
    });
    
    updateAttendance(memberId, status);
  }, [updateAttendance]);

  // Check if all members have attendance marked
  const isAllMembersMarked = useMemo(() => {
    return attendanceData.every(member => member.attendanceStatus);
  }, [attendanceData]);

  // Handle next button press
  const handleCompleteAttendance = useCallback(() => {
    if (!isAllMembersMarked) {
      setShowError(true);
      Alert.alert(
        "Incomplete Attendance",
        "Please mark attendance status for all members before proceeding"
      );
      return;
    }
    
    console.log("Proceeding to next step with attendance data");
    onNext(attendanceData);
  }, [attendanceData, onNext, isAllMembersMarked]);

  // Format member name for display
  const formatMemberName = (member: Member) => {
    return `${member.firstName || ''} ${member.lastName || ''}`.trim();
  };

  // Loading state
  if (loading || isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading attendance data...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Empty state
  if (!attendanceData?.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No group members available</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with badges */}
      <View style={styles.headerContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Total Members: {attendanceData.length}</Text>
        </View>
        
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            Marked: {attendanceData.filter(m => m.attendanceStatus).length} / {attendanceData.length}
          </Text>
        </View>
      </View>

      {/* Error alert */}
      {showError && !isAllMembersMarked && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>
            Please mark attendance status for all members before proceeding
          </Text>
        </View>
      )}

      {/* Member list */}
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.memberList}>
          {attendanceData.map(member => (
            <UserAttendance
              key={member.id}
              user={{
                id: member.id,
                name: formatMemberName(member)
              }}
              status={member.attendanceStatus?.toLowerCase() || ''}
              markedBy=""
              onStatusChange={(status) => handleAttendanceChange(member.id, status.toUpperCase())}
            />
          ))}
        </View>
      </ScrollView>

      {/* Complete button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            !isAllMembersMarked && styles.disabledButton
          ]}
          onPress={handleCompleteAttendance}
          disabled={!isAllMembersMarked}
        >
          <Text style={styles.buttonText}>Complete Attendance</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyContainer: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  emptyText: {
    color: '#92400E',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 16,
  },
  badge: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  badgeText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  alertContainer: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#F87171',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  alertText: {
    color: '#B91C1C',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
  },
  memberList: {
    paddingBottom: 16,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});