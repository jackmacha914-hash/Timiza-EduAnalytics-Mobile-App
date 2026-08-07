import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "timiza_token";
const USER_KEY = "timiza_user";
const SCHOOL_KEY = "timiza_school";

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveUser(user: any) {
  await SecureStore.setItemAsync(
    USER_KEY,
    JSON.stringify(user)
  );
}

export async function getUser() {
  const user = await SecureStore.getItemAsync(USER_KEY);

  return user ? JSON.parse(user) : null;
}

export async function deleteUser() {
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function saveSchoolCode(code: string) {
  await SecureStore.setItemAsync(
    SCHOOL_KEY,
    code
  );
}

export async function getSchoolCode() {
  return await SecureStore.getItemAsync(
    SCHOOL_KEY
  );
}

export async function logout() {
  await clearSession();
  await deleteToken();
  await deleteUser();
  await SecureStore.deleteItemAsync(
    SCHOOL_KEY
  );
}

export async function clearSession() {
  await deleteToken();
  await deleteUser();
  await SecureStore.deleteItemAsync(
    SCHOOL_KEY
  );
}