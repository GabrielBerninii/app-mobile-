import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { theme } from "../../constants/theme";
import {
  getAlunos,
  adicionarAluno,
  editarAluno,
  removerAluno,
  togglePagamento,
} from "../apiService/api";

interface Aluno {
  id?: string;
  nomeAluno: string;
  nomeMae: string;
  idade: string;
  endereco: string;
  dataNascimento: string;
  valor: number;
  pago: boolean;
}

function mostrarAlerta(titulo: string, mensagem: string) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}: ${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

const FORM_VAZIO = {
  nomeAluno: "",
  nomeMae: "",
  idade: "",
  endereco: "",
  dataNascimento: "",
};

export default function Lista() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editando, setEditando] = useState<Aluno | null>(null);

  const [nomeAluno, setNomeAluno] = useState("");
  const [nomeMae, setNomeMae] = useState("");
  const [idade, setIdade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");

  async function carregarAlunos() {
    try {
      const data = await getAlunos();
      setAlunos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log(error);
    }
  }

  function abrirModalNovo() {
    setEditando(null);
    setNomeAluno("");
    setNomeMae("");
    setIdade("");
    setEndereco("");
    setDataNascimento("");
    setModalVisible(true);
  }

  function abrirModalEditar(aluno: Aluno) {
    setEditando(aluno);
    setNomeAluno(aluno.nomeAluno);
    setNomeMae(aluno.nomeMae);
    setIdade(aluno.idade);
    setEndereco(aluno.endereco);
    setDataNascimento(aluno.dataNascimento);
    setModalVisible(true);
  }

  async function handleSalvar() {
    if (!nomeAluno || !nomeMae || !idade || !endereco || !dataNascimento) {
      mostrarAlerta("Atenção", "Preencha todos os campos.");
      return;
    }
    try {
      if (editando?.id) {
        await editarAluno(editando.id, {
          nomeAluno,
          nomeMae,
          idade,
          endereco,
          dataNascimento,
          valor: 250,
          pago: editando.pago,
        });
        mostrarAlerta("Sucesso", "Aluno atualizado!");
      } else {
        await adicionarAluno({
          nomeAluno,
          nomeMae,
          idade,
          endereco,
          dataNascimento,
          valor: 250,
          pago: false,
        });
        mostrarAlerta("Sucesso", "Aluno cadastrado!");
      }
      setModalVisible(false);
      carregarAlunos();
    } catch (error) {
      mostrarAlerta("Erro", "Não foi possível salvar.");
      console.log(error);
    }
  }

  async function handleTogglePago(aluno: Aluno) {
    if (!aluno.id) return;
    try {
      await togglePagamento(aluno.id, !aluno.pago);
      carregarAlunos();
    } catch (error) {
      mostrarAlerta("Erro", "Não foi possível atualizar pagamento.");
    }
  }

  async function handleRemover(id?: string) {
    if (!id) return;
    try {
      await removerAluno(id);
      carregarAlunos();
    } catch (error) {
      mostrarAlerta("Erro", "Não foi possível remover.");
    }
  }

  function formatarData(valor: string) {
    const nums = valor.replace(/\D/g, "").slice(0, 8);
    if (nums.length <= 2) return nums;
    if (nums.length <= 4) return `${nums.slice(0, 2)}/${nums.slice(2)}`;
    return `${nums.slice(0, 2)}/${nums.slice(2, 4)}/${nums.slice(4)}`;
  }

  useEffect(() => {
    carregarAlunos();
  }, []);

  const totalPago = alunos.filter((a) => a.pago).length;
  const totalPendente = alunos.filter((a) => !a.pago).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      {/* Field background */}
      <View style={styles.fieldBg}>
        <View style={styles.centerCircle} />
        <View style={styles.halfLine} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>ESCOLINHA</Text>
          <Text style={styles.pageSub}>DE FUTEBOL</Text>
        </View>
        <View style={styles.logoBall}>
          <View style={styles.ballHex} />
        </View>
      </View>

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{alunos.length}</Text>
          <Text style={styles.statLabel}>Alunos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: theme.colors.primary }]}>{totalPago}</Text>
          <Text style={styles.statLabel}>Pagos</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: "#e74c3c" }]}>{totalPendente}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>R$ {(totalPago * 250).toLocaleString("pt-BR")}</Text>
          <Text style={styles.statLabel}>Recebido</Text>
        </View>
      </View>

      {/* List */}
      {alunos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>⚽</Text>
          <Text style={styles.emptyText}>Nenhum aluno cadastrado</Text>
          <Text style={styles.emptySubtext}>Toque no botão + para adicionar</Text>
        </View>
      ) : (
        <FlatList
          data={alunos}
          keyExtractor={(item, index) => item.id ?? String(index)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={[styles.card, item.pago && styles.cardPago]}>
              {/* Número */}
              <View style={styles.cardLeft}>
                <View style={[styles.cardNumber, item.pago && styles.cardNumberPago]}>
                  <Text style={styles.cardNumberText}>{index + 1}</Text>
                </View>
              </View>

              {/* Info */}
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{item.nomeAluno}</Text>
                <Text style={styles.cardInfo}>👩 {item.nomeMae}</Text>
                <Text style={styles.cardInfo}>📅 {item.dataNascimento} · {item.idade} anos</Text>
                <Text style={styles.cardInfo}>📍 {item.endereco}</Text>

                {/* Botão pago/pendente */}
                <TouchableOpacity
                  style={[styles.pagoBadge, item.pago ? styles.pagoBadgePago : styles.pagoBadgePendente]}
                  onPress={() => handleTogglePago(item)}
                >
                  <Text style={[styles.pagoBadgeText, item.pago ? styles.pagoBadgeTextPago : styles.pagoBadgeTextPendente]}>
                    {item.pago ? "✓ PAGO R$ 250" : "✕ PENDENTE R$ 250"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Ações */}
              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => abrirModalEditar(item)}
                >
                  <Text style={styles.editBtnText}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemover(item.id)}
                >
                  <Text style={styles.removeBtnText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={abrirModalNovo}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editando ? "EDITAR ALUNO" : "NOVO ALUNO"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.valorBadge}>
                <Text style={styles.valorBadgeText}>⚽ Mensalidade: R$ 250,00</Text>
              </View>

              <Text style={styles.inputLabel}>👦 NOME DA CRIANÇA</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                placeholderTextColor={theme.colors.placeholder}
                value={nomeAluno}
                onChangeText={setNomeAluno}
              />

              <Text style={styles.inputLabel}>👩 NOME DA MÃE</Text>
              <TextInput
                style={styles.input}
                placeholder="Nome completo da mãe"
                placeholderTextColor={theme.colors.placeholder}
                value={nomeMae}
                onChangeText={setNomeMae}
              />

              <Text style={styles.inputLabel}>🎂 IDADE</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: 8"
                placeholderTextColor={theme.colors.placeholder}
                value={idade}
                onChangeText={setIdade}
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>📅 DATA DE NASCIMENTO</Text>
              <TextInput
                style={styles.input}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={theme.colors.placeholder}
                value={dataNascimento}
                onChangeText={(v) => setDataNascimento(formatarData(v))}
                keyboardType="numeric"
                maxLength={10}
              />

              <Text style={styles.inputLabel}>📍 ENDEREÇO</Text>
              <TextInput
                style={styles.input}
                placeholder="Rua, número, bairro"
                placeholderTextColor={theme.colors.placeholder}
                value={endereco}
                onChangeText={setEndereco}
              />

              <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
                <Text style={styles.btnSalvarText}>
                  {editando ? "SALVAR ALTERAÇÕES" : "CADASTRAR ALUNO"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },

  fieldBg: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.06 },
  centerCircle: {
    position: "absolute", top: 30, left: "50%", marginLeft: -80,
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 2, borderColor: theme.colors.fieldLine,
  },
  halfLine: {
    position: "absolute", top: 110, left: 0, right: 0,
    height: 1.5, backgroundColor: theme.colors.fieldLine,
  },

  header: {
    paddingHorizontal: 22, paddingTop: 52, paddingBottom: 16,
    flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end",
  },
  pageTitle: { fontSize: 32, color: theme.colors.white, fontWeight: "900", letterSpacing: 2, lineHeight: 36 },
  pageSub: { fontSize: 14, color: theme.colors.primary, fontWeight: "700", letterSpacing: 3 },
  logoBall: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center",
  },
  ballHex: {
    width: 16, height: 16, backgroundColor: theme.colors.background,
    borderRadius: 3, transform: [{ rotate: "45deg" }],
  },

  statsBar: {
    flexDirection: "row", marginHorizontal: 22, marginBottom: 18,
    backgroundColor: theme.colors.input, borderRadius: 14,
    borderWidth: 1.5, borderColor: theme.colors.inputBorder,
    padding: 14, alignItems: "center",
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { fontSize: 18, color: theme.colors.white, fontWeight: "900" },
  statValue: { fontSize: 13, color: theme.colors.primary, fontWeight: "900" },
  statLabel: { fontSize: 10, color: theme.colors.subtext, fontWeight: "600", marginTop: 2, textTransform: "uppercase" },
  statDivider: { width: 1, height: 32, backgroundColor: theme.colors.inputBorder },

  emptyState: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 80 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyText: { fontSize: 16, color: theme.colors.white, fontWeight: "700", marginBottom: 6 },
  emptySubtext: { fontSize: 13, color: theme.colors.subtext },

  listContent: { paddingHorizontal: 22, paddingBottom: 100 },

  card: {
    flexDirection: "row", backgroundColor: theme.colors.input,
    borderRadius: 14, borderWidth: 1.5, borderColor: theme.colors.inputBorder,
    marginBottom: 12, overflow: "hidden",
  },
  cardPago: { borderColor: "#1a5c2a" },

  cardLeft: {
    width: 44, backgroundColor: "#0a2010",
    alignItems: "center", justifyContent: "center",
  },
  cardNumber: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: "#2a4a30", alignItems: "center", justifyContent: "center",
  },
  cardNumberPago: { backgroundColor: theme.colors.primary },
  cardNumberText: { fontSize: 11, fontWeight: "900", color: theme.colors.white },

  cardBody: { flex: 1, padding: 12, gap: 2 },
  cardName: { fontSize: 15, color: theme.colors.white, fontWeight: "800", marginBottom: 2 },
  cardInfo: { fontSize: 11, color: "#6aac78", fontWeight: "500" },

  pagoBadge: {
    marginTop: 8, paddingVertical: 5, paddingHorizontal: 10,
    borderRadius: 8, alignSelf: "flex-start", borderWidth: 1.5,
  },
  pagoBadgePago: { backgroundColor: "#0a2e14", borderColor: theme.colors.primary },
  pagoBadgePendente: { backgroundColor: "#2e0a0a", borderColor: "#e74c3c" },
  pagoBadgeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.5 },
  pagoBadgeTextPago: { color: theme.colors.primary },
  pagoBadgeTextPendente: { color: "#e74c3c" },

  cardActions: {
    paddingHorizontal: 8, paddingVertical: 12,
    justifyContent: "space-between", alignItems: "center", gap: 8,
  },
  editBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "#0d2a3a", alignItems: "center", justifyContent: "center",
  },
  editBtnText: { fontSize: 14 },
  removeBtn: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: "#3a0a0a", alignItems: "center", justifyContent: "center",
  },
  removeBtnText: { fontSize: 14 },

  fab: {
    position: "absolute", bottom: 28, right: 22,
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: theme.colors.primary,
    alignItems: "center", justifyContent: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
  fabText: { fontSize: 30, color: theme.colors.background, fontWeight: "300", lineHeight: 34 },

  modalOverlay: { flex: 1, backgroundColor: "#000000aa", justifyContent: "flex-end" },
  modalBox: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, borderWidth: 1.5, borderColor: theme.colors.inputBorder,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 16,
  },
  modalTitle: { fontSize: 24, color: theme.colors.white, fontWeight: "900", letterSpacing: 2 },
  modalClose: { fontSize: 18, color: theme.colors.subtext, fontWeight: "700", padding: 4 },

  valorBadge: {
    backgroundColor: "#0a2e14", borderWidth: 1.5, borderColor: theme.colors.primary,
    borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14,
    marginBottom: 18, alignItems: "center",
  },
  valorBadgeText: { color: theme.colors.primary, fontWeight: "800", fontSize: 14 },

  inputLabel: {
    fontSize: 11, fontWeight: "700", color: theme.colors.label,
    letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6,
  },
  input: {
    width: "100%", paddingHorizontal: 16, paddingVertical: 13,
    backgroundColor: theme.colors.input, borderWidth: 1.5,
    borderColor: theme.colors.inputBorder, borderRadius: 12,
    fontSize: 14, color: theme.colors.white, marginBottom: 14,
  },
  btnSalvar: {
    width: "100%", paddingVertical: 15, backgroundColor: theme.colors.primary,
    borderRadius: 16, alignItems: "center", marginTop: 4, marginBottom: 8,
  },
  btnSalvarText: { color: theme.colors.background, fontWeight: "900", fontSize: 15, letterSpacing: 2 },
});
