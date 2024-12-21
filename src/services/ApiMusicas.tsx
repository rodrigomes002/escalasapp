import { API_URL, GET, POST, PUT, DELETE } from "./ApiBase";
import { Musica } from "@/types/Musica";

const url = `${API_URL}api/musicas`;
const token = window.localStorage.getItem("authToken");

export function MUSICAS_GET() {
  return GET(url, token);
}

export function MUSICAS_POST(body: Musica) {
  return POST(url, token, JSON.stringify(body));
}

export function MUSICAS_DELETE(id: string) {
  return DELETE(url, token, id);
}

export function MUSICAS_PUT(body: Musica, id: string) {
  return PUT(url, token, JSON.stringify(body), id);
}
