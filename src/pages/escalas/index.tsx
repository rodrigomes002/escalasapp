import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Loader2, Music2, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Escala } from "@/types/Escala";
import { EscalaCard } from "@/pages/escalas/components/escala-card";
import { format } from "date-fns";
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
import { FuncaoEnum } from "@/enums/funcao-enum";
import { useEscalas } from "@/hooks/use-escalas";
import { useCreateEscala } from "@/hooks/use-create-escala";
import { useUpdateEscala } from "@/hooks/use-update-escala";
import { useDeleteEscala } from "@/hooks/use-delete-escala";
import { useMusicas } from "@/hooks/use-musicas";
import { useMusicos } from "@/hooks/use-musicos";
import PageHead from "@/components/shared/page-head";
import { months } from "@/constants/data";
import { DateStep } from "./components/date-step";

const EscalasPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedVocal, setSelectedVocal] = useState<Musico>();
  const [selectedVocals, setSelectedVocals] = useState<Musico[]>([]);
  const [selectedInstrumental, setSelectedInstrumental] = useState<Musico>();
  const [selectedInstrumentals, setSelectedInstrumentals] = useState<Musico[]>(
    []
  );
  const [selectedMusicaManha, setSelectedMusicaManha] = useState<Musica>();
  const [selectedMusicasManha, setSelectedMusicasManha] = useState<Musica[]>(
    []
  );
  const [selectedMusicaNoite, setSelectedMusicaNoite] = useState<Musica>();
  const [selectedMusicasNoite, setSelectedMusicasNoite] = useState<Musica[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState<FormEscala>({
    id: 0,
    data: "",
    instrumental: [],
    vocal: [],
    musicasManha: [],
    musicasNoite: [],
  });

  const currentMonth = months[new Date().getMonth()];
  const { data: escalaData, isLoading, error } = useEscalas();
  const { data: musicaData } = useMusicas(1, 999, "");
  const { data: musicoData } = useMusicos(1, 999, "");

  const createMutation = useCreateEscala();
  const updateMutation = useUpdateEscala();
  const deleteMutation = useDeleteEscala();

  const isLoadingMutation =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const errorMutation = createMutation.error || updateMutation.error;

  const escalas = (escalaData as Escala[] | undefined) || [];
  const musicas = musicaData?.items || [];

  const vocal =
    musicoData?.items.filter((m: Musico) => m.funcao === FuncaoEnum.Vocal) ||
    [];
  const instrumental =
    musicoData?.items.filter((m: Musico) => m.funcao !== FuncaoEnum.Vocal) ||
    [];

  const openDialog = (isUpdate: boolean) => {
    if (!isUpdate) reset();

    setIsUpdate(isUpdate);
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  const handleSubmit = () => {
    const finalFormData = {
      ...formData,
      vocal: selectedVocals,
      instrumental: selectedInstrumentals,
      musicasManha: selectedMusicasManha,
      musicasNoite: selectedMusicasNoite,
    };

    isUpdate
      ? updateMutation.mutate(
          { escala: finalFormData, id: formData.id.toString() },
          {
            onSuccess: () => {
              reset();
              closeDialog();
            },
          }
        )
      : createMutation.mutate(finalFormData, {
          onSuccess: () => {
            reset();
            closeDialog();
          },
        });
  };

  const editEscala = (escala: Escala) => {
    setSelectedInstrumentals(escala.instrumental);
    setSelectedVocals(escala.vocal);
    setSelectedMusicasManha(escala.musicasManha);
    setSelectedMusicasNoite(escala.musicasNoite);

    setFormData({
      id: escala.id,
      data: format(escala.data, "yyyy-MM-dd"),
      vocal: selectedVocals,
      instrumental: selectedInstrumentals,
      musicasManha: selectedMusicasManha,
      musicasNoite: selectedMusicasNoite,
    });

    setErrorMessage(null);
    openDialog(true);
  };

  const deleteEscala = (escala: Escala) => {
    deleteMutation.mutate(escala.id.toString());
  };

  const reset = () => {
    setCurrentStep(1);
    setSelectedInstrumentals([]);
    setSelectedVocals([]);
    setSelectedMusicasManha([]);
    setSelectedMusicasNoite([]);

    setFormData({
      id: 0,
      data: "",
      instrumental: [],
      vocal: [],
      musicasManha: [],
      musicasNoite: [],
    });

    setIsUpdate(false);
    setErrorMessage(null);
  };

  const handleDate = (value: string) => {
    setErrorMessage(null);

    const [day, month, year] = value.split("/");
    const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;

    setFormData({
      ...formData,
      data: formattedDate,
    });
  };

  const VocalStep = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Vocal</Label>
        <Select
          value={selectedVocal?.id.toString()}
          onValueChange={handleSelectVocal}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {vocal.map((musico: Musico, index: string) => (
              <SelectItem
                key={index}
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
              <p className="text-sm text-gray-500">Ninguém selecionado</p>
            ) : (
              selectedVocals.map((musico, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg"
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
        <Label>Instrumental</Label>
        <Select
          value={selectedInstrumental?.id.toString()}
          onValueChange={handleSelectedInstrumental}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {instrumental.map((musico: Musico, index: string) => (
              <SelectItem
                key={index}
                value={musico.id.toString()}
                disabled={selectedInstrumentals.some((p) => p.id === musico.id)}
              >
                {musico.nome} - {getFuncaoNome(musico.funcao)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Instrumental selecionado</h3>
          <div className="space-y-2">
            {selectedInstrumentals.length === 0 ? (
              <p className="text-sm text-gray-500">Ninguém selecionado</p>
            ) : (
              selectedInstrumentals.map((musico, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg"
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

  const MorningSongsStep = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Músicas manhã</Label>
        <Select
          value={selectedMusicaManha?.id.toString()}
          onValueChange={handleSelectMusicasManha}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma música" />
          </SelectTrigger>
          <SelectContent>
            {musicas.map((musica: Musica, index) => (
              <SelectItem
                key={index}
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
              selectedMusicasManha.map((musica, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg"
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

  const NightSongsStep = () => (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label>Músicas noite</Label>
        <Select
          value={selectedMusicaNoite?.id.toString()}
          onValueChange={handleSelectMusicasNoite}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma música" />
          </SelectTrigger>
          <SelectContent>
            {musicas.map((musica, index) => (
              <SelectItem
                key={index}
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
              selectedMusicasNoite.map((musica, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-lg"
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
    if (!formData.data && currentStep == 1) {
      setErrorMessage("Preencha uma data");
      return;
    }

    if (selectedVocals.length < 2 && currentStep == 2) {
      setErrorMessage("Selecione pelo menos 2 pessoas para o vocal");
      return;
    }

    if (selectedInstrumentals.length < 3 && currentStep == 3) {
      setErrorMessage("Selecione pelo menos 3 pessoas para o instrumental");
      return;
    }

    setErrorMessage(null);

    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Re-use existing handler functions
  const handleSelectVocal = (musicoId: string) => {
    setErrorMessage(null);
    const musico = vocal.find((p: Musico) => p.id.toString() === musicoId);
    if (musico && !selectedVocals.find((p) => p.id.toString() === musicoId)) {
      setSelectedVocals([...selectedVocals, musico]);
      setSelectedVocal(musico);
    }
  };

  const removeVocal = (musicoId: string) => {
    setSelectedVocals(
      selectedVocals.filter((p) => p.id.toString() !== musicoId)
    );
  };

  const handleSelectedInstrumental = (musicoId: string) => {
    setErrorMessage(null);
    const musico = instrumental.find(
      (p: Musico) => p.id.toString() === musicoId
    );
    if (
      musico &&
      !selectedInstrumentals.find((p) => p.id.toString() === musicoId)
    ) {
      setSelectedInstrumentals([...selectedInstrumentals, musico]);
      setSelectedInstrumental(musico);
    }
  };

  const removeInstrumental = (musicoId: string) => {
    setSelectedInstrumentals(
      selectedInstrumentals.filter((p) => p.id.toString() !== musicoId)
    );
  };

  const handleSelectMusicasManha = (musicaId: string) => {
    setErrorMessage(null);
    const musica = musicas.find((p) => p.id.toString() === musicaId);
    if (
      musica &&
      !selectedMusicasManha.find((p) => p.id.toString() === musicaId)
    ) {
      setSelectedMusicasManha([...selectedMusicasManha, musica]);
      setSelectedMusicaManha(musica);
    }
  };

  const removeMusicasManha = (musicaId: string) => {
    setSelectedMusicasManha(
      selectedMusicasManha.filter((p) => p.id.toString() !== musicaId)
    );
  };

  const handleSelectMusicasNoite = (musicaId: string) => {
    setErrorMessage(null);
    const musica = musicas.find((p) => p.id.toString() === musicaId);
    if (
      musica &&
      !selectedMusicasNoite.find((p) => p.id.toString() === musicaId)
    ) {
      setSelectedMusicasNoite([...selectedMusicasNoite, musica]);
      setSelectedMusicaNoite(musica);
    }
  };

  const removeMusicasNoite = (musicaId: string) => {
    setSelectedMusicasNoite(
      selectedMusicasNoite.filter((p) => p.id.toString() !== musicaId)
    );
  };

  const getFuncaoNome = (funcao: FuncaoEnum | null): string => {
    if (funcao) return FuncaoEnum[funcao];

    return "";
  };

  return (
    <>
      <PageHead title="Escalas | App" />
      <div className="max-h-screen flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Escalas de {currentMonth}
          </h2>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => openDialog(false)} disabled={isLoading}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center">
          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{(error as Error).message}</AlertDescription>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
              {escalas.map((escala: Escala) => (
                <EscalaCard
                  key={escala.id}
                  escala={escala}
                  loading={isLoadingMutation}
                  editEscala={editEscala}
                  deleteEscala={deleteEscala}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && escalas.length === 0 && (
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
                  <DialogTitle>
                    {isUpdate ? "Edite a escala" : "Crie a Escala"}
                  </DialogTitle>
                  <DialogDescription>
                    Selecione integrantes e músicas para montar uma escala
                  </DialogDescription>
                </DialogHeader>

                {/* Step Content */}
                {currentStep === 1 && (
                  <DateStep formData={formData} handleDate={handleDate} />
                )}
                {currentStep === 2 && <VocalStep />}
                {currentStep === 3 && <InstrumentalStep />}
                {currentStep === 4 && <MorningSongsStep />}
                {currentStep === 5 && <NightSongsStep />}

                <div className="flex justify-center">
                  {errorMessage && (
                    <p className="text-red-500  mb-3">{errorMessage}</p>
                  )}
                  {errorMutation && (
                    <p className="text-red-500 mt-3">
                      {(errorMutation as Error).message}
                    </p>
                  )}
                </div>

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
                      Salvar
                    </Button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
};

export default EscalasPage;
