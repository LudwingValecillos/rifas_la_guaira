import Header from "../components/Header";
import WhatsAppButton from "../components/WhatsAppButton";
import { ArrowLeft, Shield, AlertCircle, Clock, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  window.scrollTo(0, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium mb-6"
        >
          <ArrowLeft size={20} />
          Volver al inicio
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            <div className="text-center mb-5 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-4">
                Términos y Condiciones
              </h1>
              <p className="text-gray-600">
                Lee cuidadosamente nuestros términos antes de participar
              </p>
            </div>

            <div className="space-y-6 sm:space-y-8">
              {/* Compra Mínima */}
              <section className="border-l-4 border-orange-500 pl-3 sm:pl-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Shield className="text-orange-500" size={24} />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    1. Compra Mínima
                  </h2>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Cada participante debe comprar un{" "}
                  <strong>mínimo de 1 boleto</strong> por sorteo. No se
                  permiten compras de boletos individuales. Esta política
                  garantiza la equidad y viabilidad de todos nuestros sorteos.
                </p>
              </section>

              {/* Métodos de Pago */}
              <section className="border-l-4 border-blue-500 pl-3 sm:pl-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Gift className="text-blue-500" size={24} />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    2. Métodos de Pago Aceptados
                  </h2>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                  Únicamente aceptamos pagos a través de los siguientes métodos
                  oficiales:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1 sm:space-y-2 ml-2 sm:ml-4">
                  <li>
                    <strong>Mercado Pago:</strong> Transferencias y pagos
                    digitales
                  </li>
                  {/* <li>
                    <strong>Brubank:</strong> Transferencias bancarias
                  </li>
                  <li>
                    <strong>Binance:</strong> Pagos con criptomonedas
                  </li> */}
                </ul>
                <p className="text-gray-700 mt-4">
                  <strong>Importante:</strong> No aceptamos efectivo, otros
                  métodos de pago digitales o transferencias a cuentas no
                  oficiales.
                </p>
              </section>

              {/* Comprobante de Pago */}
              <section className="border-l-4 border-green-500 pl-3 sm:pl-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <AlertCircle className="text-green-500" size={24} />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    3. Comprobante de Pago
                  </h2>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Todos los usuarios{" "}
                  <strong>deben subir un comprobante de pago válido</strong> en
                  formato JPG o PNG. El comprobante debe ser legible y mostrar
                  claramente:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm sm:text-base space-y-1 sm:space-y-2 ml-2 sm:ml-4 mt-3">
                  <li>Número de transacción completo</li>
                  <li>Monto transferido (debe coincidir con la compra)</li>
                  <li>Fecha y hora de la transacción</li>
                  <li>Método de pago utilizado</li>
                </ul>
              </section>

              {/* Política de Reembolsos */}
              <section className="border-l-4 border-red-500 pl-3 sm:pl-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Clock className="text-red-500" size={24} />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    4. Política de Reembolsos
                  </h2>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  <strong>Los boletos son NO REEMBOLSABLES</strong> una vez
                  confirmado el pago. Esta política se aplica independientemente
                  de las circunstancias personales del participante.
                  Recomendamos verificar toda la información antes de realizar
                  la compra.
                </p>
              </section>

              {/* Fechas de Sorteo */}
              <section className="border-l-4 border-purple-500 pl-3 sm:pl-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Clock className="text-purple-500" size={24} />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    5. Fechas de Sorteo
                  </h2>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Cada sorteo se realizará en la{" "}
                  <strong>fecha específica indicada</strong> en la descripción
                  del mismo. Los sorteos se llevan a cabo mediante sistema
                  aleatorio transparente. En caso de retrasos por causas de
                  fuerza mayor, notificaremos a todos los participantes con
                  anticipación.
                </p>
              </section>

              {/* Selección de Ganadores */}
              <section className="border-l-4 border-yellow-500 pl-3 sm:pl-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Gift className="text-yellow-500" size={24} />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    6. Selección de Ganadores
                  </h2>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Los ganadores son{" "}
                  <strong>seleccionados aleatoriamente</strong> entre todos los
                  participantes con pagos confirmados. El proceso es
                  completamente transparente y utiliza algoritmos de selección
                  aleatoria verificables. Solo participan en el sorteo los
                  boletos de compras confirmadas por nuestro equipo.
                </p>
              </section>

              {/* Confirmación de Participación */}
              <section className="border-l-4 border-indigo-500 pl-3 sm:pl-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Shield className="text-indigo-500" size={24} />
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    7. Confirmación de Participación
                  </h2>
                </div>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  La participación en cualquier sorteo queda{" "}
                  <strong>confirmada únicamente</strong>
                  después de que nuestro equipo verifique y apruebe el
                  comprobante de pago. Los usuarios recibirán confirmación vía
                  WhatsApp una vez que su pago sea procesado. Hasta no recibir
                  esta confirmación, la participación no está garantizada.
                </p>
              </section>

              {/* Contacto y Soporte */}
              <section className="bg-gray-50 p-4 sm:p-6 rounded-xl">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 sm:mb-4">
                  Contacto y Soporte
                </h2>
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  Para cualquier consulta, duda o problema relacionado con los
                  sorteos, puedes contactarnos directamente a través de nuestro
                  WhatsApp oficial. Nuestro equipo de soporte está disponible
                  para ayudarte durante todo el proceso.
                </p>
              </section>

              {/* Aceptación */}
              <section className="bg-orange-50 p-4 sm:p-6 rounded-xl border border-orange-200">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-orange-800 mb-2 sm:mb-4">
                  Aceptación de Términos
                </h2>
                <p className="text-orange-700 leading-relaxed">
                  <strong>
                    Al participar en cualquier sorteo de La Guaira ,
                    automáticamente aceptas todos estos términos y condiciones.
                  </strong>{" "}
                  Es tu responsabilidad leer y comprender completamente estas
                  condiciones antes de realizar cualquier compra.
                </p>
              </section>
            </div>

            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-gray-500 text-sm mb-6">
                Última actualización: 17 de diciembre de 2024
              </p>
              <Link
                to="/"
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                Volver a Sorteos
              </Link>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default Terms;
