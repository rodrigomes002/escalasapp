import React from "react";
import { Music, Mic, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Musica {
  id: number;
  nome: string;
  cantor: string;
  tom: string;
}

interface Membro {
  id: number;
  nome: string;
  funcao: number;
}

interface EscalaData {
  data: string;
  instrumental: Membro[];
  vocal: Membro[];
  musicasManha: Musica[];
  musicasNoite: Musica[];
}

const EscalaCard = ({ escala }: { escala: EscalaData }) => {
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

// Componente de exemplo com dados
export default function ExemploEscala() {
  const dados = [
    {
      data: "2024-12-08T00:00:00",
      instrumental: [
        { id: 0, nome: "Rodrigo", funcao: 4 },
        { id: 0, nome: "João", funcao: 4 },
        { id: 0, nome: "Yasmin", funcao: 4 },
        { id: 0, nome: "Miguel", funcao: 4 },
      ],
      vocal: [
        { id: 0, nome: "Matheus", funcao: 1 },
        { id: 0, nome: "Camila", funcao: 1 },
        { id: 0, nome: "Daniele", funcao: 1 },
        { id: 0, nome: "Maria", funcao: 1 },
      ],
      musicasManha: [
        { id: 0, nome: "Deus é Bom", cantor: "string", tom: "string" },
        { id: 0, nome: "A benção", cantor: "string", tom: "string" },
        { id: 0, nome: "Na casa", cantor: "string", tom: "string" },
      ],
      musicasNoite: [
        { id: 0, nome: "Deus é Bom", cantor: "string", tom: "string" },
        { id: 0, nome: "A benção", cantor: "string", tom: "string" },
        { id: 0, nome: "Na casa", cantor: "string", tom: "string" },
        {
          id: 0,
          nome: "Cancão do apocalipse",
          cantor: "string",
          tom: "string",
        },
      ],
    },
  ];

  return (
    <div className="p-4">
      <EscalaCard escala={dados[0]} />
    </div>
  );
}
