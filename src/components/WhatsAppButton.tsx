import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = "+5491122522982";
    const message = "Hola, tengo una consulta sobre JRaffle Company";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 bg-green-500 hover:bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center gap-2 group hover:scale-110 animate-bounce hover:animate-none"
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default WhatsAppButton;
