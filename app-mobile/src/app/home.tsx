import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ padding: 20 }}>
      <Text>Bem-vindo 🎉</Text>

      <Button title="Sair" onPress={() => router.replace("/login")} />
    </View>
  );
}