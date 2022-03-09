import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext, useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./Auth";

interface IContextProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const SocketContext = createContext<IContextProps | null>(null);

const SocketProvider = () => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  useEffect(() => {
    if (token && !socket) {
      const socketInit = io("ws://localhost:5000", {
        extraHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      socketInit.on("connect", () => setSocket(socketInit));
    }
  }, [token, socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      <Outlet />
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
