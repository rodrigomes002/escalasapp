import { Escala } from "@/types/Escala.js";
import { API_URL, GET, POST, PUT, DELETE } from "./ApiBase.js";

const url = `${API_URL}/escalas`;
const token = window.localStorage.getItem("authToken");

export function ESCALAS_GET() {
  return GET(url, token);
}

export function ESCALAS_POST(body: Escala) {
  return POST(url, token, JSON.stringify(body));
}

export function ESCALAS_DELETE(id: string) {
  return DELETE(url, token, id);
}

export function ESCALAS_PUT(body: Escala, id: string) {
  return PUT(url, token, JSON.stringify(body), id);
}
