import { User } from "@/lib/generated/prisma/client";
import { api } from "@/utils/api";
import { LoginInput, RegisterInput } from "@/validators/auth.schema";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  credits: number;
  plan: string;
}

interface LoginResponse {
  message:string,
  user : AuthUser
}

interface RegisterResponse {
  message:string,
  user : AuthUser
}

export async function login(data: LoginInput) {
  return api<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerAPI(data: RegisterInput) {
  return api<RegisterResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function logout() {}

export async function getCurrentUser() {}
