import { useState, useEffect } from "react";
import {
  X,
  Search,
  Star,
  Lock,
  AlertTriangle,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { formatTicketNumber } from "../lib/utils";

interface PremiumNumber {
  number: number;
  isBlocked: boolean;
}

interface EditPremiumNumbersModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalTickets: number;
  selectedPremiumNumbers: PremiumNumber[];
  assignedPremiumNumbers: number[];
  onConfirm: (premiumNumbers: PremiumNumber[]) => void;
}

const EditPremiumNumbersModal = ({
  isOpen,
  onClose,
  totalTickets,
  selectedPremiumNumbers,
  assignedPremiumNumbers,
  onConfirm,
}: EditPremiumNumbersModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [premiumNumbers, setPremiumNumbers] = useState<PremiumNumber[]>(
    selectedPremiumNumbers
  );
  const [globalBlockToggle, setGlobalBlockToggle] = useState(true);
  const [manualNumber, setManualNumber] = useState("");

  useEffect(() => {
    setPremiumNumbers(selectedPremiumNumbers);
  }, [selectedPremiumNumbers]);

  const isPremiumNumber = (number: number) => {
    return premiumNumbers.some((pn) => pn.number === number);
  };

  const isAssignedPremiumNumber = (number: number) => {
    return assignedPremiumNumbers.includes(number);
  };

  const isValidNumber = (number: number) => {
    return number >= 1 && number <= totalTickets;
  };

  const addPremiumNumber = (number: number) => {
    if (!isValidNumber(number)) {
      toast.error(`El número debe estar entre 1 y ${totalTickets}`);
      return;
    }

    if (isAssignedPremiumNumber(number)) {
      toast.error(`El número ${number} ya ha sido asignado a un usuario`);
      return;
    }

    if (isPremiumNumber(number)) {
      toast.error(`El número ${number} ya es premium`);
      return;
    }

    setPremiumNumbers((prev) => [
      ...prev,
      { number, isBlocked: globalBlockToggle },
    ]);
    setManualNumber("");
    toast.success(`Número ${number} agregado como premium`);
  };

  const removePremiumNumber = (number: number) => {
    if (isAssignedPremiumNumber(number)) {
      toast.error(
        `El número ${number} ya ha sido asignado y no se puede eliminar`
      );
      return;
    }

    setPremiumNumbers((prev) => prev.filter((pn) => pn.number !== number));
    toast.success(`Número ${number} removido de premium`);
  };

  const toggleBlockStatus = (number: number) => {
    if (isAssignedPremiumNumber(number)) {
      toast.error(
        `El número ${number} ya ha sido asignado y no se puede modificar`
      );
      return;
    }

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
      prev.map((pn) =>
        isAssignedPremiumNumber(pn.number)
          ? pn
          : { ...pn, isBlocked: newBlockStatus }
      )
    );
  };

  const handleManualAdd = () => {
    const number = parseInt(manualNumber);
    if (!isNaN(number)) {
      addPremiumNumber(number);
    }
  };

  const handleSearchAdd = () => {
    const number = parseInt(searchTerm);
    if (!isNaN(number)) {
      addPremiumNumber(number);
      setSearchTerm("");
    }
  };

  const handleConfirm = () => {
    onConfirm(premiumNumbers);
    onClose();
    toast.success(`${premiumNumbers.length} números premium configurados`);
  };

  if (!isOpen) return null;

  const assignedPremiumCount = premiumNumbers.filter((pn) =>
    isAssignedPremiumNumber(pn.number)
  ).length;

  // Filtrar números premium basado en búsqueda
  const filteredPremiumNumbers = premiumNumbers
    .filter((pn) => pn.number.toString().includes(searchTerm))
    .sort((a, b) => a.number - b.number);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white rounded-t-xl">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Números Premium</h2>
            <p className="text-xs text-gray-600 mt-1">
              Gestiona números especiales
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Warning about assigned numbers */}
          {assignedPremiumCount > 0 && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="text-amber-600" size={16} />
                <h3 className="font-medium text-amber-800 text-sm">
                  {assignedPremiumCount} Ya Asignados
                </h3>
              </div>
              <p className="text-xs text-amber-700">
                Números con 🔒 no se pueden modificar
              </p>
            </div>
          )}

          {/* Add Number Section */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700 text-sm">
              Agregar Número
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
                  placeholder="Buscar o agregar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchAdd()}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="1"
                  max={totalTickets}
                />
              </div>
              <button
                onClick={handleSearchAdd}
                disabled={!searchTerm || isNaN(parseInt(searchTerm))}
                className="px-3 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Global Block Toggle */}
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={globalBlockToggle}
                onChange={toggleAllBlocked}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              Bloquear nuevos números
            </label>
          </div>

          {/* Premium Numbers List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-700 text-sm">
                Números Premium
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {premiumNumbers.length}
              </span>
            </div>

            {filteredPremiumNumbers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Star size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No hay números premium</p>
                {searchTerm && (
                  <p className="text-xs mt-1">
                    {isNaN(parseInt(searchTerm))
                      ? "Ingresa un número válido"
                      : "Presiona + para agregar"}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredPremiumNumbers.map((pn) => {
                  const isAssigned = isAssignedPremiumNumber(pn.number);
                  return (
                    <div
                      key={pn.number}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 ${
                        isAssigned
                          ? "bg-gray-50 border-gray-200"
                          : pn.isBlocked
                            ? "bg-red-50 border-red-200"
                            : "bg-green-50 border-green-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isAssigned ? (
                          <Lock className="text-gray-500" size={16} />
                        ) : (
                          <Star
                            className={
                              pn.isBlocked ? "text-red-500" : "text-green-500"
                            }
                            size={16}
                            fill="currentColor"
                          />
                        )}
                        <div>
                          <span className="font-mono text-sm font-medium">
                            {formatTicketNumber(pn.number, totalTickets)}
                          </span>
                          <div className="text-xs text-gray-500">
                            {isAssigned
                              ? "Asignado"
                              : pn.isBlocked
                                ? "Bloqueado"
                                : "Disponible"}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!isAssigned && (
                          <>
                            <button
                              onClick={() => toggleBlockStatus(pn.number)}
                              className={`px-2 py-1 text-xs rounded transition-colors ${
                                pn.isBlocked
                                  ? "bg-green-100 text-green-700 hover:bg-green-200"
                                  : "bg-red-100 text-red-700 hover:bg-red-200"
                              }`}
                            >
                              {pn.isBlocked ? "Desbloquear" : "Bloquear"}
                            </button>
                            <button
                              onClick={() => removePremiumNumber(pn.number)}
                              className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
              <span>Bloqueado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Asignado</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={12} className="text-orange-500" fill="currentColor" />
              <span>Premium</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm font-medium"
            >
              Confirmar ({premiumNumbers.length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPremiumNumbersModal;
