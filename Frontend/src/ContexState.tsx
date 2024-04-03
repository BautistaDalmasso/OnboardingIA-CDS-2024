import React, { createContext, useContext, useState } from "react";
import { IUser } from "./common/interfaces/User";
import { IMessage } from "./common/interfaces/Message";

interface State {
  user: IUser | null;
  accessToken: string | null;
  messages: IMessage[];
}

const defaultState: State = {
  user: null,
  accessToken: null,
  messages: [],
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
