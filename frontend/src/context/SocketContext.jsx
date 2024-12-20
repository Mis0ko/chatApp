import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

export const SocketContext = createContext();

// hook to export context
export const useSocketContext = () => {
  return useContext(SocketContext);
};

// create context
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io("https://chatapp-production-0xap.onrender.com", {
        query: {
          userId: authUser._id,
        },
      }); // init socket connection
      setSocket(socket);

      // who is online?
      // socket.on() is used to listen to the events. can be used both on client and server side

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close(); // optimize, when component unmount, close socket
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
