import { Musica } from "./Musica";
import { Musico } from "./Musico";

export interface Escala {
  id: number;
  data: string;
  instrumental: Musico[];
  vocal: Musico[];
  musicasManha: Musica[];
  musicasNoite: Musica[];
}
