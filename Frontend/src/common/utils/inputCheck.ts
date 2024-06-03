const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dniRegex = /^\d{11}$/;
const regexInventoryNumber = /^[0-9]+$/;

export const isValidEmail = (email: string) => {
  return emailRegex.test(email);
};

export const isValidDni = (dni: string) => {
  return dniRegex.test(dni);
};

export const isValidPassword = (password: string) => {
  return !(password.length < 6 || password.includes(" "));
};

export const isEmptyTextInput = (valueTextInput: string) => {
  return valueTextInput === "";
};

export const isEmptyNumberInput = (valueNumberInput: number) => {
  return valueNumberInput === 0;
};

export const isValidInventoryNumber = (inventoryNumber: number) => {
  return (
    inventoryNumber && regexInventoryNumber.test(inventoryNumber.toString())
  );
};
