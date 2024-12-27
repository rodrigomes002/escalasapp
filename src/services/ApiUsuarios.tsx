import { LoginFormData } from "@/types/LoginFormData.js";
import { API_URL } from "./ApiBase.js";

const url = `${API_URL}/usuarios`;

export function CREATE_USUARIO(body: LoginFormData) {
  return {
    url: `${url}/create`,
    body,
  };
}

export function LOGIN_USUARIO(body: LoginFormData) {
  return {
    url: `${url}/login`,
    body,
  };
}
