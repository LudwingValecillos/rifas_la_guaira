import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firabase";
import { convertFileToBase64 } from "../utils/convertFileToBase64";

// Types
interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  payment: string;
  tickets: number[];
  paymentProof: string;
}

interface PremiumNumber {
  number: number;
  isBlocked: boolean;
}

interface RaffleData {
  title: string;
  description: string;
  image: string;
  pricePerTicket: number;
  totalTickets: number;
  drawDate: string;
  status: string;
  createdAt: string;
  premiumNumbers?: PremiumNumber[];
  users?: User[];
}

interface PurchaseData {
  id: string;
  raffleId: string;
  firstName: string;
  lastName: string;
  email: string;
  ticketCount: number;
  paymentMethod: string;
  transactionId: string;
  paymentProof: string;
  status: string;
  createdAt: string;
  ticketNumbers: number[];
}

export const saveRifa = async () => {
  const rifaData = {
    id: "1",
    title: "Sorteo PlayStation 5",
    description:
      "¡Participa en nuestro increíble sorteo de PlayStation 5! Incluye control DualSense y juego de regalo.",
    image: "/lovable-uploads/9fb806d7-7cf2-4880-a7bb-2fdee3dc336c.png",
    pricePerTicket: 3000,
    totalTickets: 500,
    soldTickets: 380,
    drawDate: "2025-06-25",
    status: "active",
    createdAt: "2024-12-17",
    users: [
      {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan@mail.com",
        tickets: [45, 132, 208],
      },
      {
        firstName: "Lucía",
        lastName: "Gómez",
        email: "lucia@mail.com",
        tickets: [12, 79],
      },
    ],
  };

  await setDoc(doc(db, "rifas", rifaData.id), rifaData);
};

export const getAllRifas = async () => {
  try {
    const ref = collection(db, "rifas");
    const snap = await getDocs(ref);

    const rifas = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return rifas;
  } catch (error) {
    console.error("Error al obtener las rifas:", error);
    return [];
  }
};

export const createRifa = async (id: string, data: RaffleData) => {
  try {
    await setDoc(doc(db, "rifas", id), data);
    console.log("Rifa creada con éxito");
  } catch (error) {
    console.error("Error al crear rifa:", error);
  }
};

{
  /*await updateRifa('2', {
  status: 'finalizada',
  drawDate: '2025-07-20'
});*/
}
export const updateRifa = async (
  id: string,
  updatedFields: Partial<Record<string, unknown>>
) => {
  try {
    await updateDoc(doc(db, "rifas", id), updatedFields);
    console.log("Rifa actualizada con éxito");
  } catch (error) {
    console.error("Error al actualizar rifa:", error);
  }
};

{
  /*await addUserToRifa('2', {
  firstName: 'Carlos',
  lastName: 'López',
  email: 'carlos@mail.com',
  tickets: [11, 12, 13]
});*/
}
export const addUserToRifa = async (rifaId: string, user: User) => {
  try {
    const ref = doc(db, "rifas", rifaId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error("La rifa no existe");

    const data = snap.data();
    const currentUsers = data.users || [];

    const updatedUsers = [...currentUsers, user];

    await updateDoc(ref, { users: updatedUsers });
    console.log("Usuario agregado con éxito");
  } catch (error) {
    console.error("Error al agregar usuario a rifa:", error);
  }
};

// Nueva función para eliminar un usuario específico de una rifa por índice
export const removeUserFromRifa = async (rifaId: string, userIndex: number) => {
  try {
    const ref = doc(db, "rifas", rifaId);
    const snap = await getDoc(ref);

    if (!snap.exists()) throw new Error("La rifa no existe");

    const data = snap.data();
    const currentUsers = data.users || [];

    // Verificar que el índice sea válido
    if (userIndex < 0 || userIndex >= currentUsers.length) {
      throw new Error("Índice de usuario inválido");
    }

    // Crear nuevo array sin el usuario en el índice especificado
    const updatedUsers = currentUsers.filter(
      (_, index: number) => index !== userIndex
    );

    await updateDoc(ref, { users: updatedUsers });
    console.log(
      `Usuario en índice ${userIndex} eliminado de la rifa con éxito`
    );
    return true;
  } catch (error) {
    console.error("Error al eliminar usuario de la rifa:", error);
    throw error;
  }
};

export const deleteRifa = async (id: string) => {
  try {
    await deleteDoc(doc(db, "rifas", id));
    console.log("Rifa eliminada con éxito");
  } catch (error) {
    console.error("Error al eliminar rifa:", error);
  }
};

// Función para crear una compra en Firebase
export const createPurchase = async (
  id: string,
  purchaseData: PurchaseData
) => {
  try {
    await setDoc(doc(db, "purchases", id), purchaseData);
    console.log("Compra creada con éxito");
  } catch (error) {
    console.error("Error al crear compra:", error);
    throw error;
  }
};

// Función para eliminar una compra de Firebase
export const deletePurchase = async (id: string) => {
  try {
    await deleteDoc(doc(db, "purchases", id));
    console.log("Compra eliminada con éxito");
  } catch (error) {
    console.error("Error al eliminar compra:", error);
    throw error;
  }
};

// ----------------------------
export const uploadImageToImageKit = async (file) => {
  try {
    // Convertir el archivo a cadena base64
    const base64Image = await convertFileToBase64(file);
    // Remover el prefijo "data:image/*;base64," si existe
    const base64Data = base64Image.split(",")[1];
    const formData = new FormData();
    formData.append("image", base64Data);
    formData.append("key", "9a2d7bbb99f1b945a192fcbbcf11c4af");

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return (data.data && data.data.url) || "";
  } catch (error) {
    console.error(
      "Error uploading image to ImgBB:",
      JSON.stringify(error, null, 2)
    );
    return "";
  }
};

// Nueva función para obtener una rifa específica por ID
export const getRifaById = async (id: string) => {
  try {
    const ref = doc(db, "rifas", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      console.error("La rifa no existe");
      return null;
    }

    return {
      id: snap.id,
      ...snap.data(),
    };
  } catch (error) {
    console.error("Error al obtener la rifa:", error);
    return null;
  }
};
