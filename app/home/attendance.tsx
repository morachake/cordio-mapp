import Header from "@/components/header";
import UserAttendance from "@/components/userAttendance";
import Welcome from "@/components/Welcome";
import { View, Text ,StatusBar, ScrollView, StyleSheet} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Attendance ( ) {
    const users = [
        { id: 1, name: 'Mwanasiti Ali Ali', status: 'present' },
        { id: 2, name: 'Umaya Kassim Ali', status: 'present' },
        { id: 3, name: 'Kadzo Kassim Hassan', status: 'absent', markedBy: 'Faculty' },
        { id: 4, name: 'Ali Ali Ali', status: 'present', markedBy: 'Faculty' },
        { id: 5, name: 'Hassan Boi Ali', status: '' },
      ];
    return (
       <SafeAreaView style={styles.container}>
         <ScrollView>
            <StatusBar barStyle="dark-content" />
            <Header />

            <Text style={styles.headingText}>Attendance</Text>
            <View style={styles.section}>
            {users.map(user => (
                <UserAttendance 
                key={user.id}
                user={user}
                status={user.status}
                markedBy={user.markedBy}
                />
            ))}
            </View>
        </ScrollView>
       </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff',
        padding: 5
    },
    headingText :{
        color:'#282424',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginHorizontal: 15
    },
    section: {
        padding: 20,
        marginTop: 20
    },
})