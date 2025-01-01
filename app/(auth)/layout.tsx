import { Stack } from "expo-router";

export default function AuthLayout () {
    return (
        <Stack> 
            <Stack.Screen name="splash" options={{headerShown: false}} />
            <Stack.Screen name="login" />
        </Stack>
    )
}