const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dniRegex = /^\d{11}$/;

export const isValidEmail = (email: string) => {
  return emailRegex.test(email);
};

export const isValidDni = (dni: string) => {
  return dniRegex.test(dni);
};

export const isValidPassword = (password: string) => {
  return !(password.length < 6 || password.includes(" "));
};
