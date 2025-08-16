import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSorteazo } from "../contexts/SorteazoContext";
import CreateRaffleModal from "../components/CreateRaffleModal";
import EditRaffleModal from "../components/EditRaffleModal";
import DeleteRaffleModal from "../components/DeleteRaffleModal";
import RaffleDrawModal from "../components/RaffleDrawModal";
import PurchasesTab from "../components/PurchasesTab";
import {
  LogOut,
  Plus,
  Edit,
  Trash2,
  Zap,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const {
    raffles,
    purchases,
    isAdmin,
    logout,
    confirmPurchase,
    rejectPurchase,
    getOccupiedTicketsCount,
  } = useSorteazo();

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("raffles");
  const [selectedRaffle, setSelectedRaffle] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRaffleDrawModal, setShowRaffleDrawModal] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada exitosamente");
    navigate("/admin");
  };

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

  const handleConfirmPurchase = async (purchaseId: string) => {
    try {
      await confirmPurchase(purchaseId);
      toast.success("Compra confirmada exitosamente");
    } catch (error) {
      console.error("Error al confirmar compra:", error);
      toast.error("Error al confirmar la compra. Inténtalo de nuevo.");
    }
  };

  const handleRejectPurchase = (purchaseId: string) => {
    rejectPurchase(purchaseId);
    toast.success("Compra rechazada");
  };

  const totalRevenue = raffles.reduce((sum, raffle) => {
    const occupiedTickets = getOccupiedTicketsCount(raffle);
    return sum + occupiedTickets * raffle.pricePerTicket;
  }, 0);

  const totalSoldTickets = raffles.reduce((sum, raffle) => {
    return sum + getOccupiedTicketsCount(raffle);
  }, 0);
  const pendingPurchases = purchases.filter(
    (p) => p.status === "pending"
  ).length;

  if (!isAdmin) {
    return null;
  }
  window.scrollTo(0, 0);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Panel de Administración
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                <LogOut size={18} />
                <span>Ir a inicio</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ingresos Totales</p>
                <p className="text-xl sm:text-2xl font-bold text-green-500">
                  {formatPrice(totalRevenue)}
                </p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Sorteos Activos</p>
                <p className="text-xl sm:text-2xl font-bold text-blue-500">
                  {raffles.filter((r) => r.status === "active").length}
                </p>
              </div>
              <Calendar className="text-blue-500" size={32} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Boletos Vendidos</p>
                <p className="text-xl sm:text-2xl font-bold text-purple-500">
                  {totalSoldTickets}
                </p>
              </div>
              <TrendingUp className="text-purple-500" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap">
              <button
                onClick={() => setActiveTab("raffles")}
                className={`px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base ${
                  activeTab === "raffles"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Gestión de Sorteos
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={`px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base ${
                  activeTab === "purchases"
                    ? "border-b-2 border-orange-500 text-orange-500"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Compras y Pagos
              </button>
            </nav>
          </div>

          <div className="p-3 sm:p-6">
            {/* Raffles Tab */}
            {activeTab === "raffles" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Sorteos
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                  >
                    <Plus size={18} />
                    Crear Sorteo
                  </button>
                </div>

              {/* Mobile Cards View */}
<div className="block md:hidden space-y-4">
  {raffles.length === 0 ? (
    <div className="text-center py-8">
      <div className="bg-gray-50 rounded-lg p-8">
        <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No hay sorteos disponibles
        </h3>
        <p className="text-gray-600 mb-4">
          Crea tu primer sorteo para comenzar a gestionar tu plataforma.
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors mx-auto"
        >
          <Plus size={18} />
          Crear Primer Sorteo
        </button>
      </div>
    </div>
  ) : (
    raffles.map((raffle) => (
    <div key={raffle.id} className="border border-gray-200 rounded-lg p-4 bg-white">
      {/* Header with image, title and actions */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={raffle.image}
          alt={raffle.title}
          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
            {raffle.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2">
            {formatDate(raffle.drawDate)}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={() => {
              setSelectedRaffle(raffle.id);
              setShowEditModal(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              setSelectedRaffle(raffle.id);
              setShowDeleteModal(true);
            }}
            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
          {raffle.status === "active" &&
            getOccupiedTicketsCount(raffle) > 0 && (
              <button
                onClick={() => {
                  setSelectedRaffle(raffle.id);
                  setShowRaffleDrawModal(true);
                }}
                className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                title="Sorteo en Vivo"
              >
                <Zap size={16} />
              </button>
            )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Boletos Vendidos</p>
          <p className="font-medium text-gray-900">
            {getOccupiedTicketsCount(raffle)} / {raffle.totalTickets}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(getOccupiedTicketsCount(raffle) / raffle.totalTickets) * 100}%`
              }}
            ></div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Ingresos</p>
          <p className="font-medium text-green-600">
            {formatPrice(
              getOccupiedTicketsCount(raffle) * raffle.pricePerTicket
            )}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatPrice(raffle.pricePerTicket)} c/u
          </p>
        </div>
      </div>
    </div>
  ))
  )}
</div>

{/* Desktop Table View */}
<div className="hidden md:block overflow-x-auto -mx-3 sm:mx-0">
  {raffles.length === 0 ? (
    <div className="text-center py-8">
      <div className="bg-gray-50 rounded-lg p-8">
        <Calendar className="text-gray-400 mx-auto mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No hay sorteos disponibles
        </h3>
        <p className="text-gray-600 mb-4">
          Crea tu primer sorteo para comenzar a gestionar tu plataforma.
        </p>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors mx-auto"
        >
          <Plus size={18} />
          Crear Primer Sorteo
        </button>
      </div>
    </div>
  ) : (
    <table className="w-full min-w-[700px]">
      <thead>
        <tr className="border-b border-gray-200">
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Título
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Fecha
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Boletos
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Ingresos
          </th>
          <th className="text-left py-3 px-4 font-medium text-gray-700">
            Acciones
          </th>
        </tr>
      </thead>
      <tbody>
        {raffles.map((raffle) => (
        <tr
          key={raffle.id}
          className="border-b border-gray-100 hover:bg-gray-50"
        >
          <td className="py-3 px-4">
            <div className="flex items-center gap-3">
              <img
                src={raffle.image}
                alt={raffle.title}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <span className="font-medium">
                {raffle.title}
              </span>
            </div>
          </td>
          <td className="py-3 px-4 text-gray-600">
            {formatDate(raffle.drawDate)}
          </td>
          <td className="py-3 px-4">
            <span className="text-sm">
              {getOccupiedTicketsCount(raffle)} /{" "}
              {raffle.totalTickets}
            </span>
          </td>
          <td className="py-3 px-4 font-medium text-green-600">
            {formatPrice(
              getOccupiedTicketsCount(raffle) *
                raffle.pricePerTicket
            )}
          </td>

          <td className="py-3 px-4">
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => {
                  setSelectedRaffle(raffle.id);
                  setShowEditModal(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors touch-manipulation"
                title="Editar"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => {
                  setSelectedRaffle(raffle.id);
                  setShowDeleteModal(true);
                }}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors touch-manipulation"
                title="Eliminar"
              >
                <Trash2 size={16} />
              </button>
              {raffle.status === "active" &&
                getOccupiedTicketsCount(raffle) > 0 && (
                  <button
                    onClick={() => {
                      setSelectedRaffle(raffle.id);
                      setShowRaffleDrawModal(true);
                    }}
                    className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors touch-manipulation"
                    title="Sorteo en Vivo"
                  >
                    <Zap size={16} />
                  </button>
                )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  )}
</div>
              </div>
            )}

            {/* Purchases Tab */}
            {activeTab === "purchases" && (
              <PurchasesTab
                raffles={raffles}
                purchases={purchases}
                onConfirmPurchase={handleConfirmPurchase}
                onRejectPurchase={handleRejectPurchase}
                onDeletePurchase={() => {}}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateRaffleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedRaffle && (
        <>
          <EditRaffleModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedRaffle(null);
            }}
            raffleId={selectedRaffle}
          />

          <DeleteRaffleModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedRaffle(null);
            }}
            raffleId={selectedRaffle}
          />



          <RaffleDrawModal
            isOpen={showRaffleDrawModal}
            onClose={() => {
              setShowRaffleDrawModal(false);
              setSelectedRaffle(null);
            }}
            raffleId={selectedRaffle}
          />
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
