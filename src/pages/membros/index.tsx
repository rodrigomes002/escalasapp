import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Plus, Search, User } from "lucide-react";
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
import { FuncaoEnum } from "@/enums/funcao-enum";
import { useMusicos } from "@/hooks/use-musicos";
import { useCreateMusico } from "@/hooks/use-create-musico";
import { useUpdateMusico } from "@/hooks/use-update-musico";
import { useDeleteMusico } from "@/hooks/use-delete-musico";
import { EmptyResult } from "@/components/shared/empty-result";
import { CellAction } from "./components/cell-action";
import PageHead from "@/components/shared/page-head";
import PaginationUI from "@/components/shared/pagination-ui";
import SearchableSelect from "@/components/ui/searchable-select";

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

  const { data, isLoading, error } = useMusicos(currentPage, 9, nomeBusca);
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

  const deleteMusico = (musico: Musico) => {
    deleteMutation.mutate(musico.id.toString());
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

  const options = [
    { value: "1", label: "Vocal" },
    { value: "2", label: "Teclado" },
    { value: "3", label: "Violao" },
    { value: "4", label: "Guitarra" },
    { value: "5", label: "Baixo" },
    { value: "6", label: "Bateria" },
  ];

  return (
    <>
      <PageHead title="Membros | App" />
      <div className="max-h-screen overflow-y-auto flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <p className="text-muted-foreground text-xl mb-2">
            Lista de membros e suas funções
          </p>
        </div>

        {/* Filtros */}
        <div className="flex sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar membros..."
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

        {/* Musicians Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-1">
            {musicos.map((musico: Musico) => (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>{musico.nome}</CardTitle>
                  <CellAction
                    item={musico}
                    key={musico.id.toString()}
                    loading={isLoadingMutation}
                    editItem={editMusico}
                    deleteItem={deleteMusico}
                  ></CellAction>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {getFuncaoNome(musico.funcao as FuncaoEnum)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && !error && musicos.length !== 0 && (
          <PaginationUI
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Empty State */}
        {!isLoading && !error && musicos.length === 0 && <EmptyResult />}

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
      </div>

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
              <div>
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
              <div>
                <Label htmlFor="funcao" className="text-right">
                  Função
                </Label>
                <SearchableSelect
                  options={options}
                  value={formData.funcao?.toString()}
                  onChange={(valor) =>
                    setFormData({
                      ...formData,
                      funcao: Number(valor),
                    })
                  }
                  placeholder="Selecione..."
                />
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
    </>
  );
};

export default MembrosPage;
