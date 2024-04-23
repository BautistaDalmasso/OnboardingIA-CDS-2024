import React, { createContext, useContext, useState } from "react";
import { IUser } from "./common/interfaces/User";
import { IMessage } from "./common/interfaces/Message";


type ConnectionType = "NONE" | "ONLINE" | "OFFLINE";

interface State {
  user: IUser | null;
  connectionType: ConnectionType;
  accessToken: string | null;
  messages: IMessage[];
  isConnected: boolean;
}

const defaultState: State = {
  user: null,
  connectionType: "NONE",
  accessToken: null,
  messages: [],
  isConnected: false,
};

const ContextState = createContext({});

export const ContextStateProvider = ({ children }: any) => {
  const [contextState, setContextState] = useState<State>(defaultState);

  return (
    <ContextState.Provider value={{ contextState, setContextState }}>
      {children}
    </ContextState.Provider>
  );
};

export const useContextState = (): {
  contextState: State;
  setContextState: React.Dispatch<React.SetStateAction<State>>;
} => useContext(ContextState) as any;
