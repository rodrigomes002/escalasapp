import { PUT_MUSICA } from "@/services/ApiMusicas";
import { Musica } from "@/types/Musica";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdateMusicaParams {
  musica: Musica;
  id: string;
}

const updateMusica = async ({ musica, id }: UpdateMusicaParams) => {
  const { url, headers, body } = PUT_MUSICA(musica, id);
  const response = await axios.put(url, body, { headers });
  return response.data;
};

export const useUpdateMusica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMusica,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicas"] });
    },
  });
};
