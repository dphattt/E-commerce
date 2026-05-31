import { httpClient } from "@/utils/http";
import type { AuthUser } from "@/features/auth/model/auth.types";

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export type RegisterResponse = LoginResponse;
export type ForgotPasswordResponse = {
  message: string;
  resetToken?: string;
  resetUrl?: string;
};

export type ResetPasswordResponse = {
  message: string;
};

/** Auth endpoints return `{ token, user }`, not the `{ data }` envelope used elsewhere. */
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

export async function meApi(): Promise<AuthUser> {
  const { data } = await httpClient.get<{ user: AuthUser }>("/users/me");
  return data.user;
}

export async function forgotPasswordApi(
  email: string,
): Promise<ForgotPasswordResponse> {
  const { data } = await httpClient.post<ForgotPasswordResponse>(
    "/auth/forgot-password",
    { email: email.trim().toLowerCase() },
  );
  return data;
}

export async function resetPasswordApi(
  token: string,
  password: string,
): Promise<ResetPasswordResponse> {
  const { data } = await httpClient.post<ResetPasswordResponse>(
    "/auth/reset-password",
    { token, password },
  );
  return data;
}
