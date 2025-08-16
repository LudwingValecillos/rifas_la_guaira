// Configuración de email para producción con Resend
export const EMAIL_CONFIG = {
  // Configuración de Resend
  RESEND_API_KEY: import.meta.env.VITE_RESEND_API_KEY,

  // Configuración del remitente (Resend requiere dominio verificado)
  SENDER: {
    name: "La Guaira ",
    email: "onboarding@resend.dev", // Dominio por defecto de Resend
  },

  // Configuración de validación
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Configuración de timeout
  TIMEOUT_MS: 10000, // 10 segundos (Resend es más rápido)

  // Mensajes de error
  ERROR_MESSAGES: {
    UNAUTHORIZED: "API Key de Resend inválida o expirada",
    RATE_LIMITED: "Límite de envío excedido. Intenta más tarde",
    TIMEOUT: "Timeout: La solicitud tomó demasiado tiempo",
    INVALID_EMAIL: "El email del destinatario no es válido",
    MISSING_DATA: "Faltan datos requeridos",
    NETWORK_ERROR: "Error de conexión. Verifica tu internet",
    INVALID_DOMAIN: "Dominio de email no verificado en Resend",
  },
} as const;

// Tipos para TypeScript
export type EmailConfig = typeof EMAIL_CONFIG;
