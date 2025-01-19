import { Musica } from "./Musica";

export interface ApiMusicaResponse {
  items: Musica[];
  totalCount: number;
}
