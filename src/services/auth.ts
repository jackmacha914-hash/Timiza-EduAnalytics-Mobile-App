import { apiFetch } from "./api";

import {
  saveToken,
  saveUser,
  saveSchoolCode,
} from "./storage";

export async function login(
  schoolCode: string,
  email: string,
  password: string
) {
  const response = await apiFetch(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({
        schoolCode,
        email,
        password,
      }),
    }
  );

  if (!response.token) {
    throw new Error(
      "Authentication token missing."
    );
  }

  await saveToken(response.token);

  await saveUser(response.user);

  await saveSchoolCode(schoolCode);

  return response.user;
}