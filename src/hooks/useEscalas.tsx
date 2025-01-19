import { GET_ESCALAS } from "@/services/ApiEscalas";
import { Escala } from "@/types/Escala";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

export const useEscalas = () => {
  return useQuery({
    queryKey: ["escalas"],
    queryFn: async () => {
      const { url, headers } = GET_ESCALAS();

      const response: AxiosResponse<Escala> = await axios.get(url, {
        headers,
      });

      return response.data;
    },
  });
};
