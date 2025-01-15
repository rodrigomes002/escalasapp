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
import {
  Loader2,
  Music2,
  Pencil,
  Plus,
  Search,
  Trash,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Musico } from "@/types/Musico";
import { FuncaoEnum } from "@/enums/FuncaoEnum";
import {
  DELETE_MUSICO,
  GET_MUSICOS,
  POST_MUSICO,
  PUT_MUSICO,
} from "@/services/ApiMusicos";
import axios from "axios";
import PaginationComponent from "@/components/PaginationComponent";

const MembrosPage = () => {
  const [isSuccessRequest, setIsSuccessRequest] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [musicos, setMusicos] = useState<Musico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [nome, setNome] = useState<string>("");
  const [nomeBusca, setNomeBusca] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpate] = useState(false);
  const [formData, setFormData] = useState<Musico>({
    id: 0,
    nome: "",
    funcao: null,
  });

  useEffect(() => {
    const fetchMusicos = () => {
      setIsLoading(true);
      setError(null);
      const { url, headers } = GET_MUSICOS();

      axios
        .get(url, {
          headers: headers,
          params: { pageNumber: currentPage, pageSize: 9, nome: nomeBusca },
        })
        .then((response) => {
          const result = response.data;

          const musicosArray: Musico[] = result.items.map((item: Musico) => ({
            id: item.id,
            nome: item.nome,
            funcao: item.funcao,
          }));

          setTotalPages(Math.ceil(result.totalCount / 9));
          setMusicos(musicosArray);
          cleanForm();
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
        });
    };

    fetchMusicos();
  }, [currentPage, nomeBusca]);

  useEffect(() => {
    const fetchMusicos = () => {
      setIsLoading(true);
      setError(null);
      const { url, headers } = GET_MUSICOS();

      axios
        .get(url, {
          headers: headers,
          params: { pageNumber: currentPage, pageSize: 9, nome: nomeBusca },
        })
        .then((response) => {
          const result = response.data;

          const musicosArray: Musico[] = result.items.map((item: Musico) => ({
            id: item.id,
            nome: item.nome,
            funcao: item.funcao,
          }));

          setTotalPages(Math.ceil(result.totalCount / 9));
          setMusicos(musicosArray);
          cleanForm();
          setIsLoading(false);
        })
        .catch((error) => {
          setError(error.message);
        });
    };

    if (isSuccessRequest) fetchMusicos();
  }, [currentPage, nomeBusca, isSuccessRequest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorForm(null);
    setIsLoading(true);

    if (!formData.nome || !formData.funcao) {
      setErrorForm("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (isUpdate) {
      const { url, headers, body } = PUT_MUSICO(
        formData,
        formData.id.toString()
      );

      axios
        .put(url, body, { headers: headers })
        .then(() => {
          setIsSuccessRequest(true);
          closeDialog();
          cleanForm();
        })
        .catch((error: Error) => {
          setErrorForm(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      const { url, headers, body } = POST_MUSICO(formData);

      axios
        .post(url, body, { headers: headers })
        .then(() => {
          setIsSuccessRequest(true);
          closeDialog();
          cleanForm();
        })
        .catch((error: Error) => {
          setErrorForm(error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const editMusico = (musico: Musico) => {
    openDialog();

    const form = {
      id: musico.id,
      nome: musico.nome,
      funcao: Number(musico.funcao),
    };

    setFormData(form);
    setIsUpate(true);
  };

  const deleteMusico = async (id: string) => {
    setIsLoading(true);
    setError(null);

    const { url, headers } = DELETE_MUSICO(id);

    axios
      .delete(url, { headers: headers })
      .then(() => {
        setIsSuccessRequest(true);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const cleanForm = () => {
    setFormData({
      id: 0,
      nome: "",
      funcao: null,
    });

    setIsUpate(false);
    setErrorForm(null);
  };

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const getFuncaoNome = (funcao: FuncaoEnum): string => {
    return FuncaoEnum[funcao];
  };

  const search = () => {
    setNomeBusca(nome);
    setIsSuccessRequest(true);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <p className="text-muted-foreground">
            Lista de músicos e suas funções
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar músicos..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={search} disabled={isLoading}>
          <Search className="h-4 w-4" />
        </Button>
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
          {musicos.map((musico) => (
            <Card key={musico.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{musico.nome}</CardTitle>
                <CardDescription>
                  {getFuncaoNome(musico.funcao as FuncaoEnum)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => editMusico(musico)}
                  disabled={isLoading}
                  className="mr-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Pencil className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => deleteMusico(musico.id.toString())}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Trash className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Empty State */}
      {!isLoading && !error && musicos.length === 0 && (
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
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        nome: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="funcao" className="text-right">
                    Função
                  </Label>
                  <Select
                    name="funcao"
                    value={formData.funcao?.toString()}
                    onValueChange={(valor) =>
                      setFormData({
                        ...formData,
                        funcao: Number(valor),
                      })
                    }
                  >
                    <SelectTrigger className="col-span-2">
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
                      <User className="mr-2 h-4 w-4" />
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

export default MembrosPage;
