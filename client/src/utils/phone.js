export const sanitizePhone = (value) => {
  if (!value) return "";
  return value.toString().replace(/^0+/, "");
};

export const normalizePhoneInput = (value) => {
  const digits = value.toString().replace(/\D/g, "");
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
};
