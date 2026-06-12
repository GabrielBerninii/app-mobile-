import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "../../constants/theme";
import { Ginasio } from "../types/reserva";

export default function Ginasios() {
  const { usuarioId, usuarioNome } = useLocalSearchParams();
  const usuarioIdStr = String(usuarioId || "");
  const usuarioNomeStr = String(usuarioNome || "");

  const ginasios: Ginasio[] = [
    { id: 1, nome: "Ginásio Poliesportivo Dom Bosco" },
    { id: 2, nome: "Ginásio Poliesportivo São Domingos" },
    { id: 3, nome: "Ginásio Poliesportivo Jacy Teixeira" },
    { id: 4, nome: "Arena Filomena Society" },
    { id: 5, nome: "Campo Urciano Lemos" },
  ];

  function handleSelectGinasio(ginasio: Ginasio) {
    router.push({
      pathname: "/lista",
      params: {
        ginasio: ginasio.nome,
        ginasioId: ginasio.id,
        usuarioId: usuarioIdStr,
        usuarioNome: usuarioNomeStr,
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚽ Selecione um Ginásio</Text>
      <ScrollView style={styles.scrollView}>
        {ginasios.map((ginasio) => (
          <TouchableOpacity
            testID={`ginasio-${ginasio.id}`}
            key={ginasio.id}
            style={styles.ginasioCard}
            onPress={() => handleSelectGinasio(ginasio)}
          >
            <Text style={styles.ginasioTitle}>{ginasio.nome}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
        <Text style={styles.voltarText}>Voltar</Text>
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
    marginBottom: 20,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  ginasioCard: {
    backgroundColor: theme.colors.card,
    padding: 25,
    borderRadius: 15,
    marginBottom: 15,
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  ginasioTitle: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "600",
    textAlign: "center",
  },
  voltar: {
    backgroundColor: "#d32f2f",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  voltarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
