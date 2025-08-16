import { useState, useEffect } from "react";
import { X, Search, Star, Plus, Minus } from "lucide-react";
import { formatTicketNumber } from "../lib/utils";

interface PremiumNumber {
  number: number;
  isBlocked: boolean;
}

interface PremiumNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTickets: number;
  selectedPremiumNumbers: PremiumNumber[];
  onConfirm: (premiumNumbers: PremiumNumber[]) => void;
}

const PremiumNumbersModal = ({
  isOpen,
  onClose,
  totalTickets,
  selectedPremiumNumbers,
  onConfirm,
}: PremiumNumbersModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [premiumNumbers, setPremiumNumbers] = useState<PremiumNumber[]>(
    selectedPremiumNumbers
  );
  const [globalBlockToggle, setGlobalBlockToggle] = useState(true);

  useEffect(() => {
    setPremiumNumbers(selectedPremiumNumbers);
  }, [selectedPremiumNumbers]);

  const isPremiumNumber = (number: number) => {
    return premiumNumbers.some((pn) => pn.number === number);
  };

  const isValidNumber = (number: number) => {
    return number >= 1 && number <= totalTickets;
  };

  const addPremiumNumber = (number: number) => {
    if (!isValidNumber(number)) {
      // toast.error(`El número debe estar entre 1 y ${totalTickets}`);
      return;
    }

    if (isPremiumNumber(number)) {
      // toast.error(`El número ${number} ya es premium`);
      return;
    }

    setPremiumNumbers((prev) =>
      [...prev, { number, isBlocked: globalBlockToggle }].sort(
        (a, b) => a.number - b.number
      )
    );
    setSearchTerm("");
    // toast.success(`Número ${number} agregado como premium`);
  };

  const removePremiumNumber = (number: number) => {
    setPremiumNumbers((prev) => prev.filter((pn) => pn.number !== number));
    // toast.success(`Número ${number} removido de premium`);
  };

  const toggleBlockStatus = (number: number) => {
    setPremiumNumbers((prev) =>
      prev.map((pn) =>
        pn.number === number ? { ...pn, isBlocked: !pn.isBlocked } : pn
      )
    );
  };

  const toggleAllBlocked = () => {
    const newBlockStatus = !globalBlockToggle;
    setGlobalBlockToggle(newBlockStatus);
    setPremiumNumbers((prev) =>
      prev.map((pn) => ({ ...pn, isBlocked: newBlockStatus }))
    );
  };

  const handleSearchAdd = () => {
    const number = parseInt(searchTerm);
    if (!isNaN(number)) {
      addPremiumNumber(number);
    }
  };

  const handleConfirm = () => {
    onConfirm(premiumNumbers);
    onClose();
    // toast.success(`${premiumNumbers.length} números premium configurados`);
  };

  if (!isOpen) return null;

  // Filtrar números premium basado en búsqueda
  const filteredPremiumNumbers = premiumNumbers
    .filter((pn) => pn.number.toString().includes(searchTerm))
    .sort((a, b) => a.number - b.number);

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50">
      {/* Mobile: Bottom Sheet Style */}
      <div className="bg-white w-full h-[95vh] sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl rounded-t-3xl overflow-hidden flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-800">Números Premium</h2>
            <p className="text-sm text-gray-600 mt-1">
              {premiumNumbers.length} números premium de {totalTickets} boletos
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-2"
          >
            <X size={20} />
          </button>
        </div>

        {/* Add Number Section */}
        <div className="p-4 space-y-3 bg-gray-50 border-b">
          <h3 className="font-medium text-gray-700 text-sm">
            Agregar Número Premium
          </h3>

          {/* Search/Add Input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="number"
                placeholder="Buscar o agregar número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearchAdd()}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="1"
                max={totalTickets}
              />
            </div>
            <button
              onClick={handleSearchAdd}
              disabled={!searchTerm || isNaN(parseInt(searchTerm))}
              className="px-3 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Global Block Toggle */}
          <div className="flex items-center justify-between p-3 bg-white rounded-xl border">
            <span className="text-sm font-medium text-gray-700">
              Nuevos números se crean bloqueados
            </span>
            <button
              onClick={toggleAllBlocked}
              className={`relative w-10 h-5 rounded-full transition-colors ${
                globalBlockToggle ? "bg-orange-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  globalBlockToggle ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Premium Numbers List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700 text-sm">
                Números Premium
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {filteredPremiumNumbers.length}
              </span>
            </div>

            {filteredPremiumNumbers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Star size={40} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-1">
                  {premiumNumbers.length === 0
                    ? "No hay números premium"
                    : "No se encontraron números"}
                </p>
                <p className="text-xs">
                  {searchTerm
                    ? isNaN(parseInt(searchTerm))
                      ? "Ingresa un número válido"
                      : "Presiona + para agregar"
                    : "Agrega números usando el campo de arriba"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPremiumNumbers.map((pn) => (
                  <div
                    key={pn.number}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 ${
                      pn.isBlocked
                        ? "bg-red-50 border-red-200"
                        : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Star
                        className={
                          pn.isBlocked ? "text-red-500" : "text-green-500"
                        }
                        size={16}
                        fill="currentColor"
                      />
                      <div>
                        <span className="font-mono text-sm font-medium">
                          #{formatTicketNumber(pn.number, totalTickets)}
                        </span>
                        <div className="text-xs text-gray-500">
                          {pn.isBlocked ? "Bloqueado" : "Disponible"}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleBlockStatus(pn.number)}
                        className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                          pn.isBlocked
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {pn.isBlocked ? "Desbloquear" : "Bloquear"}
                      </button>
                      <button
                        onClick={() => removePremiumNumber(pn.number)}
                        className="p-1 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons - Sticky Footer */}
        <div className="p-4 bg-white border-t border-gray-200 space-y-3">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors active:scale-95"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 active:scale-95 shadow-lg"
            >
              Confirmar ({premiumNumbers.length})
            </button>
          </div>

          {/* Safe area for iPhone bottom bar */}
          <div className="h-2 sm:hidden"></div>
        </div>
      </div>
    </div>
  );
};

export default PremiumNumbersModal;
