import { GET_MUSICOS } from "@/services/ApiMusicos";
import { FetchParams } from "@/types/FetchParams";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchMusicos = async ({ pageNumber, pageSize, nome }: FetchParams) => {
  const { url, headers } = GET_MUSICOS();
  const params = nome
    ? { pageNumber, pageSize, nome }
    : { pageNumber, pageSize };
  const response = await axios.get(url, { headers, params });
  return response.data;
};

export const useMusicos = (pageNumber: number, nome: string) => {
  return useQuery({
    queryKey: ["musicos", pageNumber, nome],
    queryFn: () =>
      fetchMusicos({
        pageNumber,
        pageSize: 9,
        nome,
      }),
  });
};
