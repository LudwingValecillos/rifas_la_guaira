import { useState } from "react";
import { useSorteazo } from "../contexts/SorteazoContext";
import { X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { deleteRifa } from "../apis/rifa";

interface DeleteRaffleModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffleId: string;
}

const DeleteRaffleModal = ({
  isOpen,
  onClose,
  raffleId,
}: DeleteRaffleModalProps) => {
  const { raffles, deleteRaffle } = useSorteazo();
  const [isDeleting, setIsDeleting] = useState(false);
  const raffle = raffles.find((r) => r.id === raffleId);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Mostrar loading toast
      const loadingToast = toast.loading("Eliminando sorteo...");

      // Eliminar de Firebase
      await deleteRifa(raffleId);

      // Actualizar contexto local para reflejar cambios inmediatamente en la UI
      deleteRaffle(raffleId);

      toast.dismiss(loadingToast);
      toast.success("Sorteo eliminado exitosamente");
      onClose();
    } catch (error) {
      console.error("Error al eliminar sorteo:", error);
      toast.error("Error al eliminar el sorteo. Inténtalo de nuevo.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !raffle) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Eliminar Sorteo
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1 text-base sm:text-lg">
                ¿Estás seguro?
              </h3>
              <p className="text-gray-600 text-sm">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <p className="text-sm text-gray-700">
              <strong>Sorteo a eliminar:</strong> {raffle.title}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Se eliminarán también todas las compras asociadas a este sorteo.
            </p>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full sm:flex-1 px-4 py-3 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteRaffleModal;
