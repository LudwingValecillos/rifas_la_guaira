import { useState } from "react";
import { useSorteazo } from "../contexts/SorteazoContext";
import { X, Upload, Star } from "lucide-react";
import { toast } from "sonner";
import { uploadImageToImageKit } from "../apis/rifa";
import PremiumNumbersModal from "./PremiumNumbersModal";
import { formatTicketNumber } from "../lib/utils";

interface PremiumNumber {
  number: number;
  isBlocked: boolean;
}

interface CreateRaffleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to format numbers with thousands separators (e.g., 3000 -> 3.000)
const formatWithThousands = (value: string): string => {
  if (!value) return "";
  const numericValue = parseInt(value.replace(/\D/g, ""));
  if (isNaN(numericValue)) return "";
  return numericValue.toLocaleString("es-CO");
};

const CreateRaffleModal = ({ isOpen, onClose }: CreateRaffleModalProps) => {
  const { addRaffle } = useSorteazo();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    pricePerTicket: "",
    totalTickets: "",
    drawDate: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [premiumNumbers, setPremiumNumbers] = useState<PremiumNumber[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // For numeric fields where we want thousand separators, strip non-digits before storing
    if (name === "pricePerTicket" || name === "totalTickets") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData({
        ...formData,
        [name]: digitsOnly,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setImageFile(file);
        setFormData({
          ...formData,
          image: URL.createObjectURL(file),
        });
      } else {
        toast.error("Solo se permiten archivos de imagen");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !imageFile ||
      !formData.pricePerTicket ||
      !formData.totalTickets ||
      !formData.drawDate
    ) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    const pricePerTicket = parseInt(formData.pricePerTicket);
    const totalTickets = parseInt(formData.totalTickets);

    if (pricePerTicket <= 0 || totalTickets <= 0) {
      toast.error("El precio y la cantidad de boletos deben ser mayores a 0");
      return;
    }

    try {
      setIsSubmitting(true);

      // Mostrar loading toast
      const loadingToast = toast.loading("Subiendo imagen y creando sorteo...");

      // Subir imagen primero
      const imageUrl = await uploadImageToImageKit(imageFile);

      if (!imageUrl) {
        toast.dismiss(loadingToast);
        toast.error("Error al subir la imagen. Inténtalo de nuevo.");
        return;
      }

      await addRaffle({
        title: formData.title,
        description: formData.description,
        image: imageUrl,
        pricePerTicket,
        totalTickets,
        drawDate: formData.drawDate,
        soldTickets: 0,
        status: "active",
        premiumNumbers: premiumNumbers,
      });

      // Cerrar loading toast y mostrar éxito
      toast.dismiss(loadingToast);
      toast.success("Sorteo creado exitosamente en Firebase");

      // Reset form
      setFormData({
        title: "",
        description: "",
        image: "",
        pricePerTicket: "",
        totalTickets: "",
        drawDate: "",
      });
      setImageFile(null);
      setPremiumNumbers([]);
      onClose();
    } catch (error) {
      console.error("Error al crear sorteo:", error);
      toast.error("Error al crear el sorteo. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Crear Nuevo Sorteo
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          <div>
            <label className="block text-gray-700 font-medium mb-1.5 sm:mb-2">
              Título del Sorteo *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              placeholder="Ej: Sorteo PlayStation 5"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1.5 sm:mb-2">
              Descripción *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              placeholder="Describe el premio y detalles del sorteo..."
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1.5 sm:mb-2">
              Imagen del Premio *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-orange-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
                required
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {formData.image ? (
                  <div className="space-y-2">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mx-auto"
                    />
                    <p className="text-green-600 font-medium">
                      {imageFile?.name || "Imagen seleccionada"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="mx-auto text-gray-400" size={28} />
                    <p className="text-gray-600">
                      Haz clic para subir una imagen del premio
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1.5 sm:mb-2">
                Precio por Boleto ($) *
              </label>
              <input
                type="text"
                name="pricePerTicket"
                value={formatWithThousands(formData.pricePerTicket)}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                placeholder="10.000"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1.5 sm:mb-2">
                Total de Boletos *
              </label>
              <input
                type="text"
                name="totalTickets"
                value={formatWithThousands(formData.totalTickets)}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
                placeholder="100.000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1.5 sm:mb-2">
              Fecha del Sorteo *
            </label>
            <input
              type="date"
              name="drawDate"
              value={formData.drawDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base"
              required
            />
          </div>

          {/* Premium Numbers Section */}
          <div>
            <label className="block text-gray-700 font-medium mb-1.5 sm:mb-2">
              Números Premium (Opcional)
            </label>
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Configura números especiales para este sorteo
                  </p>
                  {premiumNumbers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {premiumNumbers.slice(0, 10).map((pn) => (
                        <span
                          key={pn.number}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            pn.isBlocked
                              ? "bg-red-100 text-red-700 border border-red-300"
                              : "bg-green-100 text-green-700 border border-green-300"
                          }`}
                        >
                          <Star size={10} />
                          {formatTicketNumber(
                            pn.number,
                            parseInt(formData.totalTickets) || pn.number
                          )}
                        </span>
                      ))}
                      {premiumNumbers.length > 10 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{premiumNumbers.length - 10} más
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPremiumModal(true)}
                  disabled={
                    !formData.totalTickets ||
                    parseInt(formData.totalTickets) <= 0
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Star size={16} />
                  {premiumNumbers.length > 0 ? "Editar" : "Configurar"}
                </button>
              </div>
              {premiumNumbers.length > 0 && (
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex gap-4">
                    <span>Total: {premiumNumbers.length}</span>
                    <span>
                      Bloqueados:{" "}
                      {premiumNumbers.filter((p) => p.isBlocked).length}
                    </span>
                    <span>
                      Disponibles:{" "}
                      {premiumNumbers.filter((p) => !p.isBlocked).length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="order-first sm:order-none px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creando..." : "Crear Sorteo"}
            </button>
          </div>
        </form>
      </div>

      {/* Premium Numbers Modal */}
      <PremiumNumbersModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        totalTickets={parseInt(formData.totalTickets) || 0}
        selectedPremiumNumbers={premiumNumbers}
        onConfirm={(numbers) => setPremiumNumbers(numbers)}
      />
    </div>
  );
};

export default CreateRaffleModal;
