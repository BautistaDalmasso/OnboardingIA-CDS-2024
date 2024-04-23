import * as React from "react";
import { ContextStateProvider } from "./src/ContexState";
import Router from "./Router";
import OfflineLogin from "../Frontend/src/components/OfflineLogin";
import NetInfo from "@react-native-community/netinfo";

const App = () => {
  const { isConnected } = NetInfo.useNetInfo();
  return (
    <ContextStateProvider>
    {isConnected && (<Router/>)}
    {!isConnected && (<OfflineLogin/>)}
    </ContextStateProvider>
  );
};

export default App;
