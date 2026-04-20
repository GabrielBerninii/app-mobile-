import { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { loginUser } from "../apiService/api";

export default function Login() {
  const router = useRouter();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin() {
    const user = await loginUser(login, senha);

    if (user) {
      router.push("/home");
    } else {
      Alert.alert("Erro", "Login inválido");
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>

      <TextInput
        placeholder="Usuário"
        value={login}
        onChangeText={setLogin}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}