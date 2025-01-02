import { Stack } from "expo-router";

const Layout = () =>{
    return (
        <Stack> 
            <Stack.Screen name="splash" options={{headerShown: false}} />
            <Stack.Screen name="login" />
        </Stack>
    )
}

export default Layout