import { io } from "socket.io-client";

export const socket = io("https://milkyway-farms.onrender.com", {
  autoConnect: true,
});

