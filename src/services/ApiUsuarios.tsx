import { LoginFormData } from "@/types/LoginFormData.js";
import { API_URL } from "./ApiBase.js";

const url = `${API_URL}/usuarios`;

export function CREATE_USUARIO(body: LoginFormData) {
  return {
    url: `${url}/create`,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };
}

export function LOGIN_USUARIO(body: LoginFormData) {
  return {
    url: `${url}/login`,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };
}

export function VALIDATE_TOKEN(body: string) {
  return {
    url: `${url}/validate`,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  };
}
