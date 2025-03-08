import {StyleSheet, View ,Text, ScrollView, TouchableOpacity} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import MemberCard from "../cards/memberCard";
import PaymentMethod from "../cards/paymentMethod";

export default function SocialFund() {
    const [expandedMember, setExpandedMember] = useState(5);
  
    const toggleMember = (index) => {
      if (expandedMember === index) {
        setExpandedMember(null);
      } else {
        setExpandedMember(index);
      }
    };
  
    const members = [
      { id: 1, name: 'Hamadi Boi', amount: '50', isChecked: true },
      { id: 2, name: 'Hamadi Boi', amount: '50', isChecked: true },
      { id: 3, name: 'Hamadi Boi', amount: '50', isChecked: true },
      { id: 4, name: 'Hamadi Boi', amount: '50', isChecked: true },
      { id: 5, name: 'Hamadi Boi', amount: '50', isChecked: false },
      { id: 6, name: 'Hassan Boi Ali', amount: '50', isChecked: false },
    ];
  
    return (
      <View style={styles.container}>
  
        <View style={styles.balances}>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Previous Balance</Text>
            <Text style={styles.balanceAmount}>Ksh. 40,000</Text>
          </View>
          <View style={styles.balanceItem}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>Ksh. 40,600</Text>
          </View>
        </View>
  
        <ScrollView style={styles.membersList}>
          {members.map((member, index) => (
            <View key={member.id}>
              <MemberCard
                name={member.name}
                amount={member.amount}
                isChecked={member.isChecked}
                isExpanded={expandedMember === index}
                onPress={() => toggleMember(index)}
              />
              {expandedMember === index && (
                <View style={styles.paymentMethods}>
                  <PaymentMethod method="Wallet" icon="wallet" />
                  <PaymentMethod method="Cash" icon="cash" />
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 16,
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
    balances: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
      padding: 16,
      backgroundColor: '#fff',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#eee',
    },
    balanceItem: {
      alignItems: 'center',
    },
    balanceLabel: {
      color: '#3498db',
      fontSize: 16,
      marginBottom: 4,
    },
    balanceAmount: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    membersList: {
      flex: 1,
      marginBottom: 20,
    },
    paymentMethods: {
      marginBottom: 8,
      marginTop: -4,
      backgroundColor: '#fff',
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#eee',
    },

  });