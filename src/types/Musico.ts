import { FuncaoEnum } from "@/enums/funcao-enum";

export interface Musico {
  id: number;
  nome: string;
  funcao: FuncaoEnum | null;
}
