import { Music, Mic, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Escala } from "@/types/Escala";

export const EscalaCard = ({ escala }: { escala: Escala }) => {
  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold capitalize">
          {formatarData(escala.data)}
        </CardTitle>
        <CardDescription>Escala de Louvor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Equipe */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Equipe
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Vocal */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Mic className="h-4 w-4" />
                Vocal
              </h4>
              <ul className="list-disc list-inside">
                {escala.vocal.map((membro, index) => (
                  <li key={`${membro.id}-${index}`} className="text-sm">
                    {membro.nome}
                  </li>
                ))}
              </ul>
            </div>
            {/* Instrumental */}
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Music className="h-4 w-4" />
                Instrumental
              </h4>
              <ul className="list-disc list-inside">
                {escala.instrumental.map((membro, index) => (
                  <li key={`${membro.id}-${index}`} className="text-sm">
                    {membro.nome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Músicas */}
        <div className="space-y-4">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Music className="h-5 w-5" />
              Repertório
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Músicas Manhã */}
            <div className="space-y-2">
              <h4 className="font-medium">Manhã</h4>
              <ul className="space-y-1">
                {escala.musicasManha.map((musica, index) => (
                  <li key={`${musica.id}-${index}`} className="text-sm">
                    {index + 1}. {musica.nome}
                  </li>
                ))}
              </ul>
            </div>
            {/* Músicas Noite */}
            <div className="space-y-2">
              <h4 className="font-medium">Noite</h4>
              <ul className="space-y-1">
                {escala.musicasNoite.map((musica, index) => (
                  <li key={`${musica.id}-${index}`} className="text-sm">
                    {index + 1}. {musica.nome}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
