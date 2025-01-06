import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  Loader2,
  Music2,
  Plus,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Musica } from "@/types/Musica";
import { Musico } from "@/types/Musico";
import { FormEscala } from "@/types/FormEscala";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FuncaoEnum } from "@/enums/FuncaoEnum";
import { GET_MUSICOS } from "@/services/ApiMusicos";
import { GET_MUSICAS } from "@/services/ApiMusicas";

const EscalasPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [vocal, setVocal] = useState<Musico[]>([]);
  const [instrumental, setInstrumental] = useState<Musico[]>([]);
  const [selectedVocal, setSelectedVocal] = useState<Musico>();
  const [selectedVocals, setSelectedVocals] = useState<Musico[]>([]);
  const [selectedInstrumental, setSelectedInstrumental] = useState<Musico>();
  const [selectedInstrumentals, setSelectedInstrumentals] = useState<Musico[]>(
    []
  );
  const [musicas, setMusica] = useState<Musica[]>([]);
  const [selectedMusicaManha, setSelectedMusicaManha] = useState<Musica>();
  const [selectedMusicasManha, setSelectedMusicasManha] = useState<Musica[]>(
    []
  );
  const [selectedMusicaNoite, setSelectedMusicaNoite] = useState<Musica>();
  const [selectedMusicasNoite, setSelectedMusicasNoite] = useState<Musica[]>(
    []
  );
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpate] = useState(false);
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState<FormEscala>({
    id: 0,
    data: "",
    instrumental: [],
    vocal: [],
    musicasManha: [],
    musicasNoite: [],
  });

  const openDialog = () => setIsOpen(true);

  const handleSubmit = () => {
    const finalFormData = {
      ...formData,
      vocal: selectedVocals,
      instrumental: selectedInstrumentals,
      musicasManha: selectedMusicasManha,
      musicasNoite: selectedMusicasNoite,
    };

    setErrorForm(null);
    setIsLoading(true);

    // if (
    //   !formData.data
    //   //!formData.cantor ||
    //   //!formData.categoria ||
    //   //!formData.tom
    // ) {
    //   setErrorForm("Preencha todos os campos");
    //   setIsLoading(false);
    //   return;
    // }

    if (isUpdate) {
      const { url, headers, body } = PUT_ESCALA(
        formData,
        formData.id.toString()
      );

      axios
        .put(url, body, { headers: headers })
        .then(() => {
          cleanForm();
        })
        .catch((error: Error) => {
          setErrorForm(error.message);
        });
    } else {
      const { url, headers, body } = POST_ESCALA(finalFormData);

      axios
        .post(url, body, { headers: headers })
        .then(() => {
          cleanForm();
        })
        .catch((error: Error) => {
          setErrorForm(error.message);
        });
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
    const fetchEscalas = () => {
      setIsLoading(true);
      setError(null);
      const { url, headers } = GET_ESCALAS();

      axios
        .get(url, {
          headers: headers,
        })
        .then((response) => {
          const result = response.data;

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
        })
        .catch((error) => {
          setError(error.message);
        });
    };

    const fetchMusicos = () => {
      setIsLoading(true);
      setError(null);
      const { url, headers } = GET_MUSICOS();

      axios
        .get(url, { headers: headers })
        .then((response) => {
          const result = response.data;
          const musicosArray: Musico[] = result.map((item: Musico) => ({
            id: item.id,
            nome: item.nome,
            funcao: item.funcao,
          }));

          setVocal(musicosArray.filter((m) => m.funcao === FuncaoEnum.Vocal));
          setInstrumental(
            musicosArray.filter((m) => m.funcao !== FuncaoEnum.Vocal)
          );
          setIsLoading(false);
        })
        .catch((error: Error) => {
          setError(error.message);
        });
    };

    const fetchMusicas = () => {
      setIsLoading(true);
      setError(null);
      const { url, headers } = GET_MUSICAS();

      axios
        .get(url, { headers: headers })
        .then((response) => {
          const result = response.data;
          const musicasArray: Musica[] = result.map((item: Musica) => ({
            id: item.id,
            nome: item.nome,
            cantor: item.cantor,
            tom: item.tom,
          }));

          setMusica(musicasArray);
          setIsLoading(false);
        })
        .catch((error: Error) => {
          setError(error.message);
        });
    };

    fetchMusicos();
    fetchMusicas();
    fetchEscalas();
  }, []);

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

  const DateStep = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="data">Data do Evento</Label>
        <Input
          id="data"
          type="date"
          value={formData.data}
          onChange={(e) => setFormData({ ...formData, data: e.target.value })}
        />
      </div>
    </div>
  );

  const VocalStep = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Selecione os Vocais</Label>
        <Select
          value={selectedVocal?.id.toString()}
          onValueChange={handleSelectVocal}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione o vocal" />
          </SelectTrigger>
          <SelectContent>
            {vocal.map((musico) => (
              <SelectItem
                key={musico.id}
                value={musico.id.toString()}
                disabled={selectedVocals.some((p) => p.id === musico.id)}
              >
                {musico.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Vocal selecionado</h3>
          <div className="space-y-2">
            {selectedVocals.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhuma pessoa selecionada
              </p>
            ) : (
              selectedVocals.map((musico) => (
                <div
                  key={musico.id}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{musico.nome}</p>
                    <p className="text-sm text-gray-500">
                      {getFuncaoNome(musico.funcao)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVocal(musico.id.toString())}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const InstrumentalStep = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Selecione os Instrumentistas</Label>
        <Select
          value={selectedInstrumental?.id.toString()}
          onValueChange={handleSelectedInstrumental}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma pessoa" />
          </SelectTrigger>
          <SelectContent>
            {instrumental.map((musico) => (
              <SelectItem
                key={musico.id}
                value={musico.id.toString()}
                disabled={selectedInstrumentals.some((p) => p.id === musico.id)}
              >
                {musico.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Instrumental selecionado</h3>
          <div className="space-y-2">
            {selectedInstrumentals.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhuma pessoa selecionada
              </p>
            ) : (
              selectedInstrumentals.map((musico) => (
                <div
                  key={musico.id}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{musico.nome}</p>
                    <p className="text-sm text-gray-500">
                      {getFuncaoNome(musico.funcao)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInstrumental(musico.id.toString())}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const SongsStep = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Selecione as Músicas da manhã</Label>
        <Select
          value={selectedMusicaManha?.id.toString()}
          onValueChange={handleSelectMusicasManha}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma música" />
          </SelectTrigger>
          <SelectContent>
            {musicas.map((musica) => (
              <SelectItem
                key={musica.id}
                value={musica.id.toString()}
                disabled={selectedMusicasManha.some((p) => p.id === musica.id)}
              >
                {musica.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Músicas selecionadas</h3>
          <div className="space-y-2">
            {selectedMusicasManha.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhuma música selecionada
              </p>
            ) : (
              selectedMusicasManha.map((musica) => (
                <div
                  key={musica.id}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{musica.nome}</p>
                    <p className="text-sm text-gray-500">
                      {musica.cantor} - {musica.tom}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMusicasManha(musica.id.toString())}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const SongsStep2 = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Selecione as Músicas da noite</Label>
        <Select
          value={selectedMusicaNoite?.id.toString()}
          onValueChange={handleSelectMusicasNoite}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma música" />
          </SelectTrigger>
          <SelectContent>
            {musicas.map((musica) => (
              <SelectItem
                key={musica.id}
                value={musica.id.toString()}
                disabled={selectedMusicasNoite.some((p) => p.id === musica.id)}
              >
                {musica.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Músicas selecionadas</h3>
          <div className="space-y-2">
            {selectedMusicasNoite.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhuma música selecionada
              </p>
            ) : (
              selectedMusicasNoite.map((musica) => (
                <div
                  key={musica.id}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{musica.nome}</p>
                    <p className="text-sm text-gray-500">
                      {musica.cantor} - {musica.tom}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMusicasNoite(musica.id.toString())}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Re-use existing handler functions
  const handleSelectVocal = (musicoId: string) => {
    const musico = vocal.find((p) => p.id.toString() === musicoId);
    if (musico && !selectedVocals.find((p) => p.id.toString() === musicoId)) {
      setSelectedVocals([...selectedVocals, musico]);
    }
  };

  const removeVocal = (musicoId: string) => {
    setSelectedVocals(
      selectedVocals.filter((p) => p.id.toString() !== musicoId)
    );
  };

  const handleSelectedInstrumental = (musicoId: string) => {
    const musico = instrumental.find((p) => p.id.toString() === musicoId);
    if (
      musico &&
      !selectedInstrumentals.find((p) => p.id.toString() === musicoId)
    ) {
      setSelectedInstrumentals([...selectedInstrumentals, musico]);
    }
  };

  const removeInstrumental = (musicoId: string) => {
    setSelectedInstrumentals(
      selectedInstrumentals.filter((p) => p.id.toString() !== musicoId)
    );
  };

  const handleSelectMusicasManha = (musicaId: string) => {
    const musica = musicas.find((p) => p.id.toString() === musicaId);
    if (
      musica &&
      !selectedMusicasManha.find((p) => p.id.toString() === musicaId)
    ) {
      setSelectedMusicasManha([...selectedMusicasManha, musica]);
    }
  };

  const removeMusicasManha = (musicaId: string) => {
    setSelectedMusicasManha(
      selectedMusicasManha.filter((p) => p.id.toString() !== musicaId)
    );
  };

  const handleSelectMusicasNoite = (musicaId: string) => {
    const musica = musicas.find((p) => p.id.toString() === musicaId);
    if (
      musica &&
      !selectedMusicasNoite.find((p) => p.id.toString() === musicaId)
    ) {
      setSelectedMusicasNoite([...selectedMusicasNoite, musica]);
    }
  };

  const removeMusicasNoite = (musicaId: string) => {
    setSelectedMusicasNoite(
      selectedMusicasNoite.filter((p) => p.id.toString() !== musicaId)
    );
  };

  const getFuncaoNome = (funcao: FuncaoEnum): string => {
    return FuncaoEnum[funcao];
  };

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
              <DialogTitle>Crie a escala</DialogTitle>
              <DialogDescription>
                Selecione integrantes e músicas para montar uma escala
              </DialogDescription>
            </DialogHeader>

            {/* Step Content */}
            {currentStep === 1 && <DateStep />}
            {currentStep === 2 && <VocalStep />}
            {currentStep === 3 && <InstrumentalStep />}
            {currentStep === 4 && <SongsStep />}
            {currentStep === 5 && <SongsStep2 />}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              {currentStep < 5 ? (
                <Button onClick={nextStep}>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit}>
                  <Music2 className="h-4 w-4 mr-2" />
                  Finalizar
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EscalasPage;
