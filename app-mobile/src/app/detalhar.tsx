import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
  adicionarParticipante,
  aprovarSolicitacao,
  criarSolicitacao,
  findUserById,
  getParticipantesPorReserva,
  getReservaPorId,
  getSolicitacoesPorReserva,
  rejeitarSolicitacao,
  removerParticipante,
  temSolicitacaoPendente,
} from "../apiService/api";
import { logger } from "../utils/logger";
import { Participante, Solicitacao } from "../types/participante";
import { Reserva } from "../types/reserva";

function mostrarAlerta(titulo: string, mensagem: string) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}: ${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

function confirmarAcao(
  titulo: string,
  mensagem: string,
  onConfirmar: () => void
) {
  if (Platform.OS === "web") {
    if (window.confirm(`${titulo}: ${mensagem}`)) {
      onConfirmar();
    }
    return;
  }

  Alert.alert(titulo, mensagem, [
    { text: "Cancelar" },
    { text: "Confirmar", onPress: onConfirmar },
  ]);
}

export default function DetalhesReserva() {
  const { reservaId, usuarioId: usuarioLogado } = useLocalSearchParams();
  const router = useRouter();
  const reservaIdStr = String(reservaId || "");
  const usuarioLogadoStr = String(usuarioLogado || "");

  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [temSolicitacao, setTemSolicitacao] = useState(false);
  const [loading, setLoading] = useState(true);

  const [modalAdicionarParticipante, setModalAdicionarParticipante] =
    useState(false);
  const [nomeParticipante, setNomeParticipante] = useState("");
  const [emailParticipante, setEmailParticipante] = useState("");
  const [telefoneParticipante, setTelefoneParticipante] = useState("");
  const [observacaoParticipante, setObservacaoParticipante] = useState("");

  const ehDono = reserva?.usuarioId === usuarioLogadoStr;

  const carregarDados = useCallback(async () => {
    try {
      if (!reservaIdStr) {
        setLoading(false);
        return;
      }

      const reservaData = await getReservaPorId(reservaIdStr);
      if (!reservaData) {
        setLoading(false);
        return;
      }
      setReserva(reservaData);

      const [participantesData, solicitacoesData] = await Promise.all([
        getParticipantesPorReserva(reservaIdStr),
        getSolicitacoesPorReserva(reservaIdStr),
      ]);

      setParticipantes(participantesData);
      setSolicitacoes(solicitacoesData);

      const isOwner = reservaData.usuarioId === usuarioLogadoStr;
      if (!isOwner && usuarioLogadoStr) {
        const temPendente = await temSolicitacaoPendente(
          reservaIdStr,
          usuarioLogadoStr
        );
        setTemSolicitacao(temPendente);
      }

      setLoading(false);
    } catch (error) {
      logger.error("DetalhesReserva.carregarDados", error);
      setLoading(false);
    }
  }, [reservaIdStr, usuarioLogadoStr]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  async function handleAdicionarParticipante() {
    try {
      if (!nomeParticipante.trim()) {
        mostrarAlerta("Erro", "Preencha o nome do participante.");
        return;
      }

      if (!reservaIdStr) {
        return;
      }

      const novoParticipante: Participante = {
        reservaId: reservaIdStr,
        nome: nomeParticipante.trim(),
        email: emailParticipante.trim() || undefined,
        telefone: telefoneParticipante.trim() || undefined,
        observacao: observacaoParticipante.trim() || undefined,
        status: "APROVADO",
        dataCadastro: new Date().toISOString(),
      };

      await adicionarParticipante(novoParticipante);
      mostrarAlerta("Sucesso", "Participante adicionado com sucesso!");

      setNomeParticipante("");
      setEmailParticipante("");
      setTelefoneParticipante("");
      setObservacaoParticipante("");
      setModalAdicionarParticipante(false);

      await carregarDados();
    } catch (error) {
      logger.error("DetalhesReserva.adicionarParticipante", error);
      mostrarAlerta("Erro", "Erro ao adicionar participante. Tente novamente.");
    }
  }

  async function handleRemoverParticipante(id: string) {
    try {
      await removerParticipante(id);
      mostrarAlerta("Sucesso", "Participante removido com sucesso!");
      await carregarDados();
    } catch (error) {
      logger.error("DetalhesReserva.removerParticipante", error);
      mostrarAlerta("Erro", "Erro ao remover participante. Tente novamente.");
    }
  }

  async function handleSolicitarEntrada() {
    try {
      if (!reservaIdStr || !usuarioLogadoStr) {
        mostrarAlerta("Erro", "Faça login novamente para solicitar participação.");
        return;
      }

      const jaTemSolicitacao = await temSolicitacaoPendente(
        reservaIdStr,
        usuarioLogadoStr
      );

      if (jaTemSolicitacao) {
        setTemSolicitacao(true);
        return;
      }

      await criarSolicitacao(reservaIdStr, usuarioLogadoStr);
      mostrarAlerta(
        "Sucesso",
        "Sua solicitação foi enviada ao dono da reserva. Aguarde a aprovação."
      );
      setTemSolicitacao(true);
    } catch (error) {
      logger.error("DetalhesReserva.solicitarEntrada", error);
      mostrarAlerta("Erro", "Erro ao enviar solicitação. Tente novamente.");
    }
  }

  async function handleAprovarSolicitacao(solicitacao: Solicitacao) {
    try {
      if (!reservaIdStr || !solicitacao.id) {
        return;
      }

      const usuarioSolicitante = await findUserById(solicitacao.usuarioId);
      const nomeUsuario =
        usuarioSolicitante?.nome || `Usuário ${solicitacao.usuarioId}`;

      await aprovarSolicitacao(
        solicitacao.id,
        usuarioLogadoStr,
        reservaIdStr,
        solicitacao.usuarioId,
        nomeUsuario,
        usuarioSolicitante?.email
      );

      mostrarAlerta("Sucesso", "Solicitação aprovada com sucesso!");
      await carregarDados();
    } catch (error) {
      logger.error("DetalhesReserva.aprovarSolicitacao", error);
      mostrarAlerta("Erro", "Erro ao aprovar solicitação. Tente novamente.");
    }
  }

  async function handleRejeitarSolicitacao(solicitacao: Solicitacao) {
    try {
      if (!solicitacao.id) {
        return;
      }

      await rejeitarSolicitacao(solicitacao.id, usuarioLogadoStr);
      mostrarAlerta("Sucesso", "Solicitação rejeitada.");
      await carregarDados();
    } catch (error) {
      logger.error("DetalhesReserva.rejeitarSolicitacao", error);
      mostrarAlerta("Erro", "Erro ao rejeitar solicitação. Tente novamente.");
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!reserva) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Reserva não encontrada</Text>
      </View>
    );
  }

  const participantesAprovados = participantes.filter(
    (participante) => participante.status === "APROVADO"
  );
  const solicitacoesPendentes = solicitacoes.filter(
    (solicitacao) => solicitacao.status === "PENDENTE"
  );

  function renderParticipante({ item }: { item: Participante }) {
    return (
      <View style={styles.participanteCard}>
        <View style={styles.participanteInfo}>
          <Text style={styles.participanteNome}>{item.nome}</Text>
          {item.email && (
            <Text style={styles.participanteDetalhe}>📧 {item.email}</Text>
          )}
          {item.telefone && (
            <Text style={styles.participanteDetalhe}>📱 {item.telefone}</Text>
          )}
          {item.observacao && (
            <Text style={styles.participanteObservacao}>{item.observacao}</Text>
          )}
        </View>

        {ehDono && (
          <TouchableOpacity
            testID={`participante-remover-${item.id || "sem-id"}`}
            style={styles.btnRemover}
            onPress={() =>
              confirmarAcao("Remover", "Tem certeza que deseja remover?", () => {
                if (item.id) {
                  handleRemoverParticipante(item.id);
                }
              })
            }
          >
            <Text style={styles.btnRemoverText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function renderSolicitacao({ item }: { item: Solicitacao }) {
    return (
      <View style={styles.solicitacaoCard}>
        <View style={styles.solicitacaoInfo}>
          <Text style={styles.solicitacaoUsuario}>Usuário: {item.usuarioId}</Text>
          <Text style={styles.solicitacaoData}>
            Solicitado em: {new Date(item.dataSolicitacao).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.solicitacaoActions}>
          <TouchableOpacity
            testID={`solicitacao-aprovar-${item.id || "sem-id"}`}
            style={styles.btnAprovar}
            onPress={() => handleAprovarSolicitacao(item)}
          >
            <Text style={styles.btnAprovarText}>Aprovar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID={`solicitacao-rejeitar-${item.id || "sem-id"}`}
            style={styles.btnRejeitar}
            onPress={() => handleRejeitarSolicitacao(item)}
          >
            <Text style={styles.btnRejeitarText}>Rejeitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Detalhes da Reserva</Text>
          <Text style={styles.headerSubtitle}>{reserva.ginasioNome}</Text>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>
            <Text style={styles.infoLabelBold}>Quadra:</Text> {reserva.quadra}
          </Text>
          <Text style={styles.infoLabel}>
            <Text style={styles.infoLabelBold}>Data:</Text> {reserva.dia}
          </Text>
          <Text style={styles.infoLabel}>
            <Text style={styles.infoLabelBold}>Horário:</Text>{" "}
            {reserva.horaInicio} - {reserva.horaFim}
          </Text>
          <Text style={styles.infoLabel}>
            <Text style={styles.infoLabelBold}>Duração:</Text> {reserva.duracao} minutos
          </Text>
          <Text style={styles.infoLabel}>
            <Text style={styles.infoLabelBold}>Valor:</Text> R${" "}
            {reserva.valorTotal.toFixed(2)}
          </Text>
          {ehDono && (
            <Text style={styles.donoBadge}>
              👑 Você é o dono desta reserva
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Participantes ({participantesAprovados.length})
          </Text>
          {participantesAprovados.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum participante ainda</Text>
          ) : (
            <FlatList
              data={participantesAprovados}
              renderItem={renderParticipante}
              keyExtractor={(item) =>
                item.id || `${item.reservaId}-${item.nome}-${item.dataCadastro}`
              }
              scrollEnabled={false}
            />
          )}
        </View>

        {ehDono && (
          <>
            <TouchableOpacity
              testID="participante-abrir-modal"
              style={styles.btnAdicionar}
              onPress={() => setModalAdicionarParticipante(true)}
            >
              <Text style={styles.btnAdicionarText}>+ Adicionar Participante</Text>
            </TouchableOpacity>

            {solicitacoesPendentes.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Solicitações Pendentes ({solicitacoesPendentes.length})
                </Text>
                <FlatList
                  data={solicitacoesPendentes}
                  renderItem={renderSolicitacao}
                  keyExtractor={(item) =>
                    item.id ||
                    `${item.reservaId}-${item.usuarioId}-${item.dataSolicitacao}`
                  }
                  scrollEnabled={false}
                />
              </View>
            )}
          </>
        )}

        {!ehDono && !temSolicitacao && (
          <TouchableOpacity
            testID="solicitar-participacao"
            style={styles.btnSolicitar}
            onPress={handleSolicitarEntrada}
          >
            <Text style={styles.btnSolicitarText}>Solicitar Participação</Text>
          </TouchableOpacity>
        )}

        {!ehDono && temSolicitacao && (
          <View style={styles.aguardandoCard}>
            <Text style={styles.aguardandoText}>
              ⏳ Aguardando aprovação do dono
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={modalAdicionarParticipante}
        animationType="slide"
        transparent={false}
      >
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Adicionar Participante</Text>
            <TouchableOpacity onPress={() => setModalAdicionarParticipante(false)}>
              <Text style={styles.modalCloseBtn}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.inputLabel}>Nome *</Text>
            <TextInput
              testID="participante-nome"
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor={theme.colors.placeholder}
              value={nomeParticipante}
              onChangeText={setNomeParticipante}
            />

            <Text style={styles.inputLabel}>E-mail</Text>
            <TextInput
              testID="participante-email"
              style={styles.input}
              placeholder="email@example.com"
              placeholderTextColor={theme.colors.placeholder}
              value={emailParticipante}
              onChangeText={setEmailParticipante}
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>Telefone</Text>
            <TextInput
              testID="participante-telefone"
              style={styles.input}
              placeholder="(11) 9999-9999"
              placeholderTextColor={theme.colors.placeholder}
              value={telefoneParticipante}
              onChangeText={setTelefoneParticipante}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Observação</Text>
            <TextInput
              testID="participante-observacao"
              style={[styles.input, styles.inputTextArea]}
              placeholder="Digite uma observação (opcional)"
              placeholderTextColor={theme.colors.placeholder}
              value={observacaoParticipante}
              onChangeText={setObservacaoParticipante}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalAdicionarParticipante(false);
                  setNomeParticipante("");
                  setEmailParticipante("");
                  setTelefoneParticipante("");
                  setObservacaoParticipante("");
                }}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="participante-salvar"
                style={styles.salvarBtn}
                onPress={handleAdicionarParticipante}
              >
                <Text style={styles.salvarBtnText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: 28,
    color: theme.colors.secondary,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#AAA",
    marginTop: 5,
  },
  backBtn: {
    padding: 10,
  },
  backArrow: {
    fontSize: 24,
    color: theme.colors.secondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  errorText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  infoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoLabel: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 8,
  },
  infoLabelBold: {
    fontWeight: "bold",
    color: theme.colors.secondary,
  },
  donoBadge: {
    color: theme.colors.primary,
    fontWeight: "bold",
    marginTop: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  emptyText: {
    color: "#AAA",
    fontSize: 14,
    fontStyle: "italic",
  },
  participanteCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participanteInfo: {
    flex: 1,
  },
  participanteNome: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  participanteDetalhe: {
    fontSize: 12,
    color: "#AAA",
    marginBottom: 2,
  },
  participanteObservacao: {
    fontSize: 12,
    color: theme.colors.secondary,
    marginTop: 4,
    fontStyle: "italic",
  },
  btnRemover: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#d32f2f",
    alignItems: "center",
    justifyContent: "center",
  },
  btnRemoverText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  solicitacaoCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  solicitacaoInfo: {
    marginBottom: 12,
  },
  solicitacaoUsuario: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  solicitacaoData: {
    fontSize: 12,
    color: "#AAA",
  },
  solicitacaoActions: {
    flexDirection: "row",
    gap: 8,
  },
  btnAprovar: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  btnAprovarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  btnRejeitar: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#d32f2f",
    borderRadius: 8,
    alignItems: "center",
  },
  btnRejeitarText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  btnAdicionar: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  btnAdicionarText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  btnSolicitar: {
    backgroundColor: theme.colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  btnSolicitarText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  aguardandoCard: {
    backgroundColor: "rgba(255,193,7,0.1)",
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    alignItems: "center",
  },
  aguardandoText: {
    color: "#FFC107",
    fontSize: 14,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    color: theme.colors.secondary,
    fontWeight: "bold",
  },
  modalCloseBtn: {
    fontSize: 28,
    color: "#AAA",
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: theme.colors.label,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#FFF",
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
  },
  inputTextArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.card,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#AAA",
  },
  salvarBtn: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  salvarBtnText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#FFF",
  },
});
