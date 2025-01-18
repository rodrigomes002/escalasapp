import { GET_MUSICAS } from "@/services/ApiMusicas";
import { FetchParams } from "@/types/FetchParams";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMusicas = async ({ pageNumber, pageSize, nome }: FetchParams) => {
  const { url, headers } = GET_MUSICAS();
  const params = nome
    ? { pageNumber, pageSize, nome }
    : { pageNumber, pageSize };
  const response = await axios.get(url, { headers, params });
  return response.data;
};

export const useMusicas = (pageNumber: number, nome: string) => {
  return useQuery({
    queryKey: ["musicas", pageNumber, nome],
    queryFn: () =>
      fetchMusicas({
        pageNumber,
        pageSize: 9,
        nome,
      }),
  });
};
