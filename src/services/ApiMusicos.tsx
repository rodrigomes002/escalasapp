import { API_URL } from "./ApiBase.js";
import { Musico } from "@/types/Musico.js";

const url = `${API_URL}/musicos`;

export function GET_MUSICOS() {
  return {
    url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
  };
}

export function POST_MUSICO(body: Musico) {
  return {
    url,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
    body,
  };
}

export function DELETE_MUSICO(id: string) {
  return {
    url: `${url}/${id}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
  };
}

export function PUT_MUSICO(body: Musico, id: string) {
  return {
    url: `${url}/${id}`,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      "Content-Type": "application/json",
    },
    body,
  };
}
