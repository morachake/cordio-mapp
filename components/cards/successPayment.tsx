import { Ionicons } from "@expo/vector-icons";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SuccessModal  ({ visible, onClose, amount, user })  {
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
              <Text style={styles.headerTitle}>Successful</Text>
            </View>
  
            {/* Success Container */}
            <View style={styles.successContainer}>
              <View style={styles.successImageContainer}>
                <View style={styles.successImage}>
                  <Ionicons name="mail" size={36} color="#4caf50" />
                  <View style={styles.checkmarkBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#4caf50" />
                  </View>
                </View>
                <Text style={styles.successTitle}>Transaction Successful</Text>
                
                {/* Transaction Details */}
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionAmount}>Ksh. {amount}</Text>
                  <Text style={styles.transactionRecipient}>
                    Sent to {user.name} • {user.phoneNumber}
                  </Text>
                </View>
              </View>
  
              {/* Go Back Button */}
              <TouchableOpacity style={styles.goBackButton} onPress={onClose}>
                <Text style={styles.goBackButtonText}>Go Back</Text>
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
      width: '90%',
      backgroundColor: '#002855',
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
        color: '#FFF',
    },
    transactionDetails: {
        alignItems: 'center',
        marginTop: 16,
      },
      transactionAmount: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#FFF',
      },
      transactionRecipient: {
        fontSize: 14,
        color: '#FFF',
      },
    successContainer: {
        // flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 30,
        borderRadius: 8,
      },
      successImageContainer: {
        alignItems: 'center',
      },
      successImage: {
        width: 80,
        height: 80,
        
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 16,
        position: 'relative',
      },
      checkmarkBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'white',

        borderRadius: 10,
      },
      successTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFF',
      },
      goBackButton: {
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        marginTop: 40,
      },
      goBackButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
      },
  })