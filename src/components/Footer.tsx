import { Link } from "react-router-dom";
import {
  Ticket,
  Heart,
  Shield,
  Award,
  Facebook,
  Instagram,
} from "lucide-react";
import logo from "../../public/iamgenes/icono_recordado_2-removebg-preview.png";

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        {/* Mobile Layout - Compacto */}
        <div className="block sm:hidden">
          {/* Logo y descripción */}
          <div className="text-center mb-6">
            <img
              src={logo}
              alt="La Guaira "
              className="w-auto h-16 mx-auto mb-3"
            />
            <p className="text-gray-300 text-sm max-w-xs mx-auto mb-4">
              La Guaira Rifas es una plataforma verificada para rifas y sorteos online
            </p>
            
            {/* Trust Badges compactos */}
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-jr-light-gold">
                <Shield size={14} />
                <span className="text-xs font-medium">Plataforma Verificada</span>
              </div>
              <div className="flex items-center gap-2 text-[#FECB00]">
                <Award size={14} />
                <span className="text-xs font-medium">Sorteos Legales</span>
              </div>
            </div>
          </div>

          {/* Contenido en 2 columnas para móvil */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Enlaces + Información */}
            <div className="text-center">
              <h3 className="text-sm font-bold mb-3 text-jr-light-gold">
                Enlaces
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link
                    to="/terminos"
                    className="text-gray-300 hover:text-jr-gold transition-colors duration-200"
                  >
                    Términos
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-jr-gold transition-colors duration-200"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
              
              <div className="mt-4">
                <h4 className="text-sm font-bold mb-2 text-jr-light-gold">Info</h4>
                <div className="space-y-1 text-xs text-gray-300">
                  <p>Sorteos transparentes</p>
                  <p>Premios garantizados</p>
                  <p className="text-[#FECB00] font-medium">¡Juega responsablemente!</p>
                </div>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="text-center">
              <h3 className="text-sm font-bold mb-3 text-jr-light-gold">
                Síguenos
              </h3>
              <div className="space-y-3">
                <a
                  href="https://www.instagram.com/rifaslaguaira2025/"
                  className="flex flex-col items-center text-gray-300 hover:text-pink-400 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-1">
                    <Instagram size={16} className="text-white" />
                  </div>
                  <span className="text-xs">Instagram</span>
                </a>

                <a
                  href="https://wa.me/+5491141972327"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-gray-300 hover:text-green-400 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 mb-1">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.686z" />
                    </svg>
                  </div>
                  <span className="text-xs">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom compacto móvil */}
          <div className="border-t border-[#FECB00] pt-4 text-center">
            <p className="text-gray-400 text-xs mb-2">
              © 2025 La Guaira. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-xs mb-2">Plataforma segura y confiable</p>
            <a
              href="https://nextcode.com.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-gray-400 hover:text-jr-gold transition-colors duration-200 text-xs"
            >
              <span>Desarrollado</span>
              <span>
                por <span className="text-green-500">Next</span>
                <span className="text-white">Code</span>
              </span>
            </a>
          </div>
        </div>

        {/* Desktop Layout - Original */}
        <div className="hidden sm:block">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Logo y descripción - Spans 2 columns on larger screens */}
            <div className="sm:col-span-2 lg:col-span-1 text-center sm:text-left">
              <div className="flex flex-col items-center sm:items-start space-y-4">
                <img
                  src={logo}
                  alt="La Guaira "
                  className="w-auto h-20 "
                />
                <div>
                  <p className="text-gray-300 text-sm mb-4 max-w-xs">
                    La Guaira Rifas es una plataforma verificada para rifas y
                    sorteos online
                  </p>
                </div>

                {/* Trust Badges */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-jr-light-gold">
                    <Shield size={16} />
                    <span className="text-sm font-medium">
                      Plataforma Verificada
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#FECB00]">
                    <Award size={16} />
                    <span className="text-sm font-medium">Sorteos Legales</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enlaces importantes */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold mb-4 text-jr-light-gold">
                Enlaces Importantes
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/terminos"
                    className="text-gray-300 hover:text-jr-gold transition-colors duration-200 text-sm"
                  >
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-jr-gold transition-colors duration-200 text-sm"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>

            {/* Información de Contacto */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold mb-4 text-jr-light-gold">
                Información
              </h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Sorteos transparentes</p>
                <p>Premios garantizados</p>
                <p>Soporte 24/7</p>
                <p className="text-[#FECB00] font-medium">
                  ¡Juega responsablemente!
                </p>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold mb-4 text-jr-light-gold">
                Contactanos
              </h3>
              <div className="flex flex-col space-y-3">
                <a
                  href="https://www.instagram.com/rifaslaguaira2025/"
                  className="flex items-center justify-center sm:justify-start gap-3 text-gray-300 hover:text-pink-400 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Instagram size={16} className="text-white" />
                  </div>
                  <span className="text-sm">Instagram</span>
                </a>

                <a
                  href="https://wa.me/+5491141972327"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-3 text-gray-300 hover:text-green-400 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.686z" />
                    </svg>
                  </div>
                  <span className="text-sm">WhatsApp</span>
                </a>
                <a
                  href="mailto:Rifaslaguaira2025@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start gap-3 text-gray-300 hover:text-green-400 transition-colors duration-200 group"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64">
<ellipse cx="32" cy="61" opacity=".3" rx="23" ry="3"></ellipse><path fill="#98c900" d="M58,24l-12,8v17c0,1.105,0.895,2,2,2h4c3.314,0,6-2.686,6-6l0-20.999L58,24z"></path><path fill="#37d0ee" d="M7,24l12,8v17c0,1.105-0.895,2-2,2h-4c-3.314,0-6-2.686-6-6l0-20.999L7,24z"></path><path fill="#ffce29" d="M58,16.362c0-3.513-3.961-5.566-6.831-3.54L46,16.471V32l12-7.999L58,16.362z"></path><path fill="#cd2e42" d="M7,16.362c0-3.513,3.961-5.566,6.831-3.54L19,16.471V32L7,24.001L7,16.362z"></path><path fill="#fd3c4f" d="M32.5,26L19,16.47V32l10.763,7.175c1.658,1.105,3.818,1.105,5.476,0L46,32V16.471L32.5,26z"></path><path d="M58,26.001v-1.966c-2.343,1.492-5,2.718-5,7.808L53,45c0,2.017,1.201,3.745,2.921,4.535 C57.192,48.435,58,46.813,58,45L58,26.001z" opacity=".15"></path><path fill="#fff" d="M23.085,19.354L19,16.47v0l-5.169-3.649c-2.87-2.026-6.831,0.027-6.831,3.54l0,7.639 L7,35c0,0,0,0,0,0c2.762,0,5-2.239,5-5l0-10.42c0-0.811,0.914-1.285,1.577-0.817l2.541,1.793 C18.372,22.147,21.493,21.609,23.085,19.354z" opacity=".3"></path><line x1="10.5" x2="10.5" y1="19.5" y2="22.5" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="3"></line>
</svg>
                  </div>
                  <span className="text-sm">Correo</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-[#FECB00] mt-8 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
              <p className="text-gray-400 text-xs sm:text-sm">
                © 2025 La Guaira. Todos los derechos reservados.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <span className="text-gray-400">
                  Plataforma segura y confiable
                </span>
                <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                <a
                  href="https://nextcode.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-jr-gold transition-colors duration-200"
                >
                  
                  <span>
                   Desarrollado por <span className="text-green-500">Next</span>
                    <span className="text-white">Code</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;