import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSorteazo } from "../contexts/SorteazoContext";
import Header from "../components/Header";
import WhatsAppButton from "../components/WhatsAppButton";
import CountdownTimer from "../components/CountdownTimer";
import bg from "../../public/iamgenes/bg.png";

import Footer from "../components/Footer";
import {
  Calendar,
  Ticket,
  Users,
  ArrowLeft,
  Plus,
  Minus,
  Shield,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

const RaffleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { raffles, getOccupiedTicketsCount, getAvailableTicketsCount } =
    useSorteazo();
  const [ticketCount, setTicketCount] = useState(1);
  const [isFirstPurchase, setIsFirstPurchase] = useState(true);

  const raffle = raffles.find((r) => r.id === id);

  // Scroll to top smoothly when component mounts or raffle ID changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id]);

  if (!raffle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Sorteo no encontrado
          </h1>
          <Link
            to="/"
            className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base"
          >
            Volver al inicio
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

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

  const handleTicketChange = (change: number) => {
    const newCount = ticketCount + change;
    const availableTickets = getAvailableTicketsCount(raffle);
    // Mínimo siempre 1 boleto
    const minTickets = 1;
    if (newCount >= minTickets && newCount <= availableTickets) {
      setTicketCount(newCount);
    }
  };

  const handlePurchase = () => {
    if (raffle.status === "active" && ticketCount >= 1) {
      navigate(`/pago/${raffle.id}?tickets=${ticketCount}`);
    }
  };


  const occupiedTicketsCount = getOccupiedTicketsCount(raffle);
  const availableTickets = getAvailableTicketsCount(raffle);
  const isLowStock = availableTickets < raffle.totalTickets * 0.25;
  const soldPercentage = (occupiedTicketsCount / raffle.totalTickets) * 100;

  return (
    <div className={`min-h-screen`} id="raffleDetail">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium mb-4 sm:mb-6 hover:scale-105 transition-all duration-200 text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          Volver a sorteos
        </Link>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 max-w-8xl mx-auto">
          {/* Left Column - Image and Countdown */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* Main Image */}
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-white ">
              <div className="aspect-square sm:aspect-[4/3] lg:aspect-video">
                <img
                  src={raffle.image}
                  alt={raffle.title}
                  className="w-full h-full object-cover"
                />
                {/* Overlay Badges */}
                {isLowStock && (
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm animate-pulse shadow-lg">
                    ¡Últimos boletos!
                  </div>
                )}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg">
                  <Shield size={14} className="sm:w-4 sm:h-4" />
                  Pago Seguro
                </div>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <CountdownTimer targetDate={raffle.drawDate} />
            </div>

            {/* Mobile Title and Description */}
            <div className="xl:hidden bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 ">
                {raffle.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                {raffle.description}
              </p>
            </div>
          </div>

          {/* Right Column - Details and Purchase */}
          <div className="space-y-4 sm:space-y-6">
            {/* Desktop Title and Description */}
            <div className="hidden xl:block bg-white rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-4 ">
                {raffle.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {raffle.description}
              </p>
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-3 sm:gap-4 ">
              <div className="bg-white p-4 sm:p-5 rounded-xl  hover:shadow-xl transition-shadow duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center gap-3 mb-2 ">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Ticket
                      className="text-orange-500 sm:w-6 sm:h-6"
                      size={20}
                    />
                  </div>
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">
                    Precio por boleto
                  </span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-orange-500 ml-11">
                  {formatPrice(raffle.pricePerTicket)}
                </p>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-xl transition-shadow duration-300 sm:col-span-3 xl:col-span-1">
                <div className="flex items-center gap-3 mb-2 ">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar
                      className="text-green-500 sm:w-6 sm:h-6"
                      size={20}
                    />
                  </div>
                  <span className="font-semibold text-gray-700 text-sm sm:text-base">
                    Fecha del sorteo
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-bold text-green-500 ml-11">
                  {formatDate(raffle.drawDate)}
                </p>
              </div>
            </div>

            
            {/* Ticket Selection */}
            {raffle.status === "active" && availableTickets > 0 && (
              <div className="bg-white p-5 sm:p-6 rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-orange-200 hover:border-orange-300 transition-colors duration-300">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">
                  Selecciona tus boletos
                </h3>
                

                {/* Ticket Counter */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <button
                    onClick={() => handleTicketChange(-1)}
                    disabled={ticketCount <= 1}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-200 disabled:hover:to-gray-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                  >
                    <Minus size={20} className="sm:w-6 sm:h-6" />
                  </button>

                  <div className="text-center min-w-[80px]">
                    <p className="text-3xl sm:text-4xl font-bold text-orange-500 mb-1">
                      {ticketCount} 
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      boletos
                    </p>
                  </div>

                  <button
                    onClick={() => handleTicketChange(1)}
                    disabled={ticketCount >= availableTickets}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-gray-200 disabled:hover:to-gray-300 flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-md"
                  >
                    <Plus size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Total Price */}
                <div className="text-center mb-6 sm:mb-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Total: {formatPrice(raffle.pricePerTicket * ticketCount)}
                  </p>
                </div>

                {/* Important Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 sm:mb-8">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      className="text-yellow-600 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <div>
                      <p className="text-yellow-800 text-sm sm:text-base font-medium mb-1">
                        Importante:
                      </p>
                      <p className="text-yellow-700 text-xs sm:text-sm leading-relaxed">
                        Debes guardar el de comprobante de pago para
                        confirmar tu compra.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 sm:py-5 px-6 rounded-full font-bold text-base sm:text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  Comprar Boletos
                </button>
              </div>
            )}

            {/* Status Messages */}
            {raffle.status === "finished" && (
              <div className="bg-gray-100 p-6 rounded-xl text-center shadow-lg">
                <p className="text-xl font-bold text-gray-600">
                  Este sorteo ya finalizó
                </p>
              </div>
            )}

            {raffle.status === "active" && availableTickets === 0 && (
              <div className="bg-yellow-100 p-6 rounded-xl text-center shadow-lg border border-yellow-300">
                <p className="text-xl font-bold text-yellow-700">
                  ¡Todos los boletos han sido vendidos!
                </p>
              </div>
            )}

           
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default RaffleDetail;
