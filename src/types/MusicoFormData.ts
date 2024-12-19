import { FuncaoEnum } from "@/enums/FuncaoEnum";

export interface MusicoFormData {
  id: number;
  nome: string;
  funcao: FuncaoEnum | null;
}
