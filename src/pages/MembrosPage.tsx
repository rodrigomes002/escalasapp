import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Music2, Plus, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MUSICOS_GET, MUSICOS_POST } from "@/services/ApiMusicos";
import { Label } from "@/components/ui/label";
import { MusicoFormData } from "@/types/MusicoFormData";
import { Musico } from "@/types/Musico";
import { FuncaoEnum } from "@/enums/FuncaoEnum";

const MembrosPage = () => {
  const [musicos, setMusicos] = useState<Musico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [funcaoFilter, setFuncaoFilter] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<FuncaoEnum | null>(null);
  const [formData, setFormData] = useState<MusicoFormData>({
    id: 0,
    nome: "",
    funcao: null,
  });

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const getFuncaoNome = (funcao: FuncaoEnum): string => {
    return FuncaoEnum[funcao];
  };

  const handleSelectChange = (value: string) => {
    setSelectedValue(value as unknown as FuncaoEnum);
    formData.funcao = selectedValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const form = {
      id: 0,
      nome: formData.nome,
      funcao: Number(selectedValue),
    };

    setFormData(form);

    if (!formData.nome || !formData.funcao) {
      setError("Preencha todos os campos");
      return;
    }

    const { url, options } = await MUSICOS_POST(form);
    const response = await fetch(url, options);
    if (!response.ok) setError("Falha enviar dados");
    closeDialog();
    cleanForm();
    fetchMusicos();
  };

  const cleanForm = () => {
    setFormData({
      id: 0,
      nome: "",
      funcao: null,
    });
  };

  useEffect(() => {
    fetchMusicos();
  }, []);

  const fetchMusicos = async () => {
    setIsLoading(true);
    setError(null);
    const { url, options } = await MUSICOS_GET();
    const response = await fetch(url, options);
    if (!response.ok) setError("Falha ao buscar dados");

    const result = await response.json();

    const musicosArray: Musico[] = result.map((item: Musico) => ({
      id: item.id,
      nome: item.nome,
      funcao: item.funcao,
    }));

    setMusicos(musicosArray);
    cleanForm();
    setIsLoading(false);
  };

  // Filtra músicos baseado na busca e no filtro de função
  const filteredMusicos = musicos.filter((musico) => {
    const matchesSearch = musico.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRole =
      funcaoFilter === "all" || funcaoFilter === musico.funcao.toString();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <p className="text-muted-foreground">
            Lista de músicos e suas funções
          </p>
        </div>

        <Button onClick={fetchMusicos} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Carregando...
            </>
          ) : (
            <>
              <Music2 className="mr-2 h-4 w-4" />
              Atualizar Lista
            </>
          )}
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar músicos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={funcaoFilter} onValueChange={setFuncaoFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filtrar por função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as funções</SelectItem>
            {Object.entries(FuncaoEnum)
              .filter(([key]) => isNaN(Number(key))) // Filtra apenas as chaves string do enum
              .map(([key, value]) => (
                <SelectItem key={value} value={value.toString()}>
                  {key}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
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
          {filteredMusicos.map((musico) => (
            <Card key={musico.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{musico.nome}</CardTitle>
                <CardDescription>
                  {getFuncaoNome(musico.funcao)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">ID: {musico.id}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredMusicos.length === 0 && (
        <div className="text-center py-12">
          <Music2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">
            Nenhum músico encontrado
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
              <DialogTitle>Novo Membro</DialogTitle>
              <DialogDescription>
                Adicione um novo integrante do ministério de louvor
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="nome" className="text-right">
                    Nome
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    className="col-span-2"
                    value={formData.nome}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="funcao" className="text-right">
                    Função
                  </Label>
                  <Select
                    name="funcao"
                    value={formData.funcao?.toString()}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger className="w-full sm:w-[223px]">
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Funções</SelectLabel>
                        {Object.entries(FuncaoEnum)
                          .filter(([key]) => isNaN(Number(key))) // Filtra apenas as chaves string do enum
                          .map(([key, value]) => (
                            <SelectItem key={value} value={value.toString()}>
                              {key}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MembrosPage;
