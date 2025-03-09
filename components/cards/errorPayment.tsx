import { Ionicons } from "@expo/vector-icons";
import { Modal, View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function ErrorModal({ visible, onRetry, onClose, amount, user }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}
              style={{
                padding: 8,
                backgroundColor: '#e0e0e0',
                borderRadius: 20,
              }}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Transaction failed</Text>
          </View>
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={30} color="#999" />
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <View style={styles.phoneContainer}>
              <Ionicons name="call-outline" size={16} color="#777" />
              <Text style={styles.phoneNumber}>{user.phoneNumber}</Text>
              <Ionicons name="chevron-down" size={16} color="#777" />
            </View>
          </View>

          {/* Amount Display */}
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Ksh. {amount}</Text>
          </View>

          {/* Error Message */}
          <View style={styles.errorContainer}>
            <View style={styles.errorIcon}>
              <Ionicons name="alert-circle" size={36} color="#e53935" />
            </View>
            <Text style={styles.errorText}>
              You have insufficient balance in your VLA wallet to make this payment.
            </Text>
          </View>

          {/* Retry Button */}
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
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
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  phoneNumber: {
    fontSize: 14,
    marginHorizontal: 8,
  },
  amountContainer: {
    marginVertical: 16,
  },
  amountLabel: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  errorIcon: {
    marginBottom: 16,
    borderWidth:1,
    borderRadius: 50,
    padding: 8,
    borderColor: '#e53935',
  },
  errorText: {
    textAlign: 'center',
    color: '#e53935',
    maxWidth: '80%',
  },
  retryButton: {
    width: '100%',
    backgroundColor: '#e53935',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
})