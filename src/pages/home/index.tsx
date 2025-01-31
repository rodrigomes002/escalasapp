import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Music2, Plus } from "lucide-react";
import { Escala } from "@/types/Escala";
import { EscalaCard } from "@/pages/escalas/components/escala-card";
import { useEscalas } from "@/hooks/use-escalas";
import { useCreateEscala } from "@/hooks/use-create-escala";
import { useUpdateEscala } from "@/hooks/use-update-escala";
import { useDeleteEscala } from "@/hooks/use-delete-escala";
import PageHead from "@/components/shared/page-head";
import { months } from "@/constants/data";
import { Link } from "react-router-dom";

const Home = () => {
  const currentMonth = months[new Date().getMonth()];
  const { data: escalaData, isLoading, error } = useEscalas();

  const createMutation = useCreateEscala();
  const updateMutation = useUpdateEscala();
  const deleteMutation = useDeleteEscala();

  const isLoadingMutation =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const escalas = (escalaData as Escala[] | undefined) || [];

  const editEscala = (escala: Escala) => {};

  const deleteEscala = (escala: Escala) => {};

  return (
    <>
      <PageHead title="Escalas | App" />
      <div className="max-h-screen flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
          <h2 className="text-3xl font-bold tracking-tight">{currentMonth}</h2>
        </div>

        <div className="flex justify-end">
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link
              to="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Entrar
            </Link>
          </p>
        </div>

        {/* Musicians Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Empty State */}
      {!isLoading && !error && escalas.length === 0 && (
        <div className="text-center py-12">
          <Music2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">Nenhum data encontrada</h3>
        </div>
      )}
    </>
  );
};

export default Home;
