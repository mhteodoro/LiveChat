import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.json({ message: "funcionou" });
});


const users = new Map<string, string>();


io.on("connection", (socket) => {

    console.log("Usuário conectado:", socket.id);


    // LOGIN
    socket.on("username", (msg) => {

        const username = msg.name?.trim();

        if (!username) {
            return;
        }

        users.set(socket.id, username);

        io.emit("user-login", `${username} está logado!`);
    });


    // MENSAGEM
    socket.on("textSend", (msg) => {

        const username = users.get(socket.id);
        const text = msg.trim();

        if (!username) {
            return;
        }

        if (!text) {
            return;
        }



        console.log(msg);

        io.emit("chat-message", `${username}: ${msg}`);

    });


    // LOGOUT
    socket.on("logout", () => {

        const username = users.get(socket.id);

        if (username) {
            io.emit(
                "user-logout",
                `${username} saiu do chat!`
            );
        }

        users.delete(socket.id);

    });


    // DESCONECTOU
    socket.on("disconnect", () => {

        const username = users.get(socket.id);

        if (username) {
            io.emit(
                "user-logout",
                `${username} saiu do chat!`
            );
        }

        users.delete(socket.id);

        console.log(
            "Usuário desconectado, número de ativos:",
            users.size
        );

    });

});


server.listen(3000, () => {
    console.log("http://localhost:3000");
});