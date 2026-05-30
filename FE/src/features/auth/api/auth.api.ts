import { httpClient } from "@/utils/http";
import type { AuthUser } from "@/features/auth/model/auth.types";

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterResponse = LoginResponse;

/** Auth endpoints return `{ token, user }` — not the `{ data }` envelope used elsewhere. */
export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await httpClient.post<LoginResponse>("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });
  return data;
}

export async function registerApi(payload: {
  email: string;
  password: string;
  name?: string;
}): Promise<RegisterResponse> {
  const { data } = await httpClient.post<RegisterResponse>("/auth/register", {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
    name: payload.name?.trim() ?? "",
  });
  return data;
}

export async function logoutApi(): Promise<void> {
  await httpClient.post("/auth/logout");
}
