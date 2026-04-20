import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="cadastro" options={{ title: "Cadastro" }} />
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="lista" options={{ title: "Lista" }} />
    </Stack>
  );
}
