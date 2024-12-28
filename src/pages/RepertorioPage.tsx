import { useState, useEffect } from "react";
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
import {
  Loader2,
  Music,
  Music2,
  Pencil,
  Plus,
  Search,
  Trash,
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
import { Musica } from "@/types/Musica";
import {
  DELETE_MUSICA,
  GET_MUSICAS,
  POST_MUSICA,
  PUT_MUSICA,
} from "@/services/ApiMusicas";
import axios from "axios";

const RepertorioPage = () => {
  const [musicas, setMusicas] = useState<Musica[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpate] = useState(false);
  const [formData, setFormData] = useState<Musica>({
    id: 0,
    nome: "",
    cantor: "",
    //categoria: "",
    tom: "",
  });

  useEffect(() => {
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

          setMusicas(musicasArray);
          cleanForm();
          setIsLoading(false);
        })
        .catch((error: Error) => {
          setError(error.message);
        });
    };

    fetchMusicas();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorForm(null);
    setIsLoading(true);

    if (
      !formData.nome ||
      !formData.cantor ||
      //!formData.categoria ||
      !formData.tom
    ) {
      setErrorForm("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    if (isUpdate) {
      const { url, headers, body } = PUT_MUSICA(
        formData,
        formData.id.toString()
      );

      axios
        .put(url, body, { headers: headers })
        .then(() => {
          closeDialog();
          cleanForm();
        })
        .catch((error: Error) => {
          setError(error.message);
        });
    } else {
      const { url, headers, body } = POST_MUSICA(formData);

      axios
        .post(url, body, { headers: headers })
        .then(() => {
          closeDialog();
          cleanForm();
        })
        .catch((error: Error) => {
          setError(error.message);
        });
    }
  };

  const editMusica = (musica: Musica) => {
    openDialog();

    const form = {
      id: musica.id,
      nome: musica.nome,
      cantor: musica.cantor,
      //categoria: musica.categoria,
      tom: musica.tom,
    };

    setFormData(form);
    setIsUpate(true);
  };

  const deleteMusica = async (id: string) => {
    setIsLoading(true);
    setError(null);

    const { url, headers } = DELETE_MUSICA(id);
    axios
      .delete(url, { headers: headers })
      .then(() => {})
      .catch((error: Error) => {
        setError(error.message);
      });

    setIsLoading(false);
  };

  const cleanForm = () => {
    setFormData({
      id: 0,
      nome: "",
      cantor: "",
      //categoria: "",
      tom: "",
    });

    setIsUpate(false);
    setErrorForm(null);
  };

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  // Filtra músicas baseado na busca e no filtro de função
  const filteredMusicas = musicas.filter((musico) => {
    const matchesSearch = musico.nome
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCantor = musico.cantor
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearch || matchesCantor;
  });

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
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
          {filteredMusicas.map((musico) => (
            <Card key={musico.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{musico.nome}</CardTitle>
                <CardDescription>{musico.cantor}</CardDescription>
                <CardDescription>Tom: {musico.tom}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => editMusica(musico)}
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
                  onClick={() => deleteMusica(musico.id.toString())}
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

      {/* Empty State */}
      {!isLoading && !error && filteredMusicas.length === 0 && (
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
                  <Label htmlFor="cantor" className="text-right">
                    Artista
                  </Label>
                  <Input
                    id="cantor"
                    name="cantor"
                    className="col-span-2"
                    value={formData.cantor}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        cantor: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tom" className="text-right">
                    Tom
                  </Label>
                  <Input
                    id="tom"
                    name="tom"
                    className="col-span-2"
                    value={formData.tom}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        tom: e.target.value,
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

export default RepertorioPage;
