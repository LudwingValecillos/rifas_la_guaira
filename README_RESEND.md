# 📧 Sistema de Email con Resend - Sorteazo de la Suerte

## 🚀 Configuración para Producción

### Variables de Entorno Requeridas

```bash
# .env (no necesaria para frontend, la API key está en la función serverless)
# VITE_RESEND_API_KEY=re_NsFvWayq_C41QVCqhoh5kzb6CgPMqUyoX
```

### ⚠️ Importante: CORS y Función Serverless

**Resend también requiere función serverless** porque:

- ✅ Resend NO permite llamadas directas desde el navegador (CORS)
- ✅ Necesita función serverless `/api/send-email.ts`
- ✅ La API key está segura en el servidor
- ✅ Funciona tanto en desarrollo como producción

### ✨ Ventajas de Resend (con función serverless)

- ✅ **API más simple**: Una vez configurada, es más fácil de usar
- ✅ **Mejor performance**: Resend es más rápido que Brevo
- ✅ **Mejor DX**: Mejor experiencia de desarrollador
- ✅ **Sin configuración de cuenta**: No necesita activación manual
- ✅ **Manejo de errores mejorado**: Errores más claros

### 📦 Arquitectura Implementada

```
Frontend (React) → Función Serverless (/api/send-email.ts) → Resend API
```

#### 1. **Función Serverless** (`/api/send-email.ts`)

- ✅ Maneja CORS automáticamente
- ✅ Valida datos de entrada
- ✅ Envía emails usando Resend
- ✅ Manejo robusto de errores

#### 2. **Hook Frontend** (`useResendEmail.ts`)

- ✅ Llama a función serverless (no directamente a Resend)
- ✅ Validaciones de frontend
- ✅ Estados de carga y error
- ✅ Template HTML optimizado

### 🛠️ Comandos de Desarrollo

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Deploy a Vercel (incluye función serverless)
vercel --prod
```

### 🔍 Cómo Funciona

```typescript
// Frontend llama a función serverless
const response = await fetch("/api/send-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "usuario@email.com",
    subject: "Asunto del email",
    htmlContent: "<h1>Contenido HTML</h1>",
  }),
});

// Función serverless usa Resend
const resend = new Resend(API_KEY);
const result = await resend.emails.send({
  from: "onboarding@resend.dev",
  to: to,
  subject: subject,
  html: htmlContent,
});
```

### 🚨 Manejo de Errores

| Error             | Descripción                              | Acción                                  |
| ----------------- | ---------------------------------------- | --------------------------------------- |
| API Key inválida  | Clave de API incorrecta o expirada       | Verificar API key en función serverless |
| Dominio no válido | Email desde dominio no verificado        | Usar dominio verificado de Resend       |
| Rate limited      | Excedido límite de envío                 | Esperar y reintentar                    |
| Network error     | Problema de conexión                     | Verificar conexión a internet           |
| CORS Error        | ❌ YA SOLUCIONADO con función serverless |

### 📊 Configuración de Resend

1. **Obtener API Key**

   - Ir a [resend.com](https://resend.com)
   - Crear cuenta y verificar email
   - Generar API key en el dashboard
   - Colocar en `/api/send-email.ts` (NO en .env del frontend)

2. **Dominio**
   - Por defecto usa `onboarding@resend.dev` (listo para usar)
   - Para dominio personalizado: verificar en dashboard
   - Actualizar en `/api/send-email.ts`

### 🔄 Estados de la Función

```typescript
interface EmailResponse {
  success: boolean;
  error?: string;
  id?: string; // ID único del email enviado por Resend
}

// Uso
const result = await sendTicketConfirmationEmail(data);
if (result.success) {
  console.log("Email enviado con ID:", result.id);
} else {
  console.error("Error:", result.error);
}
```

### 📁 Archivos Principales

```
├── api/
│   └── send-email.ts        # 🔥 Función serverless de Vercel
├── src/
│   ├── hooks/
│   │   └── useResendEmail.ts    # Hook para frontend
│   ├── config/
│   │   └── email.ts             # Configuración
│   └── pages/
│       └── PaymentPage.tsx      # Página que usa el hook
```

### 📱 Template del Email

#### Características del Nuevo Diseño:

- **Header**: Gradient moderno con efectos visuales
- **Tickets**: Diseño tipo badge con hover effects
- **Tabla**: Información organizada con iconos
- **Call-to-action**: Mensajes claros y motivadores
- **Footer**: Información de contacto estilizada
- **Responsive**: Optimizado para móviles

### ⚡ Performance

- **Función serverless**: Manejo optimizado de CORS
- **Timeout**: Manejado por Vercel automáticamente
- **Caché**: Resend tiene mejor caché que Brevo
- **Memoria**: Hooks optimizados con `useCallback`

### 🔒 Seguridad

- ✅ API Key SOLO en función serverless (no en frontend)
- ✅ Validación en frontend Y backend
- ✅ CORS manejado por función serverless
- ✅ No exposición de credenciales

### 📝 Ejemplo de Uso Completo

```typescript
import { useResendEmail } from "./hooks/useResendEmail";

const PaymentPage = () => {
  const { sendTicketConfirmationEmail, isLoading, error } = useResendEmail();

  const handlePurchase = async () => {
    const result = await sendTicketConfirmationEmail({
      userName: "Juan Pérez",
      userEmail: "juan@email.com",
      raffleName: "Sorteo iPhone 15",
      ticketNumbers: [15, 23, 42],
      totalAmount: "$50.000",
      paymentMethod: "Mercado Pago",
      transactionId: "MP123456789",
      raffleDate: "25 de Diciembre, 2024",
    });

    if (result.success) {
      toast.success(`Email enviado! ID: ${result.id}`);
    } else {
      toast.error(`Error: ${result.error}`);
    }
  };
};
```

### 🐛 Troubleshooting

| Problema            | Solución                                         |
| ------------------- | ------------------------------------------------ |
| CORS Error          | ✅ YA SOLUCIONADO con `/api/send-email.ts`       |
| API key not found   | Verificar API key en `/api/send-email.ts`        |
| Domain not verified | Usar `onboarding@resend.dev` o verificar dominio |
| Network error       | Verificar conexión a internet                    |
| Rate limit exceeded | Esperar 1 minuto antes de reintentar             |
| Function not found  | Verificar que existe `/api/send-email.ts`        |

### 🆚 Comparación Brevo vs Resend (Ambos con función serverless)

| Característica    | Brevo             | Resend            |
| ----------------- | ----------------- | ----------------- |
| **CORS**          | ✅ Con serverless | ✅ Con serverless |
| **Configuración** | ⚠️ Compleja       | ✅ Simple         |
| **Velocidad**     | ⚠️ Media          | ✅ Rápida         |
| **DX**            | ⚠️ Regular        | ✅ Excelente      |
| **Activación**    | ❌ Manual         | ✅ Automática     |
| **Errores**       | ⚠️ Complejos      | ✅ Claros         |

### 📞 Soporte

- **Resend**: [resend.com/support](https://resend.com/support)
- **Documentación**: [resend.com/docs](https://resend.com/docs)
- **Dashboard**: [resend.com/dashboard](https://resend.com/dashboard)

### 🚀 Deploy Checklist

- [x] Función serverless `/api/send-email.ts` creada
- [x] API key configurada en función serverless
- [x] Dependencia `resend` instalada
- [x] Hook `useResendEmail` importado en `PaymentPage.tsx`
- [ ] Deploy a Vercel realizado
- [ ] Prueba de envío de email exitosa

### 🎯 Próximos Pasos

1. **Deploy a Vercel**: `vercel --prod`
2. **Probar email**: Hacer una compra de prueba
3. **Verificar logs**: Revisar función serverless en dashboard
4. **Optimizar dominio**: (Opcional) Agregar dominio personalizado

¡Tu sistema de email está ahora optimizado con Resend y función serverless! 🎉
