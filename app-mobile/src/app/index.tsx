import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, StatusBar } from "react-native";
import { theme } from "../../constants/theme";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* Soccer field background */}
      <View style={styles.fieldBg}>
        <View style={styles.centerCircle} />
        <View style={styles.halfLine} />
        <View style={styles.penaltyBox} />
        <View style={styles.penaltyBox2} />
        <View style={[styles.corner, { top: 30, left: 0, borderTopWidth: 0, borderLeftWidth: 0, borderBottomRightRadius: 20 }]} />
        <View style={[styles.corner, { top: 30, right: 0, borderTopWidth: 0, borderRightWidth: 0, borderBottomLeftRadius: 20 }]} />
        <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 0, borderLeftWidth: 0, borderTopRightRadius: 20 }]} />
        <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 0, borderRightWidth: 0, borderTopLeftRadius: 20 }]} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoArea}>
          <View style={styles.logoBall}>
            <View style={styles.ballHex} />
          </View>
          <Text style={styles.appName}>FUTAPP</Text>
        </View>
        <View style={styles.userBtn}>
          <Text style={styles.userIcon}>👤</Text>
        </View>
      </View>

      {/* Hero */}
      <View style={styles.heroArea}>
        <Text style={styles.heroEmoji}>⚽</Text>
        <View style={styles.tagline}>
          <Text style={styles.taglineText}>SEU JOGO,</Text>
          <Text style={styles.taglineText}>
            SUAS <Text style={styles.taglineGreen}>REGRAS</Text>
          </Text>
        </View>
      </View>

      {/* Bottom card */}
      <View style={styles.bottomCard}>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity
          style={styles.btnLogin}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.btnLoginText}>ENTRAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnCadastrar}
          onPress={() => router.push("/cadastro")}
        >
          <Text style={styles.btnCadastrarText}>CRIAR CONTA</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Ao continuar, você aceita os{" "}
          <Text style={styles.footerLink}>Termos de Uso</Text>
        </Text>
      </View>
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
    top: 55,
    left: "50%",
    marginLeft: -90,
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: theme.colors.fieldLine,
  },
  halfLine: {
    position: "absolute",
    top: 145,
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: theme.colors.fieldLine,
  },
  penaltyBox: {
    position: "absolute",
    top: 30,
    left: "50%",
    marginLeft: -65,
    width: 130,
    height: 80,
    borderWidth: 2,
    borderColor: theme.colors.fieldLine,
    borderTopWidth: 0,
  },
  penaltyBox2: {
    position: "absolute",
    bottom: 0,
    left: "50%",
    marginLeft: -65,
    width: 130,
    height: 80,
    borderWidth: 2,
    borderColor: theme.colors.fieldLine,
    borderBottomWidth: 0,
  },
  corner: {
    position: "absolute",
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: theme.colors.fieldLine,
  },

  /* ── Header ── */
  header: {
    paddingHorizontal: 20,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  ballHex: {
    width: 12,
    height: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 2,
    transform: [{ rotate: "45deg" }],
  },
  appName: {
    fontSize: 26,
    color: theme.colors.white,
    fontWeight: "900",
    letterSpacing: 3,
  },
  userBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: "#00e05a55",
    alignItems: "center",
    justifyContent: "center",
  },
  userIcon: {
    fontSize: 14,
  },

  /* ── Hero ── */
  heroArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 30,
  },
  heroEmoji: {
    fontSize: 90,
    marginBottom: 24,
  },
  tagline: {
    alignItems: "center",
  },
  taglineText: {
    fontSize: 38,
    color: theme.colors.white,
    fontWeight: "900",
    letterSpacing: 2,
    lineHeight: 46,
    textAlign: "center",
  },
  taglineGreen: {
    color: theme.colors.primary,
  },

  /* ── Bottom card ── */
  bottomCard: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1e4a2a",
  },
  dotActive: {
    width: 22,
    backgroundColor: theme.colors.primary,
  },
  btnLogin: {
    width: "100%",
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  btnLoginText: {
    color: theme.colors.background,
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 2,
  },
  btnCadastrar: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "transparent",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#00e05a55",
    alignItems: "center",
  },
  btnCadastrarText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 2,
  },
  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#2a5c35",
    marginTop: 14,
  },
  footerLink: {
    color: theme.colors.link,
  },
});
