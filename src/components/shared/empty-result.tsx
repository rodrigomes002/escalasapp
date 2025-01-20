import { Music2 } from "lucide-react";

export const EmptyResult = () => {
  return (
    <div className="text-center py-12">
      <Music2 className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">
        Nenhuma informação encontrada
      </h3>
      <p className="text-muted-foreground">
        Tente ajustar seus filtros de busca
      </p>
    </div>
  );
};
