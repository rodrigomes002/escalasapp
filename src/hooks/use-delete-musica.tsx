import { DELETE_MUSICA } from "@/services/ApiMusicas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const deleteMusica = async (id: string) => {
  const { url, headers } = DELETE_MUSICA(id);
  await axios.delete(url, { headers });
  return id;
};

export const useDeleteMusica = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMusica,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicas"] });
    },
  });
};
