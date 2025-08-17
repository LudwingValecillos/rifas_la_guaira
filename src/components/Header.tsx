import { Link, useNavigate, useLocation } from "react-router-dom";
import { Trophy, Shield, Award, Menu, X, Settings } from "lucide-react";
import logo from "../../public/iamgenes/icono recordado.jpg";
import { useState, useEffect } from "react";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if user is admin
  const adminStatus = localStorage.getItem("La Guaira_admin");
  const isAdmin = adminStatus === "true";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleAdminClick = () => {
    navigate("/admin/dashboard");
    setMobileMenuOpen(false); // Cerrar menú móvil si está abierto
  };

  return (
    <header className="bg-jr-navy shadow-lg border-b-4 border-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logo}
              alt="La Guaira "
              className="h-16 w-auto "
            />
            {/*<h1 className="text-2xl font-bold bg-gradient-to-r from-jr-gold to-jr-light-gold bg-clip-text text-transparent">
              La Guaira 
            </h1>*/}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <Link
              to="/"
              className="relative text-jr-light-gold hover:text-white font-semibold transition-all duration-300 group"
            >
              <span className="relative z-10">Inicio</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-jr-gold to-jr-light-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>

            {/*<Link
                to="/como-funciona"
                className="relative text-slate-300 hover:text-white font-semibold transition-all duration-300 group"
              >
                <span className="relative z-10">¿Cómo Funciona?</span>
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-orange-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </Link>*/}

            <Link
              to="/terminos"
              className="relative text-jr-light-gold hover:text-white font-semibold transition-all duration-300 group flex items-center gap-2"
            >
              <Shield size={16} />
              <span className="relative z-10">Términos Legales</span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-jr-gold to-jr-light-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>

            {/* Super Admin Button - Desktop */}
            {isAdmin && (
              <button
                onClick={handleAdminClick}
                className="flex items-center gap-2 bg-black px-4 py-2 rounded-full border border-black transition-all duration-300 group hover:scale-105"
                title="Panel de Super Admin"
              >
                <Settings
                  size={16}
                  className="text-white group-hover:rotate-90 transition-transform duration-300"
                />
                <span className="text-white text-sm font-medium hidden lg:block">
                  Admin
                </span>
              </button>
            )}

            {/* Trust Badge */}
            <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-full border border-black">
              <Award className="text-white" size={16} />
              <span className="text-white text-sm font-medium">
                Verificado
              </span>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-jr-light-gold hover:text-white"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#eabb00] border-t border-jr-gold shadow-lg">
          <div className="container mx-auto px-4 py-3 space-y-4">
            <Link
              to="/"
              className="block text-jr-light-gold hover:text-white font-semibold py-2 px-3 hover:bg-jr-navy rounded-lg transition-colors duration-200"
              onClick={toggleMobileMenu}
            >
              Inicio
            </Link>
            {/* <Link
              to="/como-funciona"
              className="block text-slate-300 hover:text-white font-semibold py-2 px-3 hover:bg-slate-700 rounded-lg transition-colors duration-200"
              onClick={toggleMobileMenu}
            >
              ¿Cómo Funciona?
            </Link>*/}
            <Link
              to="/terminos"
              className="text-jr-light-gold hover:text-white font-semibold py-2 px-3 hover:bg-jr-navy rounded-lg flex items-center gap-2 transition-colors duration-200"
              onClick={toggleMobileMenu}
            >
              <Shield size={16} /> Términos Legales
            </Link>

            {/* Super Admin Button - Mobile */}
            {isAdmin && (
              <button
                onClick={handleAdminClick}
                className="w-full text-left bg-gradient-to-r from-jr-gold to-jr-light-gold hover:from-jr-light-gold hover:to-jr-gold text-jr-navy font-semibold py-2 px-3 rounded-lg flex items-center gap-2 transition-colors duration-200"
              >
                <Settings size={16} /> Panel de Admin
              </button>
            )}

            <div className="flex items-center gap-2 bg-jr-navy px-4 py-2 rounded-lg">
              <Award className="text-jr-light-gold" size={16} />
              <span className="text-jr-light-gold text-sm font-medium">
                Verificado
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-jr-gold/30 to-transparent"></div>
    </header>
  );
};

export default Header;
