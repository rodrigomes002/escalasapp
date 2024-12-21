import { FuncaoEnum } from "@/enums/FuncaoEnum";

export interface Musico {
  id: number;
  nome: string;
  funcao: FuncaoEnum | null;
}
