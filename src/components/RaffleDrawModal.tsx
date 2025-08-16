import { useState, useEffect } from "react";
import { useSorteazo } from "../contexts/SorteazoContext";
import { X, Trophy, Sparkles, User, Mail, Phone, Star } from "lucide-react";
import { toast } from "sonner";
import { formatTicketNumber } from "../lib/utils";

interface RaffleDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  raffleId: string;
}

interface Winner {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  tickets: number[];
  winningTicket: number;
  isPremium: boolean;
}

const RaffleDrawModal = ({
  isOpen,
  onClose,
  raffleId,
}: RaffleDrawModalProps) => {
  const { raffles, getOccupiedTicketsCount } = useSorteazo();
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Winner | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [currentSpinNumber, setCurrentSpinNumber] = useState(1);

  const raffle = raffles.find((r) => r.id === raffleId);

  // Función para verificar si un número es premium
  const isPremiumNumber = (ticketNumber: number): boolean => {
    if (!raffle?.premiumNumbers) return false;
    return raffle.premiumNumbers.some(
      (premium) => premium.number === ticketNumber && !premium.isBlocked
    );
  };

  // Función para obtener todos los usuarios con boletos
  const getAllParticipants = () => {
    if (!raffle?.users) return [];

    const participants: Array<{
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber?: string;
      tickets: number[];
    }> = [];

    raffle.users.forEach((user) => {
      if (user.tickets && user.tickets.length > 0) {
        participants.push({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          tickets: user.tickets,
        });
      }
    });

    return participants;
  };

  const handleDraw = () => {
    const participants = getAllParticipants();
    if (!raffle || participants.length === 0) {
      toast.error("No hay participantes en este sorteo");
      return;
    }

    setIsSpinning(true);
    setShowResult(false);
    setWinner(null);
    setCurrentSpinNumber(1);

    // Animación de sorteo
    const spinInterval = setInterval(() => {
      setCurrentSpinNumber((prev) => {
        const max = raffle.totalTickets;
        return prev >= max ? 1 : prev + 1;
      });
    }, 100);

    // Después de 3 segundos, seleccionar ganador
    setTimeout(() => {
      clearInterval(spinInterval);

      // Crear un array con todos los boletos vendidos
      const allSoldTickets: Array<{
        ticket: number;
        owner: (typeof participants)[0];
      }> = [];

      participants.forEach((participant) => {
        participant.tickets.forEach((ticket) => {
          allSoldTickets.push({
            ticket,
            owner: participant,
          });
        });
      });

      // Seleccionar ganador aleatoriamente
      const randomIndex = Math.floor(Math.random() * allSoldTickets.length);
      const winningEntry = allSoldTickets[randomIndex];

      const winnerData: Winner = {
        firstName: winningEntry.owner.firstName,
        lastName: winningEntry.owner.lastName,
        email: winningEntry.owner.email,
        phoneNumber: winningEntry.owner.phoneNumber,
        tickets: winningEntry.owner.tickets,
        winningTicket: winningEntry.ticket,
        isPremium: isPremiumNumber(winningEntry.ticket),
      };

      setCurrentSpinNumber(winningEntry.ticket);
      setWinner(winnerData);
      setIsSpinning(false);
      setShowResult(true);

      const premiumText = winnerData.isPremium
        ? " ¡Era un número PREMIUM! 🌟"
        : "";
      toast.success(
        `¡Sorteo realizado! Ganador: ${winnerData.firstName} ${winnerData.lastName} con el boleto #${formatTicketNumber(winnerData.winningTicket, raffle.totalTickets)}${premiumText}`
      );
    }, 3000);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsSpinning(false);
      setShowResult(false);
      setWinner(null);
      setCurrentSpinNumber(1);
    }
  }, [isOpen]);

  if (!isOpen || !raffle) return null;

  const participants = getAllParticipants();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-1 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl max-w-3xl w-full h-full sm:h-auto sm:max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex-1 mr-3">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800 leading-tight">
              🎲 Sorteo en Vivo
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {raffle.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
            disabled={isSpinning}
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-3 sm:p-6 pb-20 sm:pb-6">
          {/* Información del sorteo */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Participantes
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {participants.length}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Vendidos</p>
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {getOccupiedTicketsCount(raffle)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-xs sm:text-sm">Total</p>
                <p className="text-lg sm:text-xl font-bold text-gray-800">
                  {raffle.totalTickets}
                </p>
              </div>
            </div>
          </div>

          {/* Rueda de sorteo mejorada */}
          <div className="text-center mb-4 sm:mb-8">
            <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 mb-4 sm:mb-6">
              {/* Círculo exterior con gradiente animado */}
              <div
                className={`w-full h-full rounded-full relative overflow-hidden ${
                  isSpinning ? "animate-spin" : ""
                }`}
                style={{
                  background:
                    "conic-gradient(from 0deg, #f97316, #ef4444, #f59e0b, #10b981, #3b82f6, #8b5cf6, #ec4899, #f97316)",
                  animationDuration: isSpinning ? "0.1s" : "0s",
                  boxShadow:
                    "0 0 30px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.2)",
                }}
              >
                <div className="absolute inset-2 rounded-full bg-white shadow-2xl"></div>
              </div>

              {/* Centro de la rueda */}
              <div className="absolute inset-6 sm:inset-8 rounded-full bg-gradient-to-br from-white to-gray-50 flex items-center justify-center shadow-xl border-2 sm:border-4 border-gray-100">
                {isSpinning ? (
                  <div className="text-center px-2">
                    <Sparkles
                      className="animate-pulse text-orange-500 mx-auto mb-2 sm:mb-3"
                      size={32}
                    />
                    <div className="text-2xl sm:text-4xl font-bold text-gray-800 animate-pulse">
                      #
                      {formatTicketNumber(
                        currentSpinNumber,
                        raffle.totalTickets
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                      Sorteando...
                    </div>
                  </div>
                ) : showResult && winner ? (
                  <div className="text-center px-2">
                    <div className="flex items-center justify-center mb-1 sm:mb-2">
                      <Trophy
                        className="text-yellow-500 mr-1 sm:mr-2"
                        size={24}
                      />
                      {winner.isPremium && (
                        <Star
                          className="text-yellow-500"
                          size={20}
                          fill="currentColor"
                        />
                      )}
                    </div>
                    <div className="text-2xl sm:text-4xl font-bold text-green-600">
                      #
                      {formatTicketNumber(
                        winner.winningTicket,
                        raffle.totalTickets
                      )}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1">
                      {winner.isPremium ? "¡Premium!" : "¡Ganador!"}
                    </div>
                  </div>
                ) : (
                  <div className="text-center px-2">
                    <Trophy
                      className="text-gray-400 mx-auto mb-2 sm:mb-3"
                      size={32}
                    />
                    <div className="text-sm sm:text-lg font-bold text-gray-800">
                      ¿Listo?
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                      {participants.length} participantes
                    </div>
                  </div>
                )}
              </div>

              {/* Flecha indicadora mejorada */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 sm:-translate-y-3">
                <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 sm:border-l-6 sm:border-r-6 sm:border-b-12 border-transparent border-b-red-500 drop-shadow-lg"></div>
              </div>

              {/* Efectos de partículas cuando hay ganador */}
              {showResult && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-2 left-2 sm:top-4 sm:left-4 animate-bounce text-2xl sm:text-4xl">
                    🎉
                  </div>
                  <div
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 animate-bounce text-2xl sm:text-4xl"
                    style={{ animationDelay: "0.2s" }}
                  >
                    🎊
                  </div>
                  <div
                    className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 animate-bounce text-2xl sm:text-4xl"
                    style={{ animationDelay: "0.4s" }}
                  >
                    ✨
                  </div>
                  <div
                    className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 animate-bounce text-2xl sm:text-4xl"
                    style={{ animationDelay: "0.6s" }}
                  >
                    🎈
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resultado del sorteo con datos del ganador */}
          {showResult && winner && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-4 sm:mb-6 shadow-lg">
              <div className="text-center mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Trophy className="text-yellow-500" size={32} />
                  <h3 className="text-xl sm:text-3xl font-bold text-green-700">
                    ¡Tenemos Ganador!
                  </h3>
                  {winner.isPremium && (
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 sm:px-3 py-1 rounded-full">
                      <Star
                        className="text-yellow-600"
                        size={14}
                        fill="currentColor"
                      />
                      <span className="text-xs font-bold text-yellow-600">
                        PREMIUM
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-md border border-green-200">
                  <div className="space-y-4 sm:space-y-6">
                    {/* Boleto ganador destacado */}
                    <div className="text-center">
                      <p className="text-sm sm:text-base text-gray-600 mb-2">
                        Boleto Ganador
                      </p>
                      <div
                        className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-xl sm:text-2xl ${
                          winner.isPremium
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {winner.isPremium && (
                          <Star size={16} fill="currentColor" />
                        )}
                        #
                        {formatTicketNumber(
                          winner.winningTicket,
                          raffle.totalTickets
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      {/* Información del ganador */}
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                          👤 Datos del Ganador
                        </h4>

                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex items-start gap-3">
                            <User className="text-blue-500 mt-1" size={18} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm text-gray-600">
                                Nombre completo
                              </p>
                              <p className="font-bold text-sm sm:text-base text-gray-800 break-words">
                                {winner.firstName} {winner.lastName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Mail className="text-green-500 mt-1" size={18} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs sm:text-sm text-gray-600">
                                Email
                              </p>
                              <p className="font-medium text-sm sm:text-base text-gray-800 break-all">
                                {winner.email}
                              </p>
                            </div>
                          </div>

                          {winner.phoneNumber && (
                            <div className="flex items-start gap-3">
                              <Phone
                                className="text-purple-500 mt-1"
                                size={18}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm text-gray-600">
                                  Teléfono
                                </p>
                                <p className="font-medium text-sm sm:text-base text-gray-800">
                                  {winner.phoneNumber}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Información de boletos */}
                      <div className="space-y-3 sm:space-y-4">
                        <h4 className="text-base sm:text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                          🎫 Sus Boletos
                        </h4>

                        <div className="space-y-3">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">
                              Todos sus boletos ({winner.tickets.length})
                            </p>
                            <div className="flex flex-wrap gap-1 max-h-20 sm:max-h-24 overflow-y-auto">
                              {winner.tickets.map((ticket) => (
                                <span
                                  key={ticket}
                                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    ticket === winner.winningTicket
                                      ? "bg-green-500 text-white shadow-lg"
                                      : isPremiumNumber(ticket)
                                        ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                                        : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {isPremiumNumber(ticket) &&
                                    ticket !== winner.winningTicket &&
                                    "⭐"}
                                  {formatTicketNumber(
                                    ticket,
                                    raffle.totalTickets
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {participants.length === 0 && (
            <div className="text-center mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-medium text-sm sm:text-base">
                ⚠️ No se puede realizar el sorteo porque no hay participantes.
              </p>
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                Debe haber al menos un usuario con boletos comprados.
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción fijos en la parte inferior para móvil */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            {!showResult && (
              <button
                onClick={handleDraw}
                disabled={isSpinning || participants.length === 0}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 sm:px-8 py-4 rounded-full font-bold text-base sm:text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation"
              >
                {isSpinning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white"></div>
                    <span className="text-sm sm:text-lg">Sorteando...</span>
                  </>
                ) : (
                  <>
                    <Trophy size={20} className="sm:w-6 sm:h-6" />
                    <span className="text-sm sm:text-lg">
                      🎲 Realizar Sorteo
                    </span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              disabled={isSpinning}
              className="px-6 sm:px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto font-medium text-base sm:text-lg touch-manipulation"
            >
              {showResult ? "Cerrar" : "Cancelar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RaffleDrawModal;
