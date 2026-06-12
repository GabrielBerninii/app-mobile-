import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../constants/theme";

export default function Home() {
  const { usuarioId, usuarioNome } = useLocalSearchParams();
  const usuarioIdStr = String(usuarioId || "");
  const usuarioNomeStr = String(usuarioNome || "");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚽ Bem-vindo ao Futebol App</Text>
      <Text style={styles.subtitle}>Escolha uma opção abaixo</Text>

      <TouchableOpacity
        testID="home-ginasios"
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/ginasios",
            params: { usuarioId: usuarioIdStr, usuarioNome: usuarioNomeStr },
          })
        }
      >
        <Text style={styles.cardTitle}>Lista dos ginásios</Text>
        <Text style={styles.cardText}>Ver ginásios</Text>
      </TouchableOpacity>

      <TouchableOpacity
        testID="home-sair"
        style={styles.logoutButton}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: theme.colors.secondary,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
  },
  subtitle: {
    color: "#FFF",
    marginBottom: 20,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  cardText: {
    color: "#EEE",
    marginTop: 5,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#922B21",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
