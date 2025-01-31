import { useState, useEffect, useRef } from "react";
import { Search, Check, ChevronsUpDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SearchableSelect = ({
  options,
  placeholder = "Selecione uma opção...",
  value,
  onChange,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  // Fechar o dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectOption = (option: Option) => {
    onChange?.(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-left border rounded-md bg-white hover:bg-gray-50"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronsUpDown className="h-4 w-4 opacity-50" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-2 text-sm text-gray-500 text-center">
                Nenhum resultado encontrado.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                  onClick={() => handleSelectOption(option)}
                >
                  <span className="w-4 h-4 mr-2">
                    {value === option.value && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </span>
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
