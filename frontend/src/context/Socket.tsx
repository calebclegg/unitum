import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

interface IProviderProps {
  children: React.ReactNode;
}

interface IContextProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

const SocketContext = createContext<IContextProps | null>(null);

const SocketProvider = ({ children }: IProviderProps) => {
  const socket = useMemo(
    () =>
      io("http://localhost:3000", {
        extraHeaders: {
          Authorization: "Bearer <token>"
        }
      }),
    []
  );

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("`useSocket` was called without a Provider");
  }

  return context;
};

export default SocketProvider;
