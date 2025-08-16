import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAllRifas,
  createRifa,
  addUserToRifa,
  updateRifa,
  removeUserFromRifa,
} from "../apis/rifa";

interface PremiumNumber {
  number: number;
  isBlocked: boolean;
}

interface Raffle {
  id: string;
  title: string;
  description: string;
  image: string;
  pricePerTicket: number;
  totalTickets: number;
  soldTickets?: number;
  drawDate: string;
  status: "active" | "finished";
  createdAt: string;
  premiumNumbers?: PremiumNumber[];
  users?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    payment: string;
    tickets: number[];
    paymentProof: string;
  }[];
}

interface Purchase {
  id: string;
  raffleId: string;
  firstName: string;
  lastName: string;
  email: string;
  ticketCount: number;
  paymentMethod: string;
  transactionId: string;
  paymentProof: string;
  status: "pending" | "confirmed" | "rejected";
  ticketNumbers: number[];
  createdAt: string;
}

interface SorteazoContextType {
  raffles: Raffle[];
  purchases: Purchase[];
  isAdmin: boolean;
  loading: boolean;
  addRaffle: (raffle: Omit<Raffle, "id" | "createdAt">) => Promise<void>;
  updateRaffle: (id: string, raffle: Partial<Raffle>) => void;
  deleteRaffle: (id: string) => void;
  addPurchase: (
    purchase: Omit<Purchase, "id" | "createdAt" | "ticketNumbers">
  ) => void;
  confirmPurchase: (id: string) => void;
  rejectPurchase: (id: string) => void;
  deletePurchase: (id: string) => void;
  removeUserFromRaffle: (raffleId: string, userIndex: number) => Promise<void>;
  performDraw: (raffleId: string) => number;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loadRaffles: () => Promise<void>;
  getOccupiedTicketsCount: (raffle: Raffle) => number;
  getAvailableTicketsCount: (raffle: Raffle) => number;
}

const SorteazoContext = createContext<SorteazoContextType | undefined>(
  undefined
);

export const useSorteazo = () => {
  const context = useContext(SorteazoContext);
  if (!context) {
    throw new Error("useSorteazo must be used within a SorteazoProvider");
  }
  return context;
};

export const SorteazoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Función para cargar rifas desde Firebase
  const loadRaffles = async () => {
    try {
      setLoading(true);
      const rifasFromDB = await getAllRifas();

      if (rifasFromDB && rifasFromDB.length > 0) {
        setRaffles(rifasFromDB as Raffle[]);
      } else {
        // No hay rifas disponibles, mantener array vacío
        setRaffles([]);
      }
    } catch (error) {
      console.error("Error al cargar rifas:", error);
      // En caso de error, mantener array vacío
      setRaffles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const adminStatus = localStorage.getItem("jraffle_admin");
    if (adminStatus === "true") {
      setIsAdmin(true);
    }
  }, []);

  // Cargar rifas al montar el componente
  useEffect(() => {
    loadRaffles();
  }, []);

  const addRaffle = async (raffleData: Omit<Raffle, "id" | "createdAt">) => {
    try {
      const newRaffleId = Date.now().toString();
      const newRaffle: Raffle = {
        ...raffleData,
        id: newRaffleId,
        createdAt: new Date().toISOString().split("T")[0],
        users: [], // Inicializar array vacío de usuarios
      };

      // Guardar en Firebase
      await createRifa(newRaffleId, newRaffle);

      // Actualizar estado local
      setRaffles((prev) => [...prev, newRaffle]);

      // Recargar rifas desde Firebase para mantener consistencia
      await loadRaffles();

      console.log("Rifa creada exitosamente");
    } catch (error) {
      console.error("Error al crear rifa:", error);
      throw error; // Re-lanzar el error para que el componente pueda manejarlo
    }
  };

  const updateRaffle = (id: string, raffleData: Partial<Raffle>) => {
    setRaffles((prev) =>
      prev.map((raffle) =>
        raffle.id === id ? { ...raffle, ...raffleData } : raffle
      )
    );
  };

  const deleteRaffle = (id: string) => {
    setRaffles((prev) => prev.filter((raffle) => raffle.id !== id));
    setPurchases((prev) => prev.filter((purchase) => purchase.raffleId !== id));
  };

  const addPurchase = (
    purchaseData: Omit<Purchase, "id" | "createdAt" | "ticketNumbers">
  ) => {
    const raffle = raffles.find((r) => r.id === purchaseData.raffleId);
    if (!raffle) return;

    // Calcular el número de tickets ya ocupados (dinámicamente)
    const occupiedTickets = getOccupiedTicketsCount(raffle);

    // Calcular el número de tickets ya reservados (incluyendo compras pendientes)
    const pendingTickets = purchases
      .filter(
        (p) => p.raffleId === purchaseData.raffleId && p.status === "pending"
      )
      .reduce((sum, p) => sum + p.ticketCount, 0);

    const startTicket = occupiedTickets + pendingTickets + 1;
    const ticketNumbers = Array.from(
      { length: purchaseData.ticketCount },
      (_, i) => startTicket + i
    );

    const newPurchase: Purchase = {
      ...purchaseData,
      id: Date.now().toString(),
      ticketNumbers,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setPurchases((prev) => [...prev, newPurchase]);
  };

  const confirmPurchase = async (id: string) => {
    const purchase = purchases.find((p) => p.id === id);
    if (!purchase) return;

    try {
      // Confirmar la compra
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "confirmed" as const } : p
        )
      );

      // Crear nuevo usuario para agregar al array users
      const newUser = {
        firstName: purchase.firstName,
        lastName: purchase.lastName,
        email: purchase.email,
        payment: purchase.paymentMethod,
        tickets: purchase.ticketNumbers || [],
        paymentProof: purchase.paymentProof,
      };

      // Agregar usuario a Firebase
      await addUserToRifa(purchase.raffleId, newUser);

      // Actualizar estado local (ya no necesitamos actualizar soldTickets)
      setRaffles((prev) =>
        prev.map((raffle) => {
          if (raffle.id === purchase.raffleId) {
            return {
              ...raffle,
              users: [...(raffle.users || []), newUser],
            };
          }
          return raffle;
        })
      );

      console.log("Usuario agregado a la rifa exitosamente");
    } catch (error) {
      console.error("Error al confirmar compra:", error);
      // Revertir el cambio en caso de error
      setPurchases((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: "pending" as const } : p
        )
      );
    }
  };

  const rejectPurchase = (id: string) => {
    setPurchases((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "rejected" as const } : p))
    );
  };

  const deletePurchase = (id: string) => {
    setPurchases((prev) => prev.filter((purchase) => purchase.id !== id));
  };

  const removeUserFromRaffle = async (raffleId: string, userIndex: number) => {
    try {
      await removeUserFromRifa(raffleId, userIndex);

      // Actualizar estado local eliminando el usuario por índice
      setRaffles((prev) =>
        prev.map((raffle) => {
          if (raffle.id === raffleId) {
            return {
              ...raffle,
              users:
                raffle.users?.filter((_, index) => index !== userIndex) || [],
            };
          }
          return raffle;
        })
      );

      console.log("Usuario eliminado de la rifa exitosamente");
    } catch (error) {
      console.error("Error al eliminar usuario de la rifa:", error);
      throw error; // Re-lanzar para que el componente pueda manejarlo
    }
  };

  const performDraw = (raffleId: string): number => {
    const raffle = raffles.find((r) => r.id === raffleId);
    if (!raffle) return 0;

    const confirmedPurchases = purchases.filter(
      (p) => p.raffleId === raffleId && p.status === "confirmed"
    );

    const allTickets = confirmedPurchases.flatMap((p) => p.ticketNumbers);
    if (allTickets.length === 0) return 0;

    const winningTicket =
      allTickets[Math.floor(Math.random() * allTickets.length)];

    setRaffles((prev) =>
      prev.map((r) =>
        r.id === raffleId ? { ...r, status: "finished" as const } : r
      )
    );

    return winningTicket;
  };

  const login = (username: string, password: string): boolean => {
    if (username === "administrador" && password === "luzmaria.2912") {
      setIsAdmin(true);
      localStorage.setItem("jraffle_admin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("jraffle_admin");
  };

  // Función para calcular tickets ocupados dinámicamente desde el array de usuarios
  const getOccupiedTicketsCount = (raffle: Raffle): number => {
    if (!raffle.users || raffle.users.length === 0) return 0;

    const allTickets: number[] = [];
    raffle.users.forEach((user) => {
      if (user.tickets && Array.isArray(user.tickets)) {
        allTickets.push(...user.tickets);
      }
    });

    return allTickets.length;
  };

  // Función para calcular tickets disponibles
  const getAvailableTicketsCount = (raffle: Raffle): number => {
    const occupiedCount = getOccupiedTicketsCount(raffle);
    return raffle.totalTickets - occupiedCount;
  };

  return (
    <SorteazoContext.Provider
      value={{
        raffles,
        purchases,
        isAdmin,
        loading,
        addRaffle,
        updateRaffle,
        deleteRaffle,
        addPurchase,
        confirmPurchase,
        rejectPurchase,
        deletePurchase,
        removeUserFromRaffle,
        performDraw,
        login,
        logout,
        loadRaffles,
        getOccupiedTicketsCount,
        getAvailableTicketsCount,
      }}
    >
      {children}
    </SorteazoContext.Provider>
  );
};
