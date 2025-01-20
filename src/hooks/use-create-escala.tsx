import { POST_ESCALA } from "@/services/ApiEscalas";
import { Escala } from "@/types/Escala";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const createEscala = async (escala: Escala) => {
  const { url, headers, body } = POST_ESCALA(escala);
  const response = await axios.post(url, body, { headers });
  return response.data;
};

export const useCreateEscala = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEscala,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escalas"] });
    },
  });
};
