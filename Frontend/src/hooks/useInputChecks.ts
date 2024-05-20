const useInputChecks = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dniRegex = /^\d{11}$/;

  const isValidEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const isValidDni = (dni: string) => {
    return dniRegex.test(dni);
  };

  const isValidPassword = (password: string) => {
    return !(password.length < 6 || password.includes(" "));
  };

  return {
    isValidEmail,
    isValidDni,
    isValidPassword,
  };
};

export default useInputChecks;
