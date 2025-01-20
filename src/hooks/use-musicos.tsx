import { GET_MUSICOS } from "@/services/ApiMusicos";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useMusicos = (
  pageNumber: number,
  pageSize: number,
  nome?: string
) => {
  return useQuery({
    queryKey: ["musicos", pageNumber, nome],
    queryFn: async () => {
      const { url, headers } = GET_MUSICOS();
      const params = nome
        ? { pageNumber, pageSize, nome }
        : { pageNumber, pageSize };

      const response = await axios.get(url, { headers, params });

      return response.data;
    },
  });
};
