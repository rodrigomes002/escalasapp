import { DELETE_MUSICO } from "@/services/ApiMusicos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const deleteMusico = async (id: string) => {
  const { url, headers } = DELETE_MUSICO(id);
  await axios.delete(url, { headers });
  return id;
};

export const useDeleteMusico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMusico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["musicos"] });
    },
  });
};
