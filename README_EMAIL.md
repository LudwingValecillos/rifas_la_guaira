# 📧 Sistema de Email - Sorteazo de la Suerte

## 🚀 Configuración para Producción

### Variables de Entorno Requeridas

```bash
# .env (desarrollo local)
VITE_BREVO_API_KEY=tu_api_key_aqui

# Vercel/Netlify (producción)
BREVO_API_KEY=tu_api_key_aqui  # Para función serverless
VITE_BREVO_API_KEY=tu_api_key_aqui  # Para frontend
```

### 🔧 Configuración de Proxy (Desarrollo)

El archivo `vite.config.ts` ya incluye la configuración de proxy:

```typescript
proxy: {
  '/api/brevo': {
    target: 'https://api.brevo.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/brevo/, ''),
  }
}
```

### 📦 Funciones Optimizadas

#### 1. **Reintentos Inteligentes**

- ✅ 3 reintentos automáticos con backoff exponencial
- ✅ Manejo específico de errores 403, 401, 429
- ✅ Timeout de 15 segundos por request

#### 2. **Validaciones Robustas**

- ✅ Validación de formato de email
- ✅ Verificación de datos requeridos
- ✅ Manejo de errores de red

#### 3. **Template Responsive**

- ✅ Email optimizado para móviles
- ✅ Diseño profesional con gradientes
- ✅ Información clara y organizada

### 🛠️ Comandos de Desarrollo

```bash
# Desarrollo con proxy
npm run dev

# Build para producción
npm run build

# Deploy a Vercel
vercel --prod
```

### 🔍 Testing

#### Desarrollo Local

```javascript
// El sistema detecta automáticamente localhost
// Usa proxy: /api/brevo/v3/smtp/email
```

#### Producción

```javascript
// Usa API directa: https://api.brevo.com/v3/smtp/email
// O función serverless si está configurada
```

### 🚨 Manejo de Errores

| Error              | Código | Acción                                   |
| ------------------ | ------ | ---------------------------------------- |
| Cuenta no activada | 403    | No reintenta, muestra mensaje específico |
| API Key inválida   | 401    | No reintenta, verifica configuración     |
| Rate limited       | 429    | Reintenta con delay mayor                |
| Network error      | -      | Reintenta hasta 3 veces                  |
| Timeout            | -      | Reintenta con backoff exponencial        |

### 📊 Configuración de Brevo

1. **Activar cuenta SMTP**

   - Ir a dashboard de Brevo
   - Sección "SMTP & API"
   - Contactar support si no está activada

2. **Obtener API Key**
   - Panel de Brevo → API Keys
   - Crear nueva key con permisos SMTP
   - Copiar al archivo `.env`

### 🔄 Estados de la Función

```typescript
interface EmailResponse {
  success: boolean;
  error?: string;
}

// Uso
const result = await sendTicketConfirmationEmail(data);
if (result.success) {
  // ✅ Email enviado
} else {
  // ❌ Error: result.error
}
```

### 📱 Estructura del Email

- **Header**: Gradient naranja/rojo con confirmación
- **Contenido**: Datos de compra organizados
- **Tickets**: Números destacados con estilo
- **Footer**: Información de contacto
- **Responsive**: Optimizado para todos los dispositivos

### 🌐 URLs de API

| Entorno    | URL                                   |
| ---------- | ------------------------------------- |
| Desarrollo | `/api/brevo/v3/smtp/email` (proxy)    |
| Producción | `https://api.brevo.com/v3/smtp/email` |

### ⚡ Performance

- **Timeout**: 15 segundos máximo por request
- **Reintentos**: Máximo 3 con backoff exponencial
- **Validación**: Inmediata antes del envío
- **Memoria**: Hooks optimizados con `useCallback`

### 🔒 Seguridad

- ✅ API Keys en variables de entorno
- ✅ Validación de datos de entrada
- ✅ Sanitización de contenido HTML
- ✅ No logs de información sensible

### 📝 Ejemplo de Uso

```typescript
import { useBrevoEmail } from "./hooks/useBrevoEmail";

const { sendTicketConfirmationEmail, isLoading, error } = useBrevoEmail();

const result = await sendTicketConfirmationEmail({
  userName: "Juan Pérez",
  userEmail: "juan@email.com",
  raffleName: "Sorteo de iPhone",
  ticketNumbers: [15, 23, 42],
  totalAmount: "$50",
  paymentMethod: "Mercado Pago",
  transactionId: "MP123456",
  raffleDate: "25 de Diciembre, 2024",
});

if (result.success) {
  toast.success("Email enviado correctamente!");
} else {
  toast.error(`Error: ${result.error}`);
}
```

### 🐛 Troubleshooting

| Problema         | Solución                                             |
| ---------------- | ---------------------------------------------------- |
| CORS Error       | Verificar configuración de proxy en `vite.config.ts` |
| 403 Forbidden    | Activar cuenta SMTP en Brevo                         |
| 401 Unauthorized | Verificar API Key en variables de entorno            |
| Timeout          | Verificar conexión a internet                        |
| Network Error    | Revisar firewall/antivirus                           |

### 📞 Soporte

- **Brevo**: contact@brevo.com
- **Documentación**: https://developers.brevo.com/
- **Dashboard**: https://app.brevo.com/
