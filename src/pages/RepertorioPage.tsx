import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Music, Pencil, Plus, Search, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Musica } from "@/types/Musica";
import PaginationComponent from "@/components/PaginationComponent";
import { useMusicas } from "@/hooks/useMusicas";
import { useCreateMusica } from "@/hooks/useCreateMusica";
import { useUpdateMusica } from "@/hooks/useUpdateMusica";
import { useDeleteMusica } from "@/hooks/useDeleteMusica";
import { EmptyResult } from "@/components/EmptyResult";

const RepertorioPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [nome, setNome] = useState("");
  const [nomeBusca, setNomeBusca] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState<Musica>({
    id: 0,
    nome: "",
    cantor: "",
    tom: "",
  });

  const { data, isLoading, error } = useMusicas(currentPage, 9, nomeBusca);
  const createMutation = useCreateMusica();
  const updateMutation = useUpdateMusica();
  const deleteMutation = useDeleteMusica();

  const isLoadingMutation =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;
  const errorMutation = createMutation.error || updateMutation.error;
  const musicas = data?.items || [];
  const totalPages = data ? Math.ceil(data.totalCount / 9) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nome || !formData.cantor || !formData.tom) {
      setErrorMessage("Preencha todos os campos");
      return;
    }

    isUpdate
      ? updateMutation.mutate(
          { musica: formData, id: formData.id.toString() },
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

  const createMusica = () => {
    reset();
    openDialog(false);
  };

  const editMusica = (musica: Musica) => {
    setFormData(musica);
    setErrorMessage(null);
    openDialog(true);
  };

  const reset = () => {
    setFormData({
      id: 0,
      nome: "",
      cantor: "",
      tom: "",
    });

    setIsUpdate(false);
    setErrorMessage(null);
  };

  const openDialog = (isUpdate: boolean) => {
    setIsUpdate(isUpdate);
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  const search = () => {
    setNomeBusca(nome);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <p className="text-muted-foreground">
            Lista de músicas do repertório
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar músicas..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={search} disabled={isLoading || isLoadingMutation}>
          <Search className="h-4 w-4" />
        </Button>
        <Button
          onClick={createMusica}
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
          {musicas.map((musica: Musica) => (
            <Card key={musica.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{musica.nome}</CardTitle>
                <CardDescription>{musica.cantor}</CardDescription>
                <CardDescription>Tom: {musica.tom}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => editMusica(musica)}
                  disabled={isLoadingMutation}
                  className="mr-2"
                >
                  {<Pencil className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={() => deleteMutation.mutate(musica.id.toString())}
                  disabled={isLoadingMutation}
                >
                  {<Trash className="h-4 w-4" />}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !error && musicas.length !== 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {!isLoading && !error && musicas.length === 0 && <EmptyResult />}

      <div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isUpdate ? "Editar Música" : "Nova Música"}
              </DialogTitle>
              <DialogDescription>
                {isUpdate
                  ? "Edite a música do repertório"
                  : "Adicione uma nova música ao repertório"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                {["nome", "cantor", "tom"].map((field) => (
                  <div
                    className="grid grid-cols-4 items-center gap-4"
                    key={field}
                  >
                    <Label htmlFor={field} className="text-right">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      className="col-span-2"
                      value={formData[field as keyof Musica]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field]: e.target.value })
                      }
                    />
                  </div>
                ))}
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
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default RepertorioPage;
