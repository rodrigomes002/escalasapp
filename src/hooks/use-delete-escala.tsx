import { DELETE_ESCALA } from "@/services/ApiEscalas";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const deleteEscala = async (id: string) => {
  const { url, headers } = DELETE_ESCALA(id);
  await axios.delete(url, { headers });
  return id;
};

export const useDeleteEscala = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEscala,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["escalas"] });
    },
  });
};
