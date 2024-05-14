import { Alert } from "react-native";
import { useContextState } from "../ContexState";
import { ILoginResponse, IUser } from "../common/interfaces/User";
import { ConnectionType } from "../common/enums/connectionType";
import useOfflineStorage from "./useOfflineStorage";

const useFinalizeLogin = () => {
  const { setContextState } = useContextState();
  const { storeLastUser } = useOfflineStorage();

  const finalizeLogin = async (loginResponse: ILoginResponse) => {
    if (loginResponse.access_token) {
      setContextState((state) => ({
        ...state,
        user: loginResponse.user,
        connectionType: ConnectionType.ONLINE,
        accessToken: loginResponse.access_token,
        messages: [],
      }));

      await storeLastUser(loginResponse.user);
    }

    if (loginResponse.detail) {
      Alert.alert("Error", loginResponse.detail);

      return false;
    }

    await fetchDataForOfflineUse(loginResponse.user);
    return true;
  };

  const fetchDataForOfflineUse = async (user: IUser) => {
    await fetchQrCode(user);
  };

  const fetchQrCode = async (user: IUser) => {
    // TODO
  };

  return {
    finalizeLogin,
  };
};

export default useFinalizeLogin;
