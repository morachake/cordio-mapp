import { TouchableOpacity, StyleSheet, View} from "react-native";
import PaymentMethod from "./cards/paymentMethod";
import ErrorModal from "./cards/errorPayment";
import SuccessModal from "./cards/successPayment";
import { useState } from "react";

export default function WalletPaymentFlow({ amount = "50.00", memberName = "Member" }) {
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // User information - could be passed as props or use the member name
  const user = {
    name: memberName || 'Hassan Boi Ali',
    phoneNumber: '0743378000'
  };

  // Handler for wallet payment selection
  const handleWalletPayment = () => {
    // Simulate a payment process
    const isSuccessful = Math.random() > 0.5;
    
    if (isSuccessful) {
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  };

  // Handler for retrying a failed payment
  const handleRetry = () => {
    setShowErrorModal(false);
    // Try again
    handleWalletPayment();
  };

  // Handler for closing modals
  const handleClose = () => {
    setShowErrorModal(false);
    setShowSuccessModal(false);
  };

  return (
    <View>
      {/* Use the PaymentMethod component with an onPress handler */}
      <PaymentMethod
        method="Wallet" 
        icon="wallet"
        amount={amount}
        user={user}
        onPaymentInitiated={handleWalletPayment}
      />
      
      {/* Error Modal */}
      <ErrorModal 
        visible={showErrorModal}
        onRetry={handleRetry}
        onClose={handleClose}
        amount={amount}
        user={user}
      />
      
      {/* Success Modal */}
      <SuccessModal 
        visible={showSuccessModal}
        onClose={handleClose}
        amount={amount}
        user={user}
      />
    </View>
  );
}

  
  // Styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },


  });
  
