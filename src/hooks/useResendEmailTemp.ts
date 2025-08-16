import { useState, useCallback } from "react";
import { EMAIL_CONFIG } from "../config/email";

interface EmailData {
  to: string;
  subject: string;
  htmlContent: string;
}

interface TicketPurchaseData {
  userName: string;
  userEmail: string;
  raffleName: string;
  ticketNumbers: number[];
  totalAmount: string;
  paymentMethod: string;
  transactionId: string;
  raffleDate: string;
}

interface EmailResponse {
  success: boolean;
  error?: string;
  id?: string;
}

export const useResendEmailTemp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para validar email
  const isValidEmail = (email: string): boolean => {
    return EMAIL_CONFIG.EMAIL_REGEX.test(email);
  };

  // Función temporal que simula el envío de email (solo para testing)
  const sendEmail = useCallback(
    async (emailData: EmailData): Promise<EmailResponse> => {
      // Validaciones iniciales
      if (!emailData.to || !emailData.subject || !emailData.htmlContent) {
        const errorMsg =
          EMAIL_CONFIG.ERROR_MESSAGES.MISSING_DATA +
          ": destinatario, asunto o contenido";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (!isValidEmail(emailData.to)) {
        const errorMsg = EMAIL_CONFIG.ERROR_MESSAGES.INVALID_EMAIL;
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      setIsLoading(true);
      setError(null);

      try {
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simular envío exitoso y mostrar datos en consola
        console.log("🚀 EMAIL ENVIADO (MODO TESTING):");
        console.log("📧 Destinatario:", emailData.to);
        console.log("📝 Asunto:", emailData.subject);
        console.log(
          "📄 Contenido HTML:",
          emailData.htmlContent.substring(0, 200) + "..."
        );

        // Crear ventana emergente con el contenido del email para previsualización
        const newWindow = window.open(
          "",
          "_blank",
          "width=600,height=800,scrollbars=yes"
        );
        if (newWindow) {
          newWindow.document.write(`
          <html>
            <head>
              <title>Preview del Email - ${emailData.subject}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .preview-header { background: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
                .preview-content { border: 1px solid #ddd; padding: 10px; }
              </style>
            </head>
            <body>
              <div class="preview-header">
                <h2>📧 Preview del Email</h2>
                <p><strong>Para:</strong> ${emailData.to}</p>
                <p><strong>Asunto:</strong> ${emailData.subject}</p>
                <p><strong>Estado:</strong> ✅ Enviado correctamente (MODO TESTING)</p>
              </div>
              <div class="preview-content">
                ${emailData.htmlContent}
              </div>
            </body>
          </html>
        `);
          newWindow.document.close();
        }

        setIsLoading(false);
        return {
          success: true,
          id: "test_" + Date.now(),
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error inesperado";
        setError(errorMessage);
        setIsLoading(false);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // Función para emails de confirmación de tickets
  const sendTicketConfirmationEmail = useCallback(
    async (purchaseData: TicketPurchaseData): Promise<EmailResponse> => {
      // Validaciones de datos de compra
      if (
        !purchaseData.userEmail ||
        !purchaseData.userName ||
        !purchaseData.raffleName
      ) {
        const errorMsg =
          EMAIL_CONFIG.ERROR_MESSAGES.MISSING_DATA + " de la compra";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      if (
        !purchaseData.ticketNumbers ||
        purchaseData.ticketNumbers.length === 0
      ) {
        const errorMsg = "No se especificaron números de boletos";
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }

      // Template de email optimizado
      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Compra - JRaffle Company</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f8f9fa; }
    .email-wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #f97316 0%, #ef4444 100%); color: white; padding: 50px 30px; text-align: center; }
    .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 10px; }
    .header p { opacity: 0.95; font-size: 18px; }
    .content { padding: 50px 40px; }
    .greeting { font-size: 20px; margin-bottom: 25px; color: #1f2937; }
    .success-message { background: linear-gradient(135deg, #dcfce7, #bbf7d0); border: 2px solid #22c55e; color: #15803d; padding: 20px; border-radius: 12px; margin-bottom: 30px; text-align: center; font-weight: 600; font-size: 16px; }
    .ticket-box { background: linear-gradient(135deg, #fef3c7, #fed7aa); padding: 35px; border-radius: 16px; margin: 35px 0; text-align: center; border: 3px solid #f59e0b; }
    .ticket-box h3 { color: #92400e; font-size: 26px; margin: 15px 0 25px 0; font-weight: 700; }
    .ticket-numbers { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin: 25px 0; }
    .ticket { background: linear-gradient(135deg, #f97316, #ef4444); color: white; padding: 15px 20px; border-radius: 30px; font-weight: 700; font-size: 18px; box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3); }
    .ticket-save-note { background: #fff3cd; border: 2px solid #ffeaa7; color: #856404; padding: 16px; border-radius: 10px; margin-top: 20px; font-size: 15px; font-weight: 500; }
    .details-section { margin: 40px 0; }
    .details-title { font-size: 22px; color: #1f2937; margin-bottom: 20px; font-weight: 600; }
    .details-table { width: 100%; border-collapse: collapse; margin: 25px 0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .details-table th, .details-table td { padding: 18px; text-align: left; border-bottom: 1px solid #e5e7eb; }
    .details-table th { background: linear-gradient(135deg, #f8f9fa, #e9ecef); font-weight: 600; color: #374151; font-size: 14px; }
    .details-table td { color: #6b7280; font-size: 16px; }
    .details-table .amount { color: #059669; font-weight: 700; font-size: 18px; }
    .important { background: linear-gradient(135deg, #fef3c7, #fed7aa); border-left: 6px solid #f59e0b; padding: 30px; margin: 40px 0; border-radius: 0 12px 12px 0; }
    .important h4 { color: #92400e; margin-bottom: 20px; font-size: 20px; font-weight: 600; }
    .luck-message { text-align: center; font-size: 24px; margin: 50px 0 40px 0; padding: 25px; background: linear-gradient(135deg, #dcfce7, #bbf7d0); border-radius: 16px; color: #15803d; font-weight: 700; }
    .footer { background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 40px; text-align: center; color: #6b7280; }
    .footer .company-name { font-weight: 700; color: #374151; font-size: 18px; margin-bottom: 15px; }
    .testing-banner { background: #ff6b6b; color: white; padding: 15px; text-align: center; font-weight: bold; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="testing-banner">
      🧪 MODO TESTING - Este email no se envió realmente
    </div>
    <div class="container">
      <div class="header">
        <h1>¡Compra Confirmada!</h1>
                        <p>Gracias por participar en JRaffle Company</p>
      </div>
      
      <div class="content">
        <h2 class="greeting">¡Hola ${purchaseData.userName}!</h2>
        
        <div class="success-message">
          ✅ Tu compra ha sido procesada exitosamente. ¡Ya estás participando en el sorteo!
        </div>
        
        <div class="ticket-box">
          <h3>🎫 Tus Números de la Suerte</h3>
          <div class="ticket-numbers">
            ${purchaseData.ticketNumbers.map((num) => `<span class="ticket">${num}</span>`).join("")}
          </div>
          <div class="ticket-save-note">
            <strong>¡IMPORTANTE!</strong> Guarda estos números. Son tu comprobante oficial de participación.
          </div>
        </div>

        <div class="details-section">
          <h3 class="details-title">📋 Detalles de tu Compra</h3>
          <table class="details-table">
            <tr><th>🎯 Sorteo</th><td><strong>${purchaseData.raffleName}</strong></td></tr>
            <tr><th>🎫 Cantidad de Boletos</th><td>${purchaseData.ticketNumbers.length} boleto${purchaseData.ticketNumbers.length > 1 ? "s" : ""}</td></tr>
            <tr><th>💰 Total Pagado</th><td class="amount">${purchaseData.totalAmount}</td></tr>
            <tr><th>💳 Método de Pago</th><td>${purchaseData.paymentMethod}</td></tr>
            <tr><th>🆔 ID de Transacción</th><td><code>${purchaseData.transactionId}</code></td></tr>
            <tr><th>📅 Fecha del Sorteo</th><td><strong>${purchaseData.raffleDate}</strong></td></tr>
          </table>
        </div>

        <div class="important">
          <h4>📱 ¿Qué sigue ahora?</h4>
          <ul>
            <li><strong>Sorteo en vivo:</strong> El sorteo se realizará en la fecha indicada</li>
            <li><strong>Notificación:</strong> Te contactaremos por WhatsApp si resultas ganador</li>
            <li><strong>Comprobante:</strong> Mantén este correo como prueba de participación</li>
          </ul>
        </div>

        <div class="luck-message">
          🍀 ¡Mucha suerte en el sorteo! 🍀
        </div>
      </div>

      <div class="footer">
                        <p class="company-name">© 2024 JRaffle Company</p>
        <p>Todos los derechos reservados</p>
      </div>
    </div>
  </div>
</body>
</html>`;

      return await sendEmail({
        to: purchaseData.userEmail,
        subject: `🎉 ¡Compra Confirmada! Boletos: ${purchaseData.ticketNumbers.join(", ")} - ${purchaseData.raffleName}`,
        htmlContent,
      });
    },
    [sendEmail]
  );

  return {
    sendEmail,
    sendTicketConfirmationEmail,
    isLoading,
    error,
  };
};
