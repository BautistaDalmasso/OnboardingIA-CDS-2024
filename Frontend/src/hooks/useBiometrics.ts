import { useState, useEffect } from "react";
import * as LocalAuthentication from "expo-local-authentication";

const useBiometrics = () => {
  const [biometricType, setBiometricType] =
    useState<LocalAuthentication.AuthenticationType | null>(null);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes =
        await LocalAuthentication.supportedAuthenticationTypesAsync();
      const type = supportedTypes.length > 0 ? supportedTypes[0] : null;

      setIsBiometricAvailable(hasHardware && type !== null);
      setBiometricType(type);
    } catch (err) {
      setError(err);
    }
  };

  const authenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate using biometrics",
      });

      if (result.success) {
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (err) {
      setIsAuthenticated(false);
      setError(err);
      return false;
    }
  };

  const desauthenticate = async () => {
    setIsAuthenticated(false);
  };

  return {
    biometricType,
    isBiometricAvailable,
    isAuthenticated,
    error,
    authenticate,
    desauthenticate,
  };
};

export default useBiometrics;
