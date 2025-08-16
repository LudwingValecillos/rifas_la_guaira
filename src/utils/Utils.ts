export const formatWithThousands = (value: string): string => {
    if (!value) return "";
    const numericValue = parseInt(value.replace(/\D/g, ""));
    if (isNaN(numericValue)) return "";
    return numericValue.toLocaleString("es-CO");
  };