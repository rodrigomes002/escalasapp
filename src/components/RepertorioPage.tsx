// src/components/RepertorioPage.tsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Musica } from "../types/musica";

const ITEMS_PER_PAGE = 6;

const musicas: Musica[] = [
  {
    id: 1,
    titulo: "Quão Grande é o Meu Deus",
    artista: "Soraya Moraes",
    tom: "G",
    bpm: 75,
    categoria: "Adoração",
  },
  {
    id: 2,
    titulo: "Deus é Deus",
    artista: "Delino Marçal",
    tom: "C",
    bpm: 72,
    categoria: "Adoração",
  },
  {
    id: 3,
    titulo: "Lugar Secreto",
    artista: "Gabriela Rocha",
    tom: "E",
    bpm: 70,
    categoria: "Adoração",
  },
  {
    id: 4,
    titulo: "Tua Graça Me Basta",
    artista: "Davi Sacer",
    tom: "D",
    bpm: 80,
    categoria: "Adoração",
  },
  {
    id: 5,
    titulo: "Galileu",
    artista: "Fernandinho",
    tom: "Am",
    bpm: 85,
    categoria: "Adoração",
  },
  {
    id: 6,
    titulo: "Nada Além do Sangue",
    artista: "Fernandinho",
    tom: "Em",
    bpm: 70,
    categoria: "Adoração",
  },
  {
    id: 7,
    titulo: "Vim Para Adorar-te",
    artista: "Diante do Trono",
    tom: "D",
    bpm: 68,
    categoria: "Adoração",
  },
  {
    id: 8,
    titulo: "Oceans",
    artista: "Hillsong",
    tom: "D",
    bpm: 65,
    categoria: "Adoração",
  },
  {
    id: 9,
    titulo: "Santo Espírito",
    artista: "Laura Souguellis",
    tom: "G",
    bpm: 72,
    categoria: "Adoração",
  },
  {
    id: 10,
    titulo: "Ainda Que a Figueira",
    artista: "Grupo Logos",
    tom: "Em",
    bpm: 78,
    categoria: "Adoração",
  },
];

const RepertorioPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMusicas = musicas.filter(
    (musica) =>
      musica.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      musica.artista.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMusicas.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedMusicas = filteredMusicas.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar música ou artista..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {paginatedMusicas.map((musica) => (
          <div
            key={musica.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold mb-2">{musica.titulo}</h3>
            <div className="text-gray-600 space-y-1">
              <p>Artista: {musica.artista}</p>
              <p>Tom: {musica.tom}</p>
              <p>BPM: {musica.bpm}</p>
              <p>Categoria: {musica.categoria}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`flex items-center ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-500 hover:text-blue-700"
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          Anterior
        </button>
        <span className="text-gray-600">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`flex items-center ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-500 hover:text-blue-700"
          }`}
        >
          Próxima
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default RepertorioPage;
