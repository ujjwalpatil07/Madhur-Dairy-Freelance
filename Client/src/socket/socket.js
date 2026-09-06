import { io } from "socket.io-client";

export const socket = io("https://madhur-dairy-daily-need-server-1eu6.onrender.com", {
  autoConnect: true,
});

