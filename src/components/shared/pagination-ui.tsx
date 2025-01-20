import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const PaginationUI: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  const generatePaginationItems = () => {
    const items: (number | "ellipsis")[] = [];

    // Sempre mostrar primeira página
    items.push(1);

    // Calcular range dos números de página
    const leftSibling = Math.max(currentPage - siblingCount, 2);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

    // Adicionar ellipsis à esquerda se necessário
    if (leftSibling > 2) {
      items.push("ellipsis");
    }

    // Adicionar páginas entre os siblings
    for (let i = leftSibling; i <= rightSibling; i++) {
      items.push(i);
    }

    // Adicionar ellipsis à direita se necessário
    if (rightSibling < totalPages - 1) {
      items.push("ellipsis");
    }

    // Sempre mostrar última página
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          />
        </PaginationItem>

        {generatePaginationItems().map((item, index) => (
          <PaginationItem key={index}>
            {item === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                className={`${
                  currentPage === item
                    ? "bg-primary text-primary-foreground"
                    : ""
                } cursor-pointer`}
                onClick={() => onPageChange(item)}
              >
                {item}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationUI;
