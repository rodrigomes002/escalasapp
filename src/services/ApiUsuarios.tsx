import { LoginFormData } from "@/types/LoginFormData.js";
import { API_URL, POST } from "./ApiBase.js";

const url = `${API_URL}/usuarios`;

export function CREATE_POST(body: LoginFormData) {
  return POST(`${url}/create`, null, JSON.stringify(body));
}

export function LOGIN_POST(body: LoginFormData) {
  return POST(`${url}/login`, null, JSON.stringify(body));
}
