import { router } from "expo-router";
import { useState } from "react";
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { theme } from "../../constants/theme";
import { createUser, findUserByEmail } from "../apiService/api";


function mostrarAlerta(titulo: string, mensagem: string) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}: ${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}
export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [senhaStrength, setSenhaStrength] = useState(0);

  function calcStrength(value: string): number {
    let s = 0;
    if (value.length >= 6) s++;
    if (value.length >= 10) s++;
    if (/[A-Z]/.test(value) && /[0-9]/.test(value)) s++;
    if (/[^A-Za-z0-9]/.test(value)) s++;
    return s;
  }

  function getStrengthColor(index: number): string {
    if (index >= senhaStrength) return theme.colors.inputBorder;
    const colors = ["", "#e74c3c", "#f39c12", theme.colors.primary, theme.colors.primary];
    return colors[senhaStrength] || theme.colors.inputBorder;
  }

  function getStrengthLabel(): string {
    if (senha.length === 0) return "";
    const labels = ["", "Fraca", "Média", "Forte", "Muito forte"];
    return labels[senhaStrength] || "";
  }

  async function handleCadastro() {
    try {
      if (!nome || !email || !senha) {
        Alert.alert("Atenção", "Preencha todos os campos.");
        return;
      }
      const usuarios = await findUserByEmail(email);
      if (usuarios.length > 0) {
        Alert.alert("Erro", "Já existe um usuário com esse e-mail.");
        return;
      }
      await createUser(nome, email, senha);
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar.");
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* Field background */}
      <View style={styles.fieldBg}>
        <View style={styles.centerCircle} />
        <View style={styles.halfLine} />
        <View style={styles.penaltyBox} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoArea}>
          <View style={styles.logoBall}>
            <View style={styles.ballHex} />
          </View>
          <Text style={styles.appName}>FUTAPP</Text>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>CRIAR CONTA</Text>
        <Text style={styles.sectionSub}>Junte-se ao jogo</Text>

        {/* Avatar upload */}
        <View style={styles.avatarRow}>
          <TouchableOpacity style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
            <View style={styles.avatarBadge}>
              <Text style={styles.avatarBadgeText}>+</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Nome field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>👤  NOME</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="Seu nome completo"
            placeholderTextColor={theme.colors.placeholder}
            value={nome}
            onChangeText={setNome}
          />
        </View>

        {/* Email field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>✉  EMAIL</Text>
          <TextInput
            style={styles.fieldInput}
            placeholder="seu@email.com"
            placeholderTextColor={theme.colors.placeholder}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        {/* Password field */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>🔒  SENHA</Text>
          <View style={styles.pwdWrap}>
            <TextInput
              style={[styles.fieldInput, { paddingRight: 46 }]}
              placeholder="Mínimo 8 caracteres"
              placeholderTextColor={theme.colors.placeholder}
              value={senha}
              onChangeText={(v) => {
                setSenha(v);
                setSenhaStrength(calcStrength(v));
              }}
              secureTextEntry={!showSenha}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowSenha(!showSenha)}
            >
              <Text style={styles.eyeIcon}>{showSenha ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>

          {/* Strength bar */}
          <View style={styles.strengthBar}>
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                style={[styles.sb, { backgroundColor: getStrengthColor(i + 1) }]}
              />
            ))}
          </View>
          {senha.length > 0 && (
            <Text style={styles.strengthLabel}>{getStrengthLabel()}</Text>
          )}
        </View>

        <TouchableOpacity style={styles.btnCadastrar} onPress={handleCadastro}>
          <Text style={styles.btnCadastrarText}>CADASTRAR</Text>
        </TouchableOpacity>

        <Text style={styles.loginLink}>
          Já tem conta?{" "}
          <Text
            style={styles.loginLinkBold}
            onPress={() => router.push("/login")}
          >
            Entrar
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  /* ── Field background ── */
  fieldBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.07,
  },
  centerCircle: {
    position: "absolute",
    top: 40,
    left: "50%",
    marginLeft: -80,
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: theme.colors.fieldLine,
  },
  halfLine: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: theme.colors.fieldLine,
  },
  penaltyBox: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: -60,
    width: 120,
    height: 70,
    borderWidth: 2,
    borderColor: theme.colors.fieldLine,
    borderBottomWidth: 0,
  },

  /* ── Header ── */
  header: {
    paddingHorizontal: 22,
    paddingTop: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
  },
  logoArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoBall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ballHex: {
    width: 11,
    height: 11,
    backgroundColor: theme.colors.background,
    borderRadius: 2,
    transform: [{ rotate: "45deg" }],
  },
  appName: {
    fontSize: 24,
    color: theme.colors.white,
    fontWeight: "900",
    letterSpacing: 3,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#00e05a55",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    color: theme.colors.primary,
    fontSize: 18,
    lineHeight: 20,
  },

  /* ── Content ── */
  content: {
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 32,
    color: theme.colors.white,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 2,
  },
  sectionSub: {
    fontSize: 11,
    color: theme.colors.subtext,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 18,
  },

  /* ── Avatar ── */
  avatarRow: {
    alignItems: "center",
    marginBottom: 18,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#00e05a55",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarIcon: {
    fontSize: 24,
    opacity: 0.5,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBadgeText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: "900",
    lineHeight: 16,
  },

  /* ── Fields ── */
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.label,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  fieldInput: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: theme.colors.input,
    borderWidth: 1.5,
    borderColor: theme.colors.inputBorder,
    borderRadius: 12,
    fontSize: 14,
    color: theme.colors.white,
  },
  pwdWrap: {
    position: "relative",
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  eyeIcon: {
    fontSize: 16,
  },

  /* ── Strength ── */
  strengthBar: {
    flexDirection: "row",
    gap: 4,
    marginTop: 7,
  },
  sb: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.inputBorder,
  },
  strengthLabel: {
    fontSize: 10,
    color: theme.colors.subtext,
    marginTop: 4,
    textAlign: "right",
  },

  /* ── Divider ── */
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.cardBorder,
  },
  dividerText: {
    fontSize: 11,
    color: theme.colors.placeholder,
  },

  /* ── Social ── */
  socialRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  socBtn: {
    flex: 1,
    paddingVertical: 11,
    backgroundColor: theme.colors.input,
    borderWidth: 1.5,
    borderColor: theme.colors.inputBorder,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  socBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8ab895",
    letterSpacing: 0.5,
  },

  /* ── Button ── */
  btnCadastrar: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 14,
  },
  btnCadastrarText: {
    color: theme.colors.background,
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  loginLink: {
    textAlign: "center",
    fontSize: 12,
    color: "#2a5c35",
  },
  loginLinkBold: {
    color: theme.colors.link,
    fontWeight: "700",
  },
});
