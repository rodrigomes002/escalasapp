import { POST_MUSICA } from "@/services/ApiMusicas";
import { Musica } from "@/types/Musica";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const createMusica = async (musica: Musica) => {
  const { url, headers, body } = POST_MUSICA(musica);
  const response = await axios.post(url, body, { headers });
  return response.data;
};

export const useCreateMusica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMusica,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicas"] });
    },
  });
};
