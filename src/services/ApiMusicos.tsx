import { API_URL, GET, POST, PUT, DELETE } from "./ApiBase.js";
import { Musico } from "@/types/Musico.js";

const url = `${API_URL}/musicos`;
const token = window.localStorage.getItem("authToken");

export function MUSICOS_GET() {
  return GET(url, token);
}

export function MUSICOS_POST(body: Musico) {
  return POST(url, token, JSON.stringify(body));
}

export function MUSICOS_DELETE(id: string) {
  return DELETE(url, token, id);
}

export function MUSICOS_PUT(body: Musico, id: string) {
  return PUT(url, token, JSON.stringify(body), id);
}
