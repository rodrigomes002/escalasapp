import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarIcon, Loader2, Music, Music2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Escala } from "@/types/Escala";
import { EscalaCard } from "@/components/EscalaCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { GET_ESCALAS, POST_ESCALA, PUT_ESCALA } from "@/services/ApiEscalas";
import axios from "axios";

const EscalasPage = () => {
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpate] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<Escala>({
    id: 0,
    data: "",
    instrumental: [],
    vocal: [],
    musicasManha: [],
    musicasNoite: [],
  });

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorForm(null);
    setIsLoading(true);

    if (
      !formData.data
      //!formData.cantor ||
      //!formData.categoria ||
      //!formData.tom
    ) {
      setErrorForm("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (isUpdate) {
      const { url, headers, body } = PUT_ESCALA(
        formData,
        formData.id.toString()
      );

      const response = await axios.put(url, body, { headers: headers });
      if (!response) setErrorForm("Falha enviar dados");
      fetchEscalas();
      closeDialog();
      cleanForm();
    } else {
      const { url, headers, body } = POST_ESCALA(formData);
      const response = await axios.post(url, body, { headers: headers });

      if (!response) setErrorForm("Falha enviar dados");
      fetchEscalas();
      closeDialog();
      cleanForm();
    }
  };

  const cleanForm = () => {
    setFormData({
      id: 0,
      data: "",
      instrumental: [],
      vocal: [],
      musicasManha: [],
      musicasNoite: [],
    });

    setIsUpate(false);
    setErrorForm(null);
  };

  useEffect(() => {
    fetchEscalas();
  }, []);

  const fetchEscalas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { url, headers } = GET_ESCALAS();

      const response = await axios.get(url, {
        headers: headers,
      });

      if (!response) setError("Falha ao buscar dados");

      const result = await response.data;

      const escalasArray: Escala[] = result.map((item: Escala) => ({
        id: item.id,
        data: item.data,
        instrumental: item.instrumental,
        vocal: item.vocal,
        musicasManha: item.musicasManha,
        musicasNoite: item.musicasNoite,
      }));

      setEscalas(escalasArray);
      cleanForm();
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  //   const editEscala = (escala: Escala) => {
  //     openDialog();

  //     const form = {
  //       id: escala.id,
  //       nome: escala.nome,
  //       cantor: escala.cantor,
  //       //categoria: escala.categoria,
  //       tom: escala.tom,
  //     };

  //     setFormData(form);
  //     setIsUpate(true);
  //   };

  //   const deleteEscala = async (id: string) => {
  //     setIsLoading(true);
  //     setError(null);

  //     const { url, options } = ESCALAS_DELETE(id);
  //     const response = await fetch(url, options);
  //     if (!response.ok) setError("Falha ao atualizar dados");
  //     setIsLoading(false);
  //     fetchEscalas();
  //   };

  // Filtra músicas baseado na busca e no filtro de função
  const filteredEscalas = escalas.filter((musico) => {
    if (!date) return escalas;

    const ano = date.getFullYear();
    const mes = String(date.getMonth() + 1).padStart(2, "0"); // Meses começam do 0, então adicionamos 1
    const dia = String(date.getDate()).padStart(2, "0");
    const hora = String(date.getHours()).padStart(2, "0");
    const minuto = String(date.getMinutes()).padStart(2, "0");
    const segundo = String(date.getSeconds()).padStart(2, "0");
    const dataFormatada = `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}`;

    const matchesSearch = musico.data === dataFormatada;

    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <p className="text-muted-foreground">Lista de escalas agendadas</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date ? format(date, "PPP") : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button onClick={openDialog} disabled={isLoading}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Musicians Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEscalas.map((escala) => (
            <EscalaCard escala={escala} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredEscalas.length === 0 && (
        <div className="text-center py-12">
          <Music2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            Nenhum música encontrado
          </h3>
          <p className="text-muted-foreground">
            Tente ajustar seus filtros de busca
          </p>
        </div>
      )}

      <div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Música</DialogTitle>
              <DialogDescription>
                Adicione uma nova música ao repertório
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="data" className="text-right">
                    Data
                  </Label>
                  <Input
                    id="data"
                    name="data"
                    className="col-span-2"
                    value={formData.data}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        data: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-center">
                {errorForm && <p className="text-red-500  mb-3">{errorForm}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Music className="mr-2 h-4 w-4" />
                      Salvar
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EscalasPage;
