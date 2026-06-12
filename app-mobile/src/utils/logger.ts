const CAMPOS_SENSIVEIS = ["senha", "password", "token", "secret", "email", "telefone", "phone", "cpf"];

function sanitizarMensagem(msg: string): string {
  let resultado = msg;
  CAMPOS_SENSIVEIS.forEach((campo) => {
    resultado = resultado.replace(
      new RegExp(`"${campo}"\\s*:\\s*"[^"]*"`, "gi"),
      `"${campo}":"[REDACTED]"`
    );
  });
  return resultado;
}

export const logger = {
  error: (contexto: string, error: unknown): void => {
    if (!__DEV__) return;
    const msg = error instanceof Error
      ? sanitizarMensagem(error.message)
      : String(error);
    console.error(`[${contexto}]`, msg);
  },
  warn: (contexto: string, msg: string): void => {
    if (!__DEV__) return;
    console.warn(`[${contexto}]`, msg);
  },
};
