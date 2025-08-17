import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSorteazo } from "../contexts/SorteazoContext";
import { useResendEmail } from "../hooks/useResendEmail";
import Header from "../components/Header";
import WhatsAppButton from "../components/WhatsAppButton";
import Footer from "../components/Footer";
import { ArrowLeft, Upload, Check, Shield, X, Ticket } from "lucide-react";
import { toast } from "sonner";
import {
  uploadImageToImageKit,
  getRifaById,
  addUserToRifa,
  updateRifa,
} from "../apis/rifa";
import logo from "../../public/logojr.jpg";

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { raffles, loadRaffles } = useSorteazo();
  const { sendTicketConfirmationEmail, isLoading: isEmailLoading } =
    useResendEmail();

  const ticketCount = parseInt(searchParams.get("tickets") || "2");
  const raffle = raffles.find((r) => r.id === id);

  // Helper para formatear número de ticket con ceros a la izquierda según totalTickets
  const formatTicketNumber = (ticket: number, totalTickets?: number) => {
    // Validar que sea un número válido y mayor que 0
    if (typeof ticket !== "number" || ticket < 1 || !Number.isInteger(ticket)) {
      return "ERROR";
    }

    // Usar totalTickets pasado como parámetro, o el del raffle, o un default
    const total = totalTickets || raffle?.totalTickets || 10000;
    const digits = total.toString().length;
    return ticket.toString().padStart(digits, "0");
  };

  // Scroll to top smoothly when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    paymentMethod: "",
  });

  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [assignedTickets, setAssignedTickets] = useState<number[]>([]);

  const paymentMethods = [
    {
      id: "mercadopago",
      name: "Mercado Pago",
      details:
        "Royner petit\nAlias: Rjpl.0306.",
    },
  ];

  if (!raffle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Sorteo no encontrado
          </h1>
        </div>
        <Footer />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentMethodChange = (methodId: string) => {
    setFormData({
      ...formData,
      paymentMethod: methodId,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setPaymentProof(file);
      } else {
        toast.error("Solo se permiten archivos JPG o PNG");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.paymentMethod ||
      !paymentProof
    ) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mostrar loading toast
      const loadingToast = toast.loading("Subiendo comprobante de pago...");

      // Subir comprobante de pago a ImageKit/ImgBB
      const paymentProofUrl = await uploadImageToImageKit(paymentProof);

      if (!paymentProofUrl) {
        toast.dismiss(loadingToast);
        toast.error(
          "Error al subir el comprobante de pago. Inténtalo de nuevo."
        );
        return;
      }

      toast.dismiss(loadingToast);
      const processingToast = toast.loading(
        "Procesando compra y asignando tickets..."
      );

      // Obtener datos actualizados de la rifa desde Firebase
      const rifaActualizada = await getRifaById(id!);

      if (!rifaActualizada) {
        toast.dismiss(processingToast);
        toast.error(
          "Error al obtener los datos de la rifa. Inténtalo de nuevo."
        );
        return;
      }

      // Obtener tickets ocupados de todos los usuarios
      const rifaData = rifaActualizada as unknown as {
        users?: { tickets?: number[] }[];
        totalTickets: number;
        title: string;
        drawDate: string;
        premiumNumbers?: { number: number; isBlocked: boolean }[];
      };
      const usuarios = rifaData.users || [];
      const ticketsOcupados = getOccupiedTickets(usuarios);

      // Obtener números premium bloqueados
      const numerosPremiumBloqueados = (rifaData.premiumNumbers || [])
        .filter((premium) => premium.isBlocked)
        .map((premium) => premium.number);

      // Calcular tickets disponibles (excluyendo números premium bloqueados)
      const ticketsDisponibles = getAvailableTickets(
        rifaData.totalTickets,
        ticketsOcupados,
        numerosPremiumBloqueados
      );

      // Verificar que hay suficientes tickets disponibles
      if (ticketsDisponibles.length < ticketCount) {
        toast.dismiss(processingToast);
        toast.error(
          `Solo quedan ${ticketsDisponibles.length} tickets disponibles. Solicitaste ${ticketCount}.`
        );
        return;
      }

      // Seleccionar tickets aleatoriamente
      const ticketsAsignados = selectRandomTickets(
        ticketsDisponibles,
        ticketCount
      );

      // VALIDACIÓN FINAL: Filtrar cualquier valor inválido antes de guardarlo
      const ticketsValidos = ticketsAsignados.filter(
        (ticket) =>
          typeof ticket === "number" && Number.isInteger(ticket) && ticket > 0
      );

      if (ticketsValidos.length !== ticketCount) {
        toast.dismiss(processingToast);
        toast.error(
          `Error en la selección de tickets. Esperados: ${ticketCount}, Válidos: ${ticketsValidos.length}`
        );
        return;
      }

      // Crear nuevo usuario con tickets validados
      const nuevoUsuario = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        payment: formData.paymentMethod,
        tickets: ticketsValidos,
        paymentProof: paymentProofUrl,
      };

      // Agregar usuario a la rifa en Firebase
      await addUserToRifa(id!, nuevoUsuario);

      // Actualizar el contexto local (ya no necesitamos actualizar soldTickets manualmente)
      await loadRaffles();

      // Guardar tickets validados para mostrar en el modal
      setAssignedTickets(ticketsValidos);

      // Verificar si hay números premium asignados
      const numerosPremiumAsignados = ticketsValidos.filter((ticket) =>
        (rifaData.premiumNumbers || []).some(
          (premium) => premium.number === ticket && !premium.isBlocked
        )
      );

      toast.dismiss(processingToast);

      // Mostrar notificación especial si se asignaron números premium
      if (numerosPremiumAsignados.length > 0) {
        toast.success(
          `¡Felicidades! Te han tocado ${numerosPremiumAsignados.length} números premium: ${numerosPremiumAsignados
            .map((t) => formatTicketNumber(t, rifaData.totalTickets))
            .join(", ")}`,
          { duration: 5000 }
        );
      }

      // Enviar correo de confirmación
      try {
        const emailToast = toast.loading("Enviando comprobante por correo...");

        const emailResult = await sendTicketConfirmationEmail({
          userName: `${formData.firstName} ${formData.lastName}`,
          userEmail: formData.email,
          raffleName: rifaData.title,
          ticketNumbers: [
            formatTicketNumbersForEmail(ticketsValidos, rifaData.totalTickets),
          ],
          totalAmount: formatPrice(totalAmount),
          paymentMethod: formData.paymentMethod,
          transactionId: "N/A",
          raffleDate: new Date(rifaData.drawDate).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });

        toast.dismiss(emailToast);

        if (emailResult.success) {
          toast.success("¡Comprobante enviado a tu correo electrónico!");
        } else {
          console.error("Error al enviar correo:", emailResult.error);
          toast.warning(
            `Compra exitosa, pero no se pudo enviar el correo: ${
              emailResult.error || "Error desconocido"
            }`
          );
        }
      } catch (emailError) {
        console.error("Error inesperado al enviar correo:", emailError);
        toast.warning(
          "Compra exitosa, pero no se pudo enviar el correo. Verifica tus tickets en el modal."
        );
      }

      // Mostrar modal de confirmación con los tickets asignados
      setShowConfirmationModal(true);
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      toast.error("Error al procesar la compra. Inténtalo nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString()}`;
  };

  // Función para formatear números como texto limpio para el correo
  const formatTicketNumbersForEmail = (
    tickets: number[],
    totalTickets: number
  ): string => {
    const formattedTickets = tickets.map((ticket) =>
      formatTicketNumber(ticket, totalTickets)
    );

    // Crear filas de 4 números máximo con formato limpio
    const rows: string[] = [];
    for (let i = 0; i < formattedTickets.length; i += 4) {
      const rowNumbers = formattedTickets.slice(i, i + 4);
      rows.push(rowNumbers.join(" • "));
    }

    // Unir las filas con saltos de línea
    return rows.join("\n");
  };

  const totalAmount = raffle.pricePerTicket * ticketCount;
  const selectedMethod = paymentMethods.find(
    (m) => m.id === formData.paymentMethod
  );

  // Función para obtener tickets ocupados de todos los usuarios
  const getOccupiedTickets = (users: { tickets?: number[] }[]): number[] => {
    const occupiedTickets: number[] = [];

    users.forEach((user) => {
      if (user.tickets && Array.isArray(user.tickets)) {
        // Filtrar solo números válidos (enteros positivos)
        const validTickets = user.tickets.filter(
          (ticket) =>
            typeof ticket === "number" && Number.isInteger(ticket) && ticket > 0
        );

        occupiedTickets.push(...validTickets);
      }
    });

    // Eliminar duplicados y ordenar
    const uniqueOccupied = [...new Set(occupiedTickets)].sort((a, b) => a - b);

    return uniqueOccupied;
  };

  // Función para generar tickets disponibles (excluyendo números premium bloqueados)
  const getAvailableTickets = (
    totalTickets: number,
    occupiedTickets: number[],
    blockedPremiumNumbers: number[] = []
  ): number[] => {
    const available: number[] = [];
    const allBlocked = [...occupiedTickets, ...blockedPremiumNumbers];

    for (let i = 1; i <= totalTickets; i++) {
      if (!allBlocked.includes(i)) {
        available.push(i);
      }
    }

    return available;
  };

  // Función SÚPER ULTRA MEGA ALEATORIA para seleccionar tickets - VERSIÓN MÁXIMA
  const selectRandomTickets = (
    availableTickets: number[],
    count: number
  ): number[] => {
    if (availableTickets.length < count) {
      throw new Error(
        `No hay suficientes tickets disponibles. Disponibles: ${availableTickets.length}, Solicitados: ${count}`
      );
    }

    // CAPA 1: Función de aleatorización con múltiples fuentes de entropía
    const getUltraRandomIndex = (max: number) => {
      // Fuente 1: Math.random() básico
      const base1 = Math.random();
      const base2 = Math.random();
      const base3 = Math.random();

      // Fuente 2: Tiempo en múltiples escalas
      const now = Date.now();
      const microTime = (now % 10000) / 10000;
      const nanoTime = (now % 1000) / 1000;
      const milliTime = (now % 100) / 100;

      // Fuente 3: Performance timing
      const performance =
        typeof window !== "undefined" ? window.performance?.now() || 0 : 0;
      const perfMicro = (performance % 10000) / 10000;
      const perfNano = (performance % 1000) / 1000;

      // Fuente 4: User Agent hash simple
      const userAgent =
        typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
      const uaHash = userAgent
        .split("")
        .reduce((hash, char) => (hash << 5) - hash + char.charCodeAt(0), 0);
      const uaRandom = Math.abs(uaHash % 10000) / 10000;

      // Fuente 5: Crypto Random (si está disponible)
      let cryptoRandom = Math.random();
      if (
        typeof window !== "undefined" &&
        window.crypto &&
        window.crypto.getRandomValues
      ) {
        try {
          const array = new Uint32Array(1);
          window.crypto.getRandomValues(array);
          cryptoRandom = array[0] / 4294967295; // Convertir a 0-1
        } catch (e) {
          cryptoRandom = Math.random();
        }
      }

      // Combinar todas las fuentes con pesos diferentes
      const combined =
        base1 * 0.2 +
        base2 * 0.15 +
        base3 * 0.1 +
        microTime * 0.15 +
        nanoTime * 0.1 +
        milliTime * 0.05 +
        perfMicro * 0.1 +
        perfNano * 0.05 +
        uaRandom * 0.05 +
        cryptoRandom * 0.05;

      // Aplicar función de distribución no lineal para mejor dispersión
      const nonLinear = Math.sin(combined * Math.PI * 2) * 0.5 + 0.5;

      return Math.floor(nonLinear * max);
    };

    // CAPA 2: Crear múltiples copias mezcladas del array
    const tickets = [...availableTickets];

    // Pre-mezcla intensiva con múltiples algoritmos
    for (let superRound = 0; superRound < 10; superRound++) {
      // Algoritmo 1: Fisher-Yates ultra mejorado
      for (let round = 0; round < 3; round++) {
        for (let i = tickets.length - 1; i > 0; i--) {
          const j = getUltraRandomIndex(i + 1);
          [tickets[i], tickets[j]] = [tickets[j], tickets[i]];
        }
      }

      // Algoritmo 2: Mezcla por bloques aleatorios
      const blockSize = Math.max(
        5,
        Math.floor(tickets.length / getUltraRandomIndex(20) + 5)
      );
      for (let start = 0; start < tickets.length; start += blockSize) {
        const end = Math.min(start + blockSize, tickets.length);
        const block = tickets.slice(start, end);

        // Mezcla interna del bloque
        for (let i = block.length - 1; i > 0; i--) {
          const j = getUltraRandomIndex(i + 1);
          [block[i], block[j]] = [block[j], block[i]];
        }

        // Reemplazar bloque con versión mezclada
        tickets.splice(start, end - start, ...block);
      }

      // Algoritmo 3: Intercambios aleatorios masivos
      const numSwaps = Math.floor(tickets.length * (0.5 + Math.random() * 0.5));
      for (let swap = 0; swap < numSwaps; swap++) {
        const i = getUltraRandomIndex(tickets.length);
        const j = getUltraRandomIndex(tickets.length);
        if (i !== j) {
          [tickets[i], tickets[j]] = [tickets[j], tickets[i]];
        }
      }

      // Algoritmo 4: Rotación aleatoria de segmentos
      const segmentStart = getUltraRandomIndex(tickets.length);
      const segmentSize =
        getUltraRandomIndex(Math.floor(tickets.length / 3)) + 1;
      const segmentEnd = Math.min(segmentStart + segmentSize, tickets.length);

      if (segmentEnd > segmentStart) {
        const segment = tickets.splice(segmentStart, segmentEnd - segmentStart);
        const insertPos = getUltraRandomIndex(tickets.length + 1);
        tickets.splice(insertPos, 0, ...segment);
      }
    }

    // CAPA 3: Selección distribuida con máxima dispersión
    const selected: number[] = [];
    const totalRange =
      Math.max(...availableTickets) - Math.min(...availableTickets);

    // Crear mapa de distancias para evitar agrupaciones
    const getMinDistanceToSelected = (num: number) => {
      if (selected.length === 0) return Infinity;
      return Math.min(...selected.map((sel) => Math.abs(sel - num)));
    };

    // Selección con preferencia por dispersión
    let attempts = 0;
    const maxAttempts = tickets.length * 3;

    while (
      selected.length < count &&
      attempts < maxAttempts &&
      tickets.length > 0
    ) {
      // Generar múltiples candidatos y elegir el mejor distribuido
      const candidates: number[] = [];
      const numCandidates = Math.min(10, tickets.length);

      for (let c = 0; c < numCandidates; c++) {
        const idx = getUltraRandomIndex(tickets.length);
        candidates.push(tickets[idx]);
      }

      // Elegir el candidato con mejor distribución
      let bestCandidate = candidates[0];
      let bestDistance = getMinDistanceToSelected(bestCandidate);

      for (const candidate of candidates) {
        const distance = getMinDistanceToSelected(candidate);
        if (
          distance > bestDistance ||
          (distance === bestDistance && Math.random() > 0.5)
        ) {
          bestCandidate = candidate;
          bestDistance = distance;
        }
      }

      // Validar y agregar el mejor candidato
      if (
        typeof bestCandidate === "number" &&
        Number.isInteger(bestCandidate) &&
        bestCandidate > 0 &&
        !selected.includes(bestCandidate)
      ) {
        selected.push(bestCandidate);

        // Remover de tickets disponibles
        const indexToRemove = tickets.indexOf(bestCandidate);
        if (indexToRemove !== -1) {
          tickets.splice(indexToRemove, 1);
        }
      }

      attempts++;
    }

    // CAPA 4: Completar si es necesario (fallback)
    while (selected.length < count && tickets.length > 0) {
      const randomIndex = getUltraRandomIndex(tickets.length);
      const ticket = tickets[randomIndex];

      if (
        typeof ticket === "number" &&
        Number.isInteger(ticket) &&
        ticket > 0 &&
        !selected.includes(ticket)
      ) {
        selected.push(ticket);
      }

      tickets.splice(randomIndex, 1);
    }

    // CAPA 5: Mezcla final antes de ordenar
    for (let finalRound = 0; finalRound < 5; finalRound++) {
      for (let i = selected.length - 1; i > 0; i--) {
        const j = getUltraRandomIndex(i + 1);
        [selected[i], selected[j]] = [selected[j], selected[i]];
      }
    }

    // Ordenar para presentación final
    const finalTickets = selected.sort((a, b) => a - b);

    // Validación final
    const invalidTickets = finalTickets.filter(
      (ticket) =>
        typeof ticket !== "number" || !Number.isInteger(ticket) || ticket < 1
    );

    if (invalidTickets.length > 0) {
      throw new Error(
        `Se detectaron tickets inválidos: ${invalidTickets.join(", ")}`
      );
    }

    if (finalTickets.length !== count) {
      throw new Error(
        `No se pudo completar la selección. Solicitados: ${count}, Obtenidos: ${finalTickets.length}`
      );
    }

    return finalTickets;
  };

  // Modal de confirmación
  const ConfirmationModal = () => {
    const [countdown, setCountdown] = useState(5);
    const [whatsappOpened, setWhatsappOpened] = useState(false);
    const [popupBlocked, setPopupBlocked] = useState(false);

    // Detectar si el navegador está bloqueando ventanas emergentes
    useEffect(() => {
      const testPopup = window.open("", "_blank", "width=1,height=1");
      if (!testPopup || testPopup.closed || typeof testPopup.closed === "undefined") {
        setPopupBlocked(true);
        toast.warning("Las ventanas emergentes están bloqueadas. Usa el botón manual para WhatsApp.");
      } else {
        testPopup.close();
      }
    }, []);

    // Preparar datos para WhatsApp (siempre, incluso si assignedTickets está vacío)
    const ticketsText = (assignedTickets || [])
      .map((ticket) => formatTicketNumber(ticket, raffle?.totalTickets))
      .join(", ");

    const sorteoDate = new Date(raffle?.drawDate || "").toLocaleDateString(
      "es-ES",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );

    const whatsappMessage = encodeURIComponent(
      `¡Hola!\n` +
        `He comprado tickets para el sorteo: ${raffle?.title}\n` +
        ` Mis datos:\n` +
        `• Nombre: ${formData.firstName} ${formData.lastName}\n` +
        `• Celular: ${formData.phoneNumber}\n` +
        `• Email: ${formData.email}\n` +
        `Mis números registrados: ${ticketsText}\n` +
        `Fecha del sorteo: ${sorteoDate}`
    );

    const whatsappNumber = "5491141972327"; // +54 9 11 2252-2982
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    useEffect(() => {
      if (!assignedTickets || assignedTickets.length === 0) {
        return;
      }

      const timer = setInterval(() => {
        setCountdown((prev) => {
          const newCount = prev - 1;
          if (newCount <= 0) {
            // Detener el timer inmediatamente
            clearInterval(timer);
            return 0;
          }
          return newCount;
        });
      }, 1000);

      // Cleanup function
      return () => clearInterval(timer);
    }, [assignedTickets]);

    // useEffect separado SOLO para abrir WhatsApp cuando countdown llegue a 0
    useEffect(() => {
      if (countdown === 0 && assignedTickets && assignedTickets.length > 0) {
        // Usar un flag para evitar múltiples ejecuciones
        const hasOpened = sessionStorage.getItem("whatsapp-opened");
        if (!hasOpened) {
          sessionStorage.setItem("whatsapp-opened", "true");
          setWhatsappOpened(true);
          
          // Si las ventanas emergentes están bloqueadas, usar location.href directamente
          if (popupBlocked) {
            setTimeout(() => {
              try {
                window.location.href = whatsappUrl;
              } catch (e) {
                console.error("Error al abrir WhatsApp con location.href:", e);
                toast.error("No se pudo abrir WhatsApp. Usa el botón manual.");
              }
            }, 500);
          } else {
            // Múltiples intentos para abrir WhatsApp
            const openWhatsApp = () => {
              let openedSuccessfully = false;
              
              try {
                // Intento 1: Abrir directamente
                const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                
                // Verificar si se abrió correctamente
                if (newWindow && !newWindow.closed) {
                  openedSuccessfully = true;
                } else {
                  // Intento 2: Usar location.href después de un delay
                  setTimeout(() => {
                    try {
                      window.location.href = whatsappUrl;
                      openedSuccessfully = true;
                    } catch (e) {
                      console.error("Error al abrir WhatsApp con location.href:", e);
                    }
                  }, 1000);
                }
              } catch (error) {
                console.error("Error al abrir WhatsApp:", error);
                // Intento 3: Usar location.href como fallback
                setTimeout(() => {
                  try {
                    window.location.href = whatsappUrl;
                    openedSuccessfully = true;
                  } catch (e) {
                    console.error("Error final al abrir WhatsApp:", e);
                  }
                }, 2000);
              }
              
              // Si después de 3 segundos no se abrió, mostrar alerta
              setTimeout(() => {
                if (!openedSuccessfully) {
                  toast.error("No se pudo abrir WhatsApp automáticamente. Usa el botón manual.");
                }
              }, 3000);
            };

            // Ejecutar inmediatamente
            openWhatsApp();
          }
        }
      }
    }, [countdown, whatsappUrl, assignedTickets, popupBlocked]);

    // Verificar si WhatsApp ya se había abierto al montar el modal
    useEffect(() => {
      const hasOpened = sessionStorage.getItem("whatsapp-opened");
      if (hasOpened) {
        setWhatsappOpened(true);
      }
    }, []);

    // Resetear estado cuando cambian los tickets asignados (nueva compra)
    useEffect(() => {
      if (assignedTickets && assignedTickets.length > 0) {
        sessionStorage.removeItem("whatsapp-opened");
        setWhatsappOpened(false);
        setCountdown(5); // Resetear countdown también
      }
    }, [assignedTickets]);

    // Cleanup cuando se cierre el modal
    useEffect(() => {
      return () => {
        sessionStorage.removeItem("whatsapp-opened");
      };
    }, []);

    // Validación de seguridad para evitar errores (después de hooks)
    if (!assignedTickets || assignedTickets.length === 0) {
      return null;
    }

    // Verificar cuáles tickets son premium
    const isPremiumTicket = (ticketNumber: number) => {
      return (raffle?.premiumNumbers || []).some(
        (premium) => premium.number === ticketNumber && !premium.isBlocked
      );
    };

    const premiumTickets = assignedTickets.filter(isPremiumTicket);
    const regularTickets = assignedTickets.filter(
      (ticket) => !isPremiumTicket(ticket)
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full mb-4">
              <img src={logo} alt="Logo" className="w-16 h-16 rounded-full" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Compra Exitosa!
            </h2>
            {/* Fecha del sorteo */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
              <p className="text-blue-800 font-medium text-sm">
                📅 <strong>Fecha del sorteo:</strong>
              </p>
              <p className="text-blue-700 text-sm">{sorteoDate}</p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl mb-6">
              <h3 className="font-bold text-orange-600 mb-2">Tus Tickets:</h3>

              {/* Números regulares */}
              {regularTickets.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-1">
                    Números Regulares:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {regularTickets.map((ticket) => (
                      <span
                        key={ticket}
                        className="bg-orange-500 text-white px-3 py-1 rounded-full font-bold text-sm"
                      >
                        {formatTicketNumber(ticket, raffle?.totalTickets)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Números premium */}
              {premiumTickets.length > 0 && (
                <div>
                  <p className="text-sm text-gold-600 mb-1 font-medium">
                    ¡Números Premium! ⭐
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {premiumTickets.map((ticket) => (
                      <span
                        key={ticket}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg animate-pulse"
                      >
                        ⭐ {formatTicketNumber(ticket, raffle?.totalTickets)} ⭐
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-4">
              📧 Comprobante enviado por correo. Revisa tu bandeja, spam o no
              deseado.
            </p>

            {/* Link a Instagram */}
            <div className="mb-4">
              <a
                href="https://www.instagram.com/jrrifas?igsh=ZTBqcTR2MTI3Z2pj&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium text-sm transition-colors"
              >
                📸 Sorteos en vivo en Instagram. ¡Síguenos!
              </a>
            </div>

            {/* Contador de WhatsApp */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <div className="text-center">
                {whatsappOpened ? (
                  <>
                    <p className="text-green-800 font-medium text-sm mb-2">
                      ✅ WhatsApp se ha abierto
                    </p>
                    <div className="text-lg font-bold text-green-600 mb-2">
                      ¡Mensaje listo para enviar!
                    </div>
                    <p className="text-green-700 text-xs">
                      Verifica la nueva pestaña de WhatsApp y envía el mensaje
                    </p>
                  </>
                ) : countdown > 0 ? (
                  <>
                    <p className="text-green-800 font-medium text-sm mb-2">
                      💬 Serás redirigido a WhatsApp en:
                    </p>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      {countdown}s
                    </div>
                    <p className="text-green-700 text-xs">
                      Para confirmar tu compra y recibir actualizaciones del
                      sorteo
                    </p>
                    {popupBlocked && (
                      <p className="text-orange-600 text-xs mt-2 font-medium">
                        ⚠️ Ventanas emergentes bloqueadas - Se abrirá en la misma pestaña
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-green-800 font-medium text-sm mb-2">
                      🚀 Abriendo WhatsApp...
                    </p>
                    <div className="text-lg font-bold text-green-600 mb-2">
                      {popupBlocked ? "Redirigiendo..." : "Por favor permite las ventanas emergentes"}
                    </div>
                    <p className="text-green-700 text-xs">
                      {popupBlocked 
                        ? "Se abrirá WhatsApp en esta pestaña" 
                        : "Si no se abre automáticamente, usa el botón de abajo"
                      }
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const hasOpened = sessionStorage.getItem("whatsapp-opened");
                  if (!hasOpened) {
                    sessionStorage.setItem("whatsapp-opened", "true");
                    setWhatsappOpened(true);
                    
                    // Múltiples métodos para abrir WhatsApp
                    try {
                      // Método 1: window.open
                      const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
                      
                      // Si no se abrió, intentar con location.href
                      if (!newWindow || newWindow.closed) {
                        setTimeout(() => {
                          window.location.href = whatsappUrl;
                        }, 500);
                      }
                    } catch (error) {
                      // Método 2: location.href como fallback
                      setTimeout(() => {
                        window.location.href = whatsappUrl;
                      }, 500);
                    }
                  }
                }}
                className="flex-1 bg-green-500 text-white py-3 px-4 rounded-full font-bold hover:bg-green-600 transition-all duration-300 text-sm"
              >
                📱 Ir a WhatsApp
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem("whatsapp-opened");
                  setShowConfirmationModal(false);
                  navigate("/");
                }}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-full font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="raffleDetail" className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex text-2xl items-center gap-2 text-orange-300 hover:text-orange-600 font-medium mb-6 hover:scale-105 transition-transform"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <div className="max-w-2xl mx-auto ">
          <div className="bg-white rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8 mb-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Shield className="text-green-500" size={32} />
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                Finalizar Compra Segura
              </h1>
            </div>

            {/* Purchase Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 p-4 sm:p-6 rounded-xl mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Resumen de Compra
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sorteo:</span>
                  <span className="font-medium">{raffle.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad de boletos:</span>
                  <span className="font-medium">{ticketCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio por boleto:</span>
                  <span className="font-medium">
                    {formatPrice(raffle.pricePerTicket)}
                  </span>
                </div>
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total a pagar:</span>
                    <span className="text-orange-500">
                      {formatPrice(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 sm:mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Tu apellido"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Número de Teléfono *
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="+54 9 11 1234-5678"
                  required
                />
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-gray-700 font-medium mb-4">
                  Método de Pago *
                </label>
                <div className="space-y-2 sm:space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all hover:scale-105 ${
                        formData.paymentMethod === method.id
                          ? "border-orange-500 bg-orange-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handlePaymentMethodChange(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              formData.paymentMethod === method.id
                                ? "border-orange-500 bg-orange-500"
                                : "border-gray-300"
                            }`}
                          >
                            {formData.paymentMethod === method.id && (
                              <Check size={14} className="text-white" />
                            )}
                          </div>
                          <span className="font-medium text-base sm:text-lg">
                            {method.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              {selectedMethod && (
                <div className="bg-blue-50 border border-blue-200 p-4 sm:p-6 rounded-xl">
                  <h3 className="font-bold text-blue-800 mb-2 sm:mb-3 text-base sm:text-lg">
                    Datos para transferir a {selectedMethod.name}:
                  </h3>
                  <pre className="text-blue-700 whitespace-pre-line font-mono text-xs sm:text-sm bg-white p-3 sm:p-4 rounded border">
                    {selectedMethod.details}
                  </pre>
                </div>
              )}

              {/* File Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 cursor-pointer">
                  Comprobante de Transferencia * (JPG o PNG)
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-orange-500 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="payment-proof"
                      required
                    />
                    <label htmlFor="payment-proof">
                      <Upload
                        className="mx-auto mb-2 text-gray-400"
                        size={32}
                      />
                      {paymentProof ? (
                        <p className="text-green-600 font-medium">
                          {paymentProof.name}
                        </p>
                      ) : (
                        <p className="text-gray-600">
                          Haz clic para subir tu comprobante de transferencia
                        </p>
                      )}
                    </label>
                  </div>
                </label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 p-3 sm:p-4 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  <strong>Importante:</strong> Solo necesitas completar tus
                  datos y subir el comprobante de transferencia. Te
                  contactaremos por WhatsApp usando el número que proporciones
                  para confirmar tu pago y notificarte si resultas ganador.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isEmailLoading}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-full font-bold text-base sm:text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed fixed sm:static bottom-0 left-0 mx-auto z-40 max-w-2xl"
              >
                {isSubmitting || isEmailLoading
                  ? "Procesando..."
                  : "Finalizar Compra"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />

      {showConfirmationModal && <ConfirmationModal />}
    </div>
  );
};

export default PaymentPage;
