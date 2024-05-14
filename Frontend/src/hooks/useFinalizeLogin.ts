import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import { ILoginResponse } from "../common/interfaces/User";
import { OfflineStorageService } from "../services/offlineStorageService";
import { ConnectionType } from "../common/enums/connectionType";

const useFinalizeLogin = () => {
  const { contextState, setContextState } = useContextState();

  const finalizeLogin = async (loginResponse: ILoginResponse) => {
    if (loginResponse.access_token) {
      setContextState((state) => ({
        ...state,
        user: loginResponse.user,
        connectionType: ConnectionType.ONLINE,
        accessToken: loginResponse.access_token,
        messages: [],
      }));

      await OfflineStorageService.storeLastUser(loginResponse.user);
    }

    if (loginResponse.detail) {
      Alert.alert("Error", loginResponse.detail);

      return false;
    }

    return true;
  };

  return {
    finalizeLogin,
  };
};

export default useFinalizeLogin;
