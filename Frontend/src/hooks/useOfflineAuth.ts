import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import { ConnectionType } from "../common/enums/connectionType";
import useOfflineStorage from "./useOfflineStorage";

const useOfflineAuth = () => {
  const { setContextState } = useContextState();
  const { getLastUser, getLastUsersLoans } = useOfflineStorage();

  const offlineAuthenticate = async () => {
    const user = await getLastUser();

    if (user === null) {
      Alert.alert(
        "No user saved in this device.",
        "Try logging in while connected to save your user.",
      );

      return false;
    }

    const loans = await getLastUsersLoans();

    setContextState((state) => ({
      ...state,
      user: user,
      connectionType: ConnectionType.OFFLINE,
      userOffline: true,
      loans: loans,
    }));

    return false;
  };

  return {
    offlineAuthenticate,
  };
};

export default useOfflineAuth;
