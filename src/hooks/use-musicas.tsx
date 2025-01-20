import { GET_MUSICAS } from "@/services/ApiMusicas";
import { ApiMusicaResponse } from "@/types/ApiMusicaResponse";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";

export const useMusicas = (
  pageNumber: number,
  pageSize: number,
  nome?: string
) => {
  return useQuery({
    queryKey: ["musicas", pageNumber, pageSize, nome],
    queryFn: async () => {
      const { url, headers } = GET_MUSICAS();
      const params = nome
        ? { pageNumber, pageSize, nome }
        : { pageNumber, pageSize };

      const response: AxiosResponse<ApiMusicaResponse> = await axios.get(url, {
        headers,
        params,
      });

      return response.data;
    },
  });
};
