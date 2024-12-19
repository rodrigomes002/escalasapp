import { API_URL, GET, POST, PUT, DELETE } from "./ApiBase";

const url: string = `${API_URL}api/musicas`;
const token: string | null = window.localStorage.getItem("authToken");

export function MUSICAS_GET(): ReturnType<typeof GET> {
  return GET(url, token as string);
}

export function MUSICAS_POST(body: string): ReturnType<typeof POST> {
  return POST(url, token, body);
}

export function MUSICAS_DELETE(id: string): ReturnType<typeof DELETE> {
  return DELETE(url, token as string, id);
}

export function MUSICAS_PUT(body: string, id: string): ReturnType<typeof PUT> {
  return PUT(url, token as string, body, id);
}
