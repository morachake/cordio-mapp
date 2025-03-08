import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View,Text } from "react-native";

export default function PaymentMethod ({ method, icon })  {
    return (
      <TouchableOpacity style={styles.paymentMethod}>
        <View style={styles.paymentMethodContent}>
          <View style={styles.paymentIcon}>
            {icon === "wallet" ? (
              <Ionicons name="wallet-outline" size={20} color="#333" />
            ) : (
              <Ionicons name="cash-outline" size={20} color="#333" />
            )}
          </View>
          <Text style={styles.paymentText}>Pay with {method}</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color="#777" />
      </TouchableOpacity>
    );
  };
  
  const styles= StyleSheet.create({
    paymentMethod: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      },
      paymentMethodContent: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      paymentIcon: {
        marginRight: 10,
      },
      paymentText: {
        fontSize: 14,
      },
  });