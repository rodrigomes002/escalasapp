import { Escala } from "@/types/Escala.js";
import { API_URL } from "./ApiBase.js";

const url = `${API_URL}/escalas`;
const token = localStorage.getItem("authToken");
console.log(token);

export function GET_ESCALAS() {
  return {
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

export function POST_ESCALA(body: Escala) {
  return {
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  };
}

export function DELETE_ESCALA(id: string) {
  return {
    url: `${url}/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
}

export function PUT_ESCALA(body: Escala, id: string) {
  return {
    url: `${url}/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body,
  };
}
