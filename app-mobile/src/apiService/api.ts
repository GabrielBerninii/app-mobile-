export async function loginUser(login: string, senha: string) {
  const response = await fetch(
    `http://localhost:3000/usuarios?login=${login}&senha=${senha}`
  );

  const data = await response.json();

  return data.length > 0 ? data[0] : null;
}