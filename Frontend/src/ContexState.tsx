import React, { createContext, useContext, useState } from "react";
import { IUser } from "./common/interfaces/User";
import { IMessage } from "./common/interfaces/Message";
import { ConnectionType } from "./common/enums/connectionType";
import { ILoanInformation } from "./common/interfaces/LoanReqResponse";

interface State {
  user: IUser | null;
  connectionType: ConnectionType;
  accessToken: string | null;
  messages: IMessage[];
  isConnected: boolean;
  loans: ILoanInformation[];
}

const defaultState: State = {
  user: null,
  connectionType: ConnectionType.NONE,
  accessToken: null,
  messages: [],
  isConnected: false,
  loans: [],
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
