import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import { ConnectionType } from "../common/enums/connectionType";
import useBiometrics from "./useBiometrics";
import useOfflineStorage from "./useOfflineStorage";

const useOfflineAuth = () => {
  const { setContextState } = useContextState();
  const { getLastUser } = useOfflineStorage();
  const { authenticate } = useBiometrics();

  const offlineAuthenticate = async () => {
    const user = await getLastUser();

    if (user === null) {
      Alert.alert(
        "No user saved in this device.",
        "Try logging in while connected to save your user.",
      );

      return false;
    }

    const successBiometric = await authenticate();

    if (successBiometric) {
      setContextState((state) => ({
        ...state,
        user: user,
        connectionType: ConnectionType.OFFLINE,
        userOffline: true,
      }));

      return true;
    }

    return false;
  };

  return {
    offlineAuthenticate,
  };
};

export default useOfflineAuth;
