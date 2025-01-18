import { useState } from "react";
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
import PaginationComponent from "@/components/PaginationComponent";
import { useMusicos } from "@/hooks/useMusicos";
import { useCreateMusico } from "@/hooks/useCreateMusico";
import { useUpdateMusico } from "@/hooks/useUpdateMusico";
import { useDeleteMusico } from "@/hooks/useDeleteMusico";

const MembrosPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [nome, setNome] = useState<string>("");
  const [nomeBusca, setNomeBusca] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpate] = useState(false);
  const [formData, setFormData] = useState<Musico>({
    id: 0,
    nome: "",
    funcao: null,
  });

  const { data, isLoading, error } = useMusicos(currentPage, nomeBusca);
  const createMutation = useCreateMusico();
  const updateMutation = useUpdateMusico();
  const deleteMutation = useDeleteMusico();

  const isLoadingMutation =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const errorMutation = createMutation.error || updateMutation.error;
  const musicos = data?.items || [];
  const totalPages = data ? Math.ceil(data.totalCount / 9) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.funcao) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    isUpdate
      ? updateMutation.mutate(
          { musico: formData, id: formData.id.toString() },
          {
            onSuccess: () => {
              reset();
              closeDialog();
            },
          }
        )
      : createMutation.mutate(formData, {
          onSuccess: () => {
            reset();
            closeDialog();
          },
        });
  };

  const createMusico = () => {
    reset();
    openDialog(false);
  };

  const editMusico = (musico: Musico) => {
    setFormData({
      id: musico.id,
      nome: musico.nome,
      funcao: Number(musico.funcao),
    });

    setErrorMessage(null);
    openDialog(true);
  };

  const reset = () => {
    setFormData({
      id: 0,
      nome: "",
      funcao: null,
    });

    setIsUpate(false);
    setErrorMessage(null);
  };

  const openDialog = (isUpdate: boolean) => {
    setIsUpate(isUpdate);
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  const getFuncaoNome = (funcao: FuncaoEnum): string => {
    return FuncaoEnum[funcao];
  };

  const search = () => {
    setNomeBusca(nome);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <p className="text-muted-foreground">
            Lista de membros e suas funções
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
        <Button onClick={search} disabled={isLoading || isLoadingMutation}>
          <Search className="h-4 w-4" />
        </Button>
        <Button
          onClick={createMusico}
          disabled={isLoading || isLoadingMutation}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {musicos.map((musico: Musico) => (
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
                  disabled={isLoadingMutation}
                  className="mr-2"
                >
                  {<Pencil className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate(musico.id.toString())}
                  disabled={isLoadingMutation}
                >
                  {<Trash className="h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && (
        <div className="flex justify-center">
          <div>
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      )}

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
              <DialogTitle>
                {isUpdate ? "Editar membro" : "Novo membro"}
              </DialogTitle>
              <DialogDescription>
                {isUpdate
                  ? "Altere o nome ou função do membro"
                  : "Adicione um novo membro"}
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
                {errorMessage && (
                  <p className="text-red-500  mb-3">{errorMessage}</p>
                )}
                {errorMutation && (
                  <p className="text-red-500  mb-3">
                    {(errorMutation as Error).message}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoadingMutation}>
                  {isLoadingMutation ? (
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
