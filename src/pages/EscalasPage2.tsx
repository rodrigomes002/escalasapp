import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash, Music, Users, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Tipos
interface Musica {
  id: string;
  nome: string;
}

interface Participante {
  id: string;
  nome: string;
  instrumento: string;
}

interface Escala {
  id: string;
  data: string;
  turno: "MANHA" | "TARDE" | "NOITE";
  musicas: Musica[];
  participantes: Participante[];
}

interface FormEscala {
  data: string;
  turno: "MANHA" | "TARDE" | "NOITE";
  musicas: string;
  participantes: Array<{ nome: string; instrumento: string }>;
}

const formatarData = (data: string): string => {
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const date = new Date(data);
  const dia = date.getDate().toString().padStart(2, "0");
  const mes = meses[date.getMonth()];
  const ano = date.getFullYear();

  return `${dia} de ${mes} de ${ano}`;
};

const FormularioEscala = ({
  escalaParaEditar = null,
  onSubmit,
  onClose,
}: {
  escalaParaEditar?: Escala | null;
  onSubmit: (data: FormEscala) => void;
  onClose: () => void;
}) => {
  const [form, setForm] = useState<FormEscala>({
    data: escalaParaEditar?.data || new Date().toISOString().split("T")[0],
    turno: escalaParaEditar?.turno || "MANHA",
    musicas: escalaParaEditar?.musicas.map((m) => m.nome).join("\n") || "",
    participantes: escalaParaEditar?.participantes || [
      { nome: "", instrumento: "" },
    ],
  });

  const adicionarParticipante = () => {
    setForm({
      ...form,
      participantes: [...form.participantes, { nome: "", instrumento: "" }],
    });
  };

  const removerParticipante = (index: number) => {
    setForm({
      ...form,
      participantes: form.participantes.filter((_, i) => i !== index),
    });
  };

  const atualizarParticipante = (
    index: number,
    campo: "nome" | "instrumento",
    valor: string
  ) => {
    const novosParticipantes = [...form.participantes];
    novosParticipantes[index] = {
      ...novosParticipantes[index],
      [campo]: valor,
    };
    setForm({ ...form, participantes: novosParticipantes });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"
            type="date"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="turno">Turno</Label>
          <Select
            value={form.turno}
            onValueChange={(valor) =>
              setForm({ ...form, turno: valor as "MANHA" | "TARDE" | "NOITE" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MANHA">Manhã</SelectItem>
              <SelectItem value="TARDE">Tarde</SelectItem>
              <SelectItem value="NOITE">Noite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="musicas">Músicas (uma por linha)</Label>
          <textarea
            id="musicas"
            className="min-h-24 p-2 rounded-md border"
            value={form.musicas}
            onChange={(e) => setForm({ ...form, musicas: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label>Participantes</Label>
          {form.participantes.map((participante, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="Nome"
                value={participante.nome}
                onChange={(e) =>
                  atualizarParticipante(index, "nome", e.target.value)
                }
              />
              <Input
                placeholder="Instrumento"
                value={participante.instrumento}
                onChange={(e) =>
                  atualizarParticipante(index, "instrumento", e.target.value)
                }
              />
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removerParticipante(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button variant="outline" onClick={adicionarParticipante}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Participante
          </Button>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={() => onSubmit(form)}>
          {escalaParaEditar ? "Atualizar" : "Criar"} Escala
        </Button>
      </DialogFooter>
    </div>
  );
};

const EscalasPage = () => {
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [escalaParaEditar, setEscalaParaEditar] = useState<Escala | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarEscalas = async () => {
      try {
        const response = await fetch("/api/escalas");
        const data = await response.json();
        setEscalas(data);
      } catch (error) {
        console.error("Erro ao buscar escalas:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarEscalas();
  }, []);

  const handleSubmit = async (formData: FormEscala) => {
    const musicas = formData.musicas
      .split("\n")
      .filter((nome) => nome.trim())
      .map((nome) => ({ id: Date.now().toString(), nome: nome.trim() }));

    const escalaData = {
      ...formData,
      musicas,
      id: escalaParaEditar?.id || Date.now().toString(),
    };

    try {
      const url = escalaParaEditar
        ? `/api/escalas/${escalaParaEditar.id}`
        : "/api/escalas";

      const response = await fetch(url, {
        method: escalaParaEditar ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(escalaData),
      });

      const novaEscala = await response.json();

      setEscalas((escalas) =>
        escalaParaEditar
          ? escalas.map((e) => (e.id === novaEscala.id ? novaEscala : e))
          : [...escalas, novaEscala]
      );

      setModalAberto(false);
      setEscalaParaEditar(null);
    } catch (error) {
      console.error("Erro ao salvar escala:", error);
    }
  };

  const excluirEscala = async (id: string) => {
    try {
      await fetch(`/api/escalas/${id}`, { method: "DELETE" });
      setEscalas((escalas) => escalas.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Erro ao excluir escala:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciador de Escalas</h1>
        <Dialog open={modalAberto} onOpenChange={setModalAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => setEscalaParaEditar(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Escala
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {escalaParaEditar ? "Editar" : "Nova"} Escala
              </DialogTitle>
              <DialogDescription>
                {escalaParaEditar
                  ? "Edite os dados da escala."
                  : "Preencha os dados para criar uma nova escala."}
              </DialogDescription>
            </DialogHeader>
            <FormularioEscala
              escalaParaEditar={escalaParaEditar}
              onSubmit={handleSubmit}
              onClose={() => {
                setModalAberto(false);
                setEscalaParaEditar(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {escalas.map((escala) => (
          <Card key={escala.id} className="w-full">
            <CardHeader>
              <CardTitle>{formatarData(escala.data)}</CardTitle>
              <CardDescription>Turno: {escala.turno}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Music className="mr-2 h-4 w-4" />
                    <h3 className="font-semibold">Músicas</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {escala.musicas.map((musica) => (
                      <li key={musica.id}>{musica.nome}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <Users className="mr-2 h-4 w-4" />
                    <h3 className="font-semibold">Participantes</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    {escala.participantes.map((participante) => (
                      <li key={participante.id}>
                        {participante.nome} - {participante.instrumento}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEscalaParaEditar(escala);
                  setModalAberto(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                onClick={() => excluirEscala(escala.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default EscalasPage;
