import { POST_MUSICO } from "@/services/ApiMusicos";
import { Musico } from "@/types/Musico";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const createMusico = async (musico: Musico) => {
  const { url, headers, body } = POST_MUSICO(musico);
  const response = await axios.post(url, body, { headers });
  return response.data;
};

export const useCreateMusico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMusico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicos"] });
    },
  });
};
