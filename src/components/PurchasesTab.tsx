import { useState } from "react";
import { useSorteazo } from "../contexts/SorteazoContext";
import { CheckCircle, XCircle, Trash2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { deletePurchase } from "../apis/rifa";
import { formatTicketNumber } from "../lib/utils";

interface PremiumNumber {
  number: number;
  isBlocked: boolean;
}

interface Raffle {
  id: string;
  title: string;
  pricePerTicket: number;
  totalTickets: number;
  premiumNumbers?: PremiumNumber[];
  users?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    payment: string;
    tickets: number[];
    paymentProof: string;
  }[];
  createdAt: string;
}

interface Purchase {
  id: string;
  raffleId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  ticketCount: number;
  paymentMethod: string;
  transactionId: string;
  paymentProof: string;
  status: "pending" | "confirmed" | "rejected";
  ticketNumbers: number[];
  createdAt: string;
}

interface PurchasesTabProps {
  raffles: Raffle[];
  purchases: Purchase[];
  onConfirmPurchase: (purchaseId: string) => Promise<void>;
  onRejectPurchase: (purchaseId: string) => void;
  onDeletePurchase: (purchaseId: string) => void;
}

const PurchasesTab = ({
  raffles,
  purchases,
  onConfirmPurchase,
  onRejectPurchase,
  onDeletePurchase,
}: PurchasesTabProps) => {
  const {
    deletePurchase: deletePurchaseContext,
    removeUserFromRaffle,
    loadRaffles,
  } = useSorteazo();
  const [selectedPurchase, setSelectedPurchase] = useState<string | null>(null);
  const [showDeletePurchaseModal, setShowDeletePurchaseModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleDeletePurchase = async (purchaseId: string) => {
    try {
      const userToDelete = allUsers.find((u) => u.id === purchaseId);

      if (!userToDelete) {
        toast.error("Usuario no encontrado");
        return;
      }

      if (userToDelete.source === "purchase") {
        // Eliminar compra pendiente de Firebase
        await deletePurchase(purchaseId);
        // Actualizar contexto local
        deletePurchaseContext(purchaseId);
        toast.success("Compra eliminada exitosamente");
      } else {
        // Eliminar usuario confirmado de la rifa usando el índice
        if (userToDelete.userIndex !== undefined) {
          await removeUserFromRaffle(
            userToDelete.raffleId,
            userToDelete.userIndex
          );

          // Recargar rifas para reflejar los cambios
          await loadRaffles();
          toast.success("Usuario eliminado de la rifa exitosamente");
        } else {
          toast.error("No se pudo identificar el usuario para eliminar");
        }
      }

      setShowDeletePurchaseModal(false);
      setSelectedPurchase(null);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("Error al eliminar. Inténtalo de nuevo.");
    }
  };

  const showImagePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  // Función para verificar si un número es premium
  const isPremiumNumber = (raffleId: string, ticketNumber: number): boolean => {
    const raffle = raffles.find((r) => r.id === raffleId);
    if (!raffle?.premiumNumbers) return false;

    return raffle.premiumNumbers.some(
      (premium) => premium.number === ticketNumber && !premium.isBlocked
    );
  };

  // Combinar usuarios de las rifas con las compras
  const getAllUsers = () => {
    const allUsers: Array<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      raffleId: string;
      ticketCount: number;
      tickets?: number[];
      paymentMethod?: string;
      transactionId?: string;
      paymentProof?: string;
      status: "confirmed" | "pending" | "rejected";
      createdAt: string;
      source: "raffle" | "purchase";
      userIndex?: number; // Agregar índice para usuarios de rifas
    }> = [];

    // Agregar usuarios de las rifas (ya confirmados)
    raffles.forEach((raffle) => {
      if (raffle.users) {
        raffle.users.forEach((user, index) => {
          allUsers.push({
            id: `${raffle.id}-user-${index}`,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            raffleId: raffle.id,
            ticketCount: user.tickets.length,
            tickets: user.tickets,
            paymentMethod: user.payment || undefined,
            paymentProof: user.paymentProof, // ¡Agregar el campo paymentProof!
            status: "confirmed",
            createdAt: raffle.createdAt,
            source: "raffle",
            userIndex: index, // Guardar el índice para poder eliminar el usuario específico
          });
        });
      }
    });

    // Agregar compras
    purchases.forEach((purchase) => {
      allUsers.push({
        id: purchase.id,
        firstName: purchase.firstName,
        lastName: purchase.lastName,
        email: purchase.email,
        phoneNumber: purchase.phoneNumber,
        raffleId: purchase.raffleId,
        ticketCount: purchase.ticketCount,
        tickets: purchase.ticketNumbers,
        paymentMethod: purchase.paymentMethod,
        transactionId: purchase.transactionId,
        paymentProof: purchase.paymentProof,
        status: purchase.status,
        createdAt: purchase.createdAt,
        source: "purchase",
      });
    });

    return allUsers.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const allUsers = getAllUsers();

  return (
    <>
      {/* Purchases Tab Content */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-0">
            Compras y Pagos
          </h2>

          {/* Legend */}
          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full"></div>
              <span>Boleto Regular</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-full"></div>
              <span>⭐ Boleto Premium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full"></div>
              <span>Usuario Confirmado</span>
            </div>
          </div>
        </div>

        {/* Mobile Cards View */}
        <div className="block md:hidden space-y-4">
          {[...allUsers].reverse().map((user) => {
            const raffle = raffles.find((r) => r.id === user.raffleId);
            return (
              <div
                key={user.id}
                className={`border border-gray-200 rounded-lg p-4 ${
                  user.source === "raffle" ? "bg-green-50" : "bg-white"
                }`}
              >
                {/* Header with name and status */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      {user.source === "raffle" && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Confirmado
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.phoneNumber && (
                      <p className="text-sm text-gray-600">📞 {user.phoneNumber}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-1">
                    {user.source === "purchase" && user.status === "pending" && (
                      <>
                        <button
                          onClick={() => onConfirmPurchase(user.id)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                          title="Confirmar"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          onClick={() => onRejectPurchase(user.id)}
                          className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                          title="Rechazar"
                        >
                          <XCircle size={16} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPurchase(user.id);
                        setShowDeletePurchaseModal(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title={user.source === "purchase" ? "Eliminar compra" : "Eliminar usuario"}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Raffle Info */}
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm text-gray-900 mb-1">
                    {raffle?.title || "Sorteo eliminado"}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {user.ticketCount} boletos
                    </span>
                    {raffle && (
                      <span className="text-green-600 font-medium">
                        {formatPrice(raffle.pricePerTicket * user.ticketCount)}
                      </span>
                    )}
                  </div>
                  {raffle && (
                    <p className="text-xs text-gray-500 mt-1">
                      {formatPrice(raffle.pricePerTicket)} c/u
                    </p>
                  )}
                </div>

                {/* Tickets */}
                {user.tickets && user.tickets.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-2">
                      Boletos ({user.tickets.length}):
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {user.tickets.map((ticket) => (
                        <span
                          key={ticket}
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            isPremiumNumber(user.raffleId, ticket)
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                              : "bg-blue-100 text-blue-800 border border-blue-300"
                          }`}
                        >
                          {isPremiumNumber(user.raffleId, ticket) && "⭐ "}
                          {formatTicketNumber(ticket, raffle?.totalTickets || ticket)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Method and Proof */}
                <div className="flex items-center justify-between">
                  <div>
                    {user.paymentMethod ? (
                      <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {user.paymentMethod}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin método</span>
                    )}
                  </div>
                  
                  {user.paymentProof ? (
                    <div
                      onClick={() => showImagePreview(user.paymentProof!)}
                      className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
                      title="Click para ver comprobante completo"
                    >
                      <img
                        src={user.paymentProof}
                        alt="Comprobante"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">Sin comprobante</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Cliente
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Sorteo
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Boletos
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Método
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Comprobante
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {[...allUsers].reverse().map((user) => {
                const raffle = raffles.find((r) => r.id === user.raffleId);
                return (
                  <tr
                    key={user.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 ${
                      user.source === "raffle" ? "bg-green-50" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {user.firstName} {user.lastName}
                          {user.source === "raffle" && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Confirmado
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        {user.phoneNumber && (
                          <p className="text-sm text-gray-600">
                            📞 {user.phoneNumber}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(user.createdAt)}
                        </p>
                        {user.tickets && user.tickets.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 mb-1">
                              Boletos ({user.tickets.length}):
                            </p>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                              {user.tickets.map((ticket) => (
                                <span
                                  key={ticket}
                                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                    isPremiumNumber(user.raffleId, ticket)
                                      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                      : "bg-blue-100 text-blue-800 border border-blue-300"
                                  }`}
                                >
                                  {isPremiumNumber(user.raffleId, ticket) &&
                                    "⭐ "}
                                  {formatTicketNumber(
                                    ticket,
                                    raffle?.totalTickets || ticket
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {raffle?.title || "Sorteo eliminado"}
                        </p>
                        {raffle && (
                          <p className="text-sm text-gray-600">
                            {formatPrice(raffle.pricePerTicket)} c/u
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {user.ticketCount} boletos
                        </p>
                        {raffle && (
                          <p className="text-sm text-green-600 font-medium">
                            Total:{" "}
                            {formatPrice(
                              raffle.pricePerTicket * user.ticketCount
                            )}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {user.paymentMethod ? (
                        <span className="capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                          {user.paymentMethod}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {user.paymentProof ? (
                        <div className="flex items-center gap-2">
                          <div
                            onClick={() => showImagePreview(user.paymentProof!)}
                            className="w-12 h-12 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-purple-300 transition-colors"
                            title="Click para ver comprobante completo"
                          >
                            <img
                              src={user.paymentProof}
                              alt="Comprobante"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Sin comprobante
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 sm:gap-2">
                        {user.source === "purchase" &&
                          user.status === "pending" && (
                            <>
                              <button
                                onClick={() => onConfirmPurchase(user.id)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors touch-manipulation"
                                title="Confirmar"
                              >
                                <CheckCircle size={16} />
                              </button>
                              <button
                                onClick={() => onRejectPurchase(user.id)}
                                className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors touch-manipulation"
                                title="Rechazar"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}

                        {/* Botón de eliminar para todos los usuarios */}
                        <button
                          onClick={() => {
                            setSelectedPurchase(user.id);
                            setShowDeletePurchaseModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors touch-manipulation"
                          title={
                            user.source === "purchase"
                              ? "Eliminar compra"
                              : "Eliminar usuario"
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Purchase Modal */}
      {showDeletePurchaseModal && selectedPurchase && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {allUsers.find((u) => u.id === selectedPurchase)?.source ===
                "purchase"
                  ? "Eliminar Compra"
                  : "Eliminar Usuario"}
              </h2>
              <button
                onClick={() => {
                  setShowDeletePurchaseModal(false);
                  setSelectedPurchase(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1 text-base sm:text-lg">
                    ¿Estás seguro?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {allUsers.find((u) => u.id === selectedPurchase)?.source ===
                    "purchase"
                      ? "Esta acción eliminará permanentemente esta compra y todos sus datos asociados."
                      : "Esta acción eliminará permanentemente este usuario y todos sus datos asociados."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setShowDeletePurchaseModal(false);
                    setSelectedPurchase(null);
                  }}
                  className="w-full sm:flex-1 px-4 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDeletePurchase(selectedPurchase)}
                  className="w-full sm:flex-1 px-4 py-3 sm:py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl max-h-[90vh] w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-bold">
                Comprobante de Pago
              </h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setSelectedImage("");
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="bg-white rounded-lg p-4 flex justify-center">
              <img
                src={selectedImage}
                alt="Comprobante de pago"
                className="max-w-full max-h-[70vh] object-contain rounded"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PurchasesTab;