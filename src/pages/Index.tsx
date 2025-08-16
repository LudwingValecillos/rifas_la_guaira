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
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-16 sm:py-20 md:py-24 overflow-hidden min-h-screen flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent"></div>
        <div className="absolute top-10 sm:top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-amber-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10 w-full">
          <div className="max-w-6xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-2 sm:px-4 sm:py-2 rounded-full mb-6 sm:mb-8 font-semibold text-sm sm:text-base">
              <CheckCircle size={14} className="sm:w-4 sm:h-4" />
              <span>Plataforma Certificada y Regulada</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 sm:mb-6 md:mb-8 leading-tight">
              Sorteos{" "}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                Oficiales
              </span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-slate-300 font-bold">
                con Garantía Legal
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-slate-300 max-w-4xl mx-auto leading-relaxed px-2 sm:px-4">
              Participa en sorteos transparentes y verificados. Todos nuestros
              premios están respaldados legalmente y se entregan según términos
              registrados.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12 text-slate-400 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400">
                  +50k
                </div>
                <div className="text-xs sm:text-sm md:text-base">
                  Participantes
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400">
                  $2M+
                </div>
                <div className="text-xs sm:text-sm md:text-base">Premios</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-orange-400">
                  99.8%
                </div>
                <div className="text-xs sm:text-sm md:text-base">
                  Satisfacción
                </div>
              </div>
            </div>

            {/* Trust Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10 md:mb-12 max-w-5xl mx-auto">
              <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 rounded-xl border border-slate-700 hover:border-orange-500/50 transition-all duration-300">
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-lg flex-shrink-0">
                  <Shield size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-white text-sm sm:text-base">
                    Seguro
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">
                    Pagos 100% Seguros
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 rounded-xl border border-slate-700 hover:border-orange-500/50 transition-all duration-300">
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-lg flex-shrink-0">
                  <Award size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-white text-sm sm:text-base">
                    Verificado
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">
                    Auditoría Externa
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-800/50 backdrop-blur-sm px-4 py-3 sm:px-6 sm:py-4 rounded-xl border border-slate-700 hover:border-orange-500/50 transition-all duration-300 sm:col-span-2 lg:col-span-1">
                <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2 rounded-lg flex-shrink-0">
                  <TrendingUp size={18} className="text-white sm:w-5 sm:h-5" />
                </div>
                <div className="text-left min-w-0">
                  <div className="font-semibold text-white text-sm sm:text-base">
                    Transparente
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400">
                    Sorteo Público
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center max-w-md sm:max-w-none mx-auto">
              <a
                href="#sorteos"
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-6 py-4 sm:px-8 sm:py-5 md:px-10 rounded-full font-bold text-base sm:text-lg hover:from-orange-600 hover:to-amber-700 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 hover:scale-105 transform"
              >
                <Gift size={20} className="sm:w-6 sm:h-6" />
                <span className="whitespace-nowrap">Ver Sorteos Activos</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform sm:w-6 sm:h-6"
                />
              </a>

              <Link
                to="/terminos"
                className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-slate-600 text-slate-300 px-6 py-4 sm:px-8 sm:py-5 md:px-10 rounded-full font-bold text-base sm:text-lg hover:border-orange-500 hover:text-orange-400 transition-all duration-300 hover:bg-slate-800/50"
              >
                <Shield size={20} className="sm:w-6 sm:h-6" />
                <span className="whitespace-nowrap">Marco Legal</span>
              </Link>
            </div>

            {/* Legal Notice */}
            <p className="text-xs sm:text-sm text-slate-500 mt-6 sm:mt-8 max-w-2xl mx-auto leading-relaxed px-4">
              JRaffle Company opera bajo licencia oficial. Todos los sorteos
              cumplen con la normativa vigente y son supervisados por entes
              regulatorios. Juega responsablemente.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-gray-600 px-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={24} />
              <span className="font-medium">Verificado por autoridades</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="text-yellow-500" size={24} />
              <span className="font-medium">+500 ganadores satisfechos.</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-blue-500" size={24} />
              <span className="font-medium">Pagos 100% seguros.</span>
            </div>
          </div>
        </div>
      </section>

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
      <section id="sorteos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-12 px-4">
            <Sparkles className="text-orange-500" size={32} />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
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
                      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                      {isLowStock && (
                        <div className="bg-red-500 text-white text-center py-2 font-bold text-sm">
                          ¡Últimos boletos disponibles!
                        </div>
                      )}
                      <div className="aspect-video overflow-hidden relative">
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
