import { API_URL } from "./ApiBase.js";
import { Musica } from "@/types/Musica.js";

const url = `${API_URL}/musicas`;
const token = window.localStorage.getItem("authToken");

export function GET_MUSICAS() {
  return {
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

export function POST_MUSICA(body: Musica) {
  return {
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  };
}

export function DELETE_MUSICA(id: string) {
  return {
    url: `${url}/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

export function PUT_MUSICA(body: Musica, id: string) {
  return {
    url: `${url}/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  };
}
