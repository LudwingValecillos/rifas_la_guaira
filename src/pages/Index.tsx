import { Link } from "react-router-dom";
import { useSorteazo } from "../contexts/SorteazoContext";
import Header from "../components/Header";
import WhatsAppButton from "../components/WhatsAppButton";
import Footer from "../components/Footer";
import {
  Sparkles,
  Gift,
  Users,
  Shield,
  ArrowRight,
  Clock,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
} from "lucide-react";
import { log } from "console";
import { getAllRifas } from "@/apis/rifa";
import HeroSection from "@/components/HeroSection";
import logo from "../../public/iamgenes/2.webp";

const Index = () => {
  const { raffles, getOccupiedTicketsCount, getAvailableTicketsCount } =
    useSorteazo();

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
  window.scrollTo(0, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* How it Works */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-6 sm:px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
            ¿Cómo Funciona?
          </h2>
          <div className="flex flex-col space-y-8 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
            <div className="text-center sm:p-6 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Gift className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
                1. Elige tu Sorteo
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Selecciona el sorteo que más te guste de nuestra amplia variedad
                de premios increíbles.
              </p>
            </div>

            <div className="text-center sm:p-6 group hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-br from-green-400 to-green-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Clock className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
                2. Compra tus Boletos
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Compra mínimo 2 boletos y envía tu comprobante de pago por
                WhatsApp para confirmar.
              </p>
            </div>

            <div className="text-center sm:p-6 group hover:scale-105 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Sparkles className="text-white" size={28} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-800">
                3. ¡Gana!
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Espera el día del sorteo y podrías ser el afortunado ganador del
                premio. ¡La suerte te espera!
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Active Raffles */}
      <section id="sorteos" className="contenido-seccion">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-12 px-4">
            <Sparkles className="text-orange-500" size={32} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white underline">
              Sorteos Disponibles
            </h2>
            <Sparkles className="text-orange-500" size={32} />
          </div>

          {raffles.filter((raffle) => raffle.status === "active").length ===
          0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <Gift className="text-gray-400 mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  No hay sorteos disponibles
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  En este momento no tenemos sorteos activos.
                </p>
                <p className="text-gray-500 mb-6">
                  ¡Vuelve pronto para participar en nuestros increíbles sorteos!
                </p>
                <div className="flex items-center justify-center gap-2 text-orange-500">
                  <Clock size={20} />
                  <span className="text-sm font-medium">Nuevos sorteos próximamente</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4">
              {raffles
                .filter((raffle) => raffle.status === "active")
                .map((raffle) => {
                  const occupiedTicketsCount = getOccupiedTicketsCount(raffle);
                  const availableTickets = getAvailableTicketsCount(raffle);
                  const soldPercentage =
                    (occupiedTicketsCount / raffle.totalTickets) * 100;
                  const isLowStock =
                    availableTickets < raffle.totalTickets * 0.25;

                  return (
                    <div
                      key={raffle.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {isLowStock && (
                        <div className="bg-red-500 text-white text-center py-2 font-bold text-sm">
                          ¡Últimos boletos disponibles!
                        </div>
                      )}
                      <div className="aspect-video overflow-hidden relative ">
                        <img
                          src={raffle.image}
                          alt={raffle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          Pago Seguro
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-3 text-gray-800">
                          {raffle.title}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <p className="text-2xl font-bold text-orange-500">
                            {formatPrice(raffle.pricePerTicket)} por boleto
                          </p>
                          <p className="text-gray-600">
                            Sorteo: {formatDate(raffle.drawDate)}
                          </p>
                        </div>

                        <Link
                          to={`/sorteo/${raffle.id}`}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 block text-center hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
