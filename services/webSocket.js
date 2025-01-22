import { Server as SocketIOServer } from "socket.io";

let io;

export const setupWebSocket = (httpServer) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["Content-Type","Authorization"],
            credentials: true
            },
            });

            io.on("connection", (socket) => {
                console.log("Client connected");
                socket.on("bookSeat", (seatData) => {
                    console.log("Seat booked:", seatData); // Log the seat data
                    socket.broadcast.emit("seatBooked", seatData);
                });

                socket.on("disconnect", () => {
                    console.log("Client disconnected");
            });
            });

            return io;

        }

        export const getIo = () => io;