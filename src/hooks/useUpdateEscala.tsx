import { PUT_ESCALA } from "@/services/ApiEscalas";
import { Escala } from "@/types/Escala";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdateEscalaParams {
  escala: Escala;
  id: string;
}

const updateEscala = async ({ escala, id }: UpdateEscalaParams) => {
  const { url, headers, body } = PUT_ESCALA(escala, id);
  const response = await axios.put(url, body, { headers });
  return response.data;
};

export const useUpdateEscala = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEscala,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escalas"] });
    },
  });
};
