import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { logger } from "../utils/logger";
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
  adicionarReserva,
  calcularHoraFim,
  calcularValor,
  editarReserva,
  getReservasPorGinasio,
  horarioUltrapassaDia,
  removerReserva,
  verificarConflito,
} from "../apiService/api";
import { Reserva } from "../types/reserva";

const QUADRAS = ["Quadra 1", "Quadra 2", "Quadra 3"];
const DURACOES = [
  { label: "30 minutos", valor: 30 },
  { label: "1 hora", valor: 60 },
  { label: "1 hora e 30 minutos", valor: 90 },
  { label: "2 horas", valor: 120 },
  { label: "2 horas e 30 minutos", valor: 150 },
];

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

export default function Lista() {
  const { ginasioId, ginasio, usuarioId: usuarioLogado } = useLocalSearchParams();
  const router = useRouter();
  const usuarioLogadoStr = String(usuarioLogado || "");

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [modalNovaReserva, setModalNovaReserva] = useState(false);
  const [editando, setEditando] = useState<Reserva | null>(null);

  const [quadraSelecionada, setQuadraSelecionada] = useState("Quadra 1");
  const [durationSelecionada, setDurationSelecionada] = useState(30);
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [diaSelecionado, setDiaSelecionado] = useState(new Date());
  const [horaSelecionada, setHoraSelecionada] = useState("09:00");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const carregarReservas = useCallback(async () => {
    try {
      const ginasioNumerico = Number(ginasioId);

      if (Number.isNaN(ginasioNumerico)) {
        mostrarAlerta("Erro", "Ginásio inválido.");
        setReservas([]);
        return;
      }

      const data = await getReservasPorGinasio(ginasioNumerico);
      setReservas(data);
    } catch (error) {
      logger.error("Lista.carregarReservas", error);
    }
  }, [ginasioId]);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  const horaFim = calcularHoraFim(horaSelecionada, durationSelecionada);
  const valorTotal = calcularValor(durationSelecionada);

  function formatarData(data: Date): string {
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
  }

  function abrirModalNovaReserva() {
    setEditando(null);
    setQuadraSelecionada("Quadra 1");
    setDurationSelecionada(30);
    setNomeResponsavel("");
    setDiaSelecionado(new Date());
    setHoraSelecionada("09:00");
    setModalNovaReserva(true);
  }

  function abrirModalEdicao(reserva: Reserva) {
    setEditando(reserva);
    setQuadraSelecionada(reserva.quadra);
    setDurationSelecionada(reserva.duracao);
    setNomeResponsavel(reserva.nomeResponsavel);
    setHoraSelecionada(reserva.horaInicio);

    const [dia, mes, ano] = reserva.dia.split("/").map(Number);
    setDiaSelecionado(new Date(ano, mes - 1, dia));

    setModalNovaReserva(true);
  }

  async function handleSalvarReserva() {
    try {
      if (!nomeResponsavel.trim()) {
        mostrarAlerta("Erro", "Preencha o nome do responsável.");
        return;
      }

      if (!usuarioLogadoStr) {
        mostrarAlerta("Erro", "Faça login novamente para criar uma reserva.");
        return;
      }

      if (horarioUltrapassaDia(horaSelecionada, durationSelecionada)) {
        mostrarAlerta("Erro", "A reserva precisa terminar antes do fim do dia.");
        return;
      }

      const ginasioNumerico = Number(ginasioId);

      if (Number.isNaN(ginasioNumerico)) {
        mostrarAlerta("Erro", "Ginásio inválido.");
        return;
      }

      const diaFormatado = formatarData(diaSelecionado);
      const temConflito = await verificarConflito(
        ginasioNumerico,
        quadraSelecionada,
        diaFormatado,
        horaSelecionada,
        durationSelecionada,
        editando?.id
      );

      if (temConflito) {
        mostrarAlerta(
          "Horário Indisponível",
          "Esse horário já está agendado para esta quadra. Escolha outro horário."
        );
        return;
      }

      const novaReserva: Reserva = {
        ginasioId: ginasioNumerico,
        ginasioNome: String(ginasio),
        quadra: quadraSelecionada,
        nomeResponsavel: nomeResponsavel.trim(),
        dia: diaFormatado,
        horaInicio: horaSelecionada,
        duracao: durationSelecionada,
        horaFim,
        valorTotal,
        usuarioId: usuarioLogadoStr,
      };

      if (editando?.id) {
        await editarReserva(editando.id, novaReserva);
        mostrarAlerta("Sucesso", "Reserva atualizada com sucesso!");
      } else {
        await adicionarReserva(novaReserva);
        mostrarAlerta("Sucesso", "Reserva criada com sucesso!");
      }

      setModalNovaReserva(false);
      await carregarReservas();
    } catch (error) {
      logger.error("Lista.handleSalvarReserva", error);
      mostrarAlerta("Erro", "Erro ao salvar reserva. Tente novamente.");
    }
  }

  async function handleDeletarReserva(id: string) {
    try {
      await removerReserva(id);
      mostrarAlerta("Sucesso", "Reserva removida com sucesso!");
      await carregarReservas();
    } catch (error) {
      logger.error("Lista.handleDeletarReserva", error);
      mostrarAlerta("Erro", "Erro ao deletar reserva. Tente novamente.");
    }
  }

  function handleDateChange(_event: unknown, selectedDate?: Date) {
    if (selectedDate) {
      setDiaSelecionado(selectedDate);
    }
    setShowDatePicker(false);
  }

  function handleTimeChange(_event: unknown, selectedTime?: Date) {
    if (selectedTime) {
      const horas = String(selectedTime.getHours()).padStart(2, "0");
      const minutos = String(selectedTime.getMinutes()).padStart(2, "0");
      setHoraSelecionada(`${horas}:${minutos}`);
    }
    setShowTimePicker(false);
  }

  function handleWebDateChange(dateString: string) {
    const [ano, mes, dia] = dateString.split("-");
    const newDate = new Date(Number(ano), Number(mes) - 1, Number(dia));
    setDiaSelecionado(newDate);
  }

  function renderReserva({ item }: { item: Reserva }) {
    const ehDono = item.usuarioId === usuarioLogadoStr;

    return (
      <TouchableOpacity
        testID={`reserva-card-${item.id || "sem-id"}`}
        style={styles.reservaCard}
        onPress={() => {
          router.push({
            pathname: "/detalhar",
            params: {
              reservaId: item.id,
              usuarioId: usuarioLogadoStr,
            },
          });
        }}
        activeOpacity={0.7}
      >
        <View style={styles.reservaHeader}>
          <View>
            <Text style={styles.reservaQuadra}>{item.quadra}</Text>
            {ehDono && <Text style={styles.donoBadge}>👑 Sua reserva</Text>}
          </View>
          <Text style={styles.reservaDia}>{item.dia}</Text>
        </View>

        <View style={styles.reservaBody}>
          <Text style={styles.reservaLabel}>
            <Text style={styles.reservaLabelBold}>Responsável: </Text>
            {item.nomeResponsavel}
          </Text>
          <Text style={styles.reservaLabel}>
            <Text style={styles.reservaLabelBold}>Horário: </Text>
            {item.horaInicio} - {item.horaFim}
          </Text>
          <Text style={styles.reservaLabel}>
            <Text style={styles.reservaLabelBold}>Duração: </Text>
            {item.duracao} minutos
          </Text>
          <Text style={styles.reservaValor}>
            Valor: R$ {item.valorTotal.toFixed(2)}
          </Text>
        </View>

        <View style={styles.reservaFooter}>
          <Text style={styles.reservaFooterText}>Toque para ver detalhes →</Text>
        </View>

        {ehDono && (
          <View style={styles.reservaActions}>
            <TouchableOpacity
              testID={`reserva-editar-${item.id || "sem-id"}`}
              style={styles.btnEditar}
              onPress={(event) => {
                event.stopPropagation();
                abrirModalEdicao(item);
              }}
            >
              <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              testID={`reserva-deletar-${item.id || "sem-id"}`}
              style={styles.btnDeletar}
              onPress={(event) => {
                event.stopPropagation();
                confirmarAcao("Deletar", "Tem certeza que deseja deletar?", () => {
                  if (item.id) {
                    handleDeletarReserva(item.id);
                  }
                });
              }}
            >
              <Text style={styles.btnText}>Deletar</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View testID="lista-reservas" style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Reservas</Text>
          <Text style={styles.headerSubtitle}>{ginasio}</Text>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          testID="nova-reserva"
          style={styles.novaReservaBtn}
          onPress={abrirModalNovaReserva}
        >
          <Text style={styles.novaReservaBtnText}>+ Nova Reserva</Text>
        </TouchableOpacity>

        {reservas.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Nenhuma reserva ainda</Text>
          </View>
        ) : (
          <FlatList
            data={reservas}
            renderItem={renderReserva}
            keyExtractor={(item) =>
              item.id ||
              `${item.ginasioId}-${item.quadra}-${item.dia}-${item.horaInicio}`
            }
            scrollEnabled={false}
          />
        )}
      </ScrollView>

      <Modal visible={modalNovaReserva} animationType="slide" transparent={false}>
        <View style={styles.modalContainer}>
          <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editando ? "Editar Reserva" : "Nova Reserva"}
            </Text>
            <TouchableOpacity onPress={() => setModalNovaReserva(false)}>
              <Text style={styles.modalCloseBtn}>×</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Escolha sua quadra</Text>
              <View style={styles.quadrasContainer}>
                {QUADRAS.map((quadra) => (
                  <TouchableOpacity
                    key={quadra}
                    style={[
                      styles.quadraBtn,
                      quadraSelecionada === quadra && styles.quadraBtnActive,
                    ]}
                    onPress={() => setQuadraSelecionada(quadra)}
                  >
                    <Text
                      style={[
                        styles.quadraBtnText,
                        quadraSelecionada === quadra &&
                          styles.quadraBtnTextActive,
                      ]}
                    >
                      {quadra}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Duração da reserva</Text>
              <View style={styles.durationContainer}>
                {DURACOES.map((duracao) => (
                  <TouchableOpacity
                    key={duracao.valor}
                    style={[
                      styles.durationBtn,
                      durationSelecionada === duracao.valor &&
                        styles.durationBtnActive,
                    ]}
                    onPress={() => setDurationSelecionada(duracao.valor)}
                  >
                    <Text
                      style={[
                        styles.durationBtnText,
                        durationSelecionada === duracao.valor &&
                          styles.durationBtnTextActive,
                      ]}
                    >
                      {duracao.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Nome da pessoa principal</Text>
              <TextInput
                testID="reserva-responsavel"
                style={styles.input}
                placeholder="Digite o nome"
                placeholderTextColor={theme.colors.placeholder}
                value={nomeResponsavel}
                onChangeText={setNomeResponsavel}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Dia da reserva</Text>
              {Platform.OS === "web" ? (
                <input
                  type="date"
                  value={`${String(diaSelecionado.getFullYear()).padStart(4, "0")}-${String(diaSelecionado.getMonth() + 1).padStart(2, "0")}-${String(diaSelecionado.getDate()).padStart(2, "0")}`}
                  onChange={(event) => handleWebDateChange(event.target.value)}
                  style={{
                    padding: "12px 14px",
                    backgroundColor: theme.colors.card,
                    border: `1px solid ${theme.colors.inputBorder}`,
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#FFF",
                    fontFamily: "Arial",
                  } as React.CSSProperties}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.dateTimeBtn}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateTimeBtnText}>
                      📅 {formatarData(diaSelecionado)}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={diaSelecionado}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  )}
                </>
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Horário inicial</Text>
              {Platform.OS === "web" ? (
                <input
                  type="time"
                  value={horaSelecionada}
                  onChange={(event) => setHoraSelecionada(event.target.value)}
                  style={{
                    padding: "12px 14px",
                    backgroundColor: theme.colors.card,
                    border: `1px solid ${theme.colors.inputBorder}`,
                    borderRadius: "8px",
                    fontSize: "16px",
                    color: "#FFF",
                    fontFamily: "Arial",
                  } as React.CSSProperties}
                />
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.dateTimeBtn}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={styles.dateTimeBtnText}>🕐 {horaSelecionada}</Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={new Date(`2024-01-01T${horaSelecionada}:00`)}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                    />
                  )}
                </>
              )}
            </View>

            <View style={styles.resumoCard}>
              <Text style={styles.resumoTitle}>Resumo da Reserva</Text>
              <View style={styles.resumoLine}>
                <Text style={styles.resumoLabel}>Horário final:</Text>
                <Text style={styles.resumoValue}>{horaFim}</Text>
              </View>
              <View style={styles.resumoLine}>
                <Text style={styles.resumoLabel}>Duração:</Text>
                <Text style={styles.resumoValue}>{durationSelecionada} min</Text>
              </View>
              <View style={[styles.resumoLine, styles.resumoValorLine]}>
                <Text style={styles.resumoLabel}>Valor total:</Text>
                <Text style={styles.resumoValor}>
                  R$ {valorTotal.toFixed(2)}
                </Text>
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalNovaReserva(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="reserva-salvar"
                style={styles.salvarBtn}
                onPress={handleSalvarReserva}
              >
                <Text style={styles.salvarBtnText}>
                  {editando ? "Atualizar" : "Criar Reserva"}
                </Text>
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
  novaReservaBtn: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  novaReservaBtnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    color: "#AAA",
    fontSize: 16,
  },
  reservaCard: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
  },
  reservaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  reservaQuadra: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.secondary,
  },
  reservaDia: {
    fontSize: 14,
    color: "#AAA",
  },
  reservaBody: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reservaLabel: {
    color: "#FFF",
    fontSize: 14,
    marginBottom: 8,
  },
  reservaLabelBold: {
    fontWeight: "bold",
    color: theme.colors.secondary,
  },
  reservaValor: {
    fontSize: 14,
    fontWeight: "bold",
    color: theme.colors.secondary,
    marginTop: 8,
  },
  donoBadge: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "bold",
    marginTop: 4,
  },
  reservaFooter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  reservaFooterText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  reservaActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  btnEditar: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: theme.colors.primary,
  },
  btnDeletar: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#d32f2f",
  },
  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 14,
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
  formSection: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  quadrasContainer: {
    flexDirection: "row",
    gap: 10,
  },
  quadraBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.card,
    alignItems: "center",
  },
  quadraBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  quadraBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AAA",
  },
  quadraBtnTextActive: {
    color: "#FFF",
  },
  durationContainer: {
    gap: 10,
  },
  durationBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: theme.colors.card,
    alignItems: "center",
  },
  durationBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  durationBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AAA",
  },
  durationBtnTextActive: {
    color: "#FFF",
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
  dateTimeBtn: {
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder,
    alignItems: "center",
  },
  dateTimeBtnText: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "500",
  },
  resumoCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  resumoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.secondary,
    marginBottom: 12,
  },
  resumoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  resumoValorLine: {
    marginBottom: 0,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  resumoLabel: {
    fontSize: 14,
    color: "#AAA",
  },
  resumoValue: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "500",
  },
  resumoValor: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.secondary,
  },
  formActions: {
    flexDirection: "row",
    gap: 12,
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
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
});
