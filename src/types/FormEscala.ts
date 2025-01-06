import { Musica } from "./Musica";
import { Musico } from "./Musico";

export interface FormEscala {
  id: number;
  data: string;
  instrumental: Musico[];
  vocal: Musico[];
  musicasManha: Musica[];
  musicasNoite: Musica[];
}
