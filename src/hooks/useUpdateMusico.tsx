import { PUT_MUSICO } from "@/services/ApiMusicos";
import { Musico } from "@/types/Musico";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface UpdateMusicoParams {
  musico: Musico;
  id: string;
}

const updateMusico = async ({ musico, id }: UpdateMusicoParams) => {
  const { url, headers, body } = PUT_MUSICO(musico, id);
  const response = await axios.put(url, body, { headers });
  return response.data;
};

export const useUpdateMusico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMusico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicos"] });
    },
  });
};
