import { useEffect } from "react";
import { Routes } from "../../src/common/enums/routes";
import { NavigationProp } from "@react-navigation/native";
import { useContextState } from "../ContexState";
import { ConnectionType } from "../common/enums/connectionType";

interface Props {
  navigation: NavigationProp<any, any>;
}

const Logout = ({ navigation }: Props) => {
  const { setContextState } = useContextState();

  useEffect(() => {
    setContextState((state) => ({
      ...state,
      user: null,
      connectionType: ConnectionType.NONE,
      accessToken: null,
      userOffline: false,
      messages: [],
    }));
    navigation.navigate(Routes.Home);
  }, []);

  return null;
};

export default Logout;
