const express = require("express");
const path = require("path");
const http = require("http");
const fs = require("fs");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// =====================================
// SOCKET.IO
// =====================================

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

// =====================================
// MIDDLEWARES
// =====================================

app.use(cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// =====================================
// FRONTEND
// =====================================

app.use(
    express.static(
        path.join(__dirname, "../client")
    )
);

// =====================================
// RUTAS
// =====================================

const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/users");
const messagesRoutes = require("./routes/messages");

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/messages", messagesRoutes);

// =====================================
// ARCHIVOS
// =====================================

const messagesFile = path.join(
    __dirname,
    "data/messages.json"
);

if (!fs.existsSync(messagesFile)) {

    fs.writeFileSync(
        messagesFile,
        JSON.stringify({
            publico: [],
            privados: {}
        }, null, 4)
    );

}

// =====================================
// MENSAJES
// =====================================

function getMessages() {

    try {

        const data = fs.readFileSync(
            messagesFile,
            "utf8"
        );

        if (!data.trim()) {

            return {
                publico: [],
                privados: {}
            };

        }

        return JSON.parse(data);

    } catch {

        return {
            publico: [],
            privados: {}
        };

    }

}

function saveMessages(data) {

    fs.writeFileSync(
        messagesFile,
        JSON.stringify(data, null, 4)
    );

}

// =====================================
// USUARIOS CONECTADOS
// =====================================

let usuariosConectados = [];

// =====================================
// SOCKET
// =====================================

io.on("connection", (socket) => {

    console.log("Usuario conectado:", socket.id);

    // ---------------------------
    // Usuario conectado
    // ---------------------------

    socket.on("usuarioConectado", (usuario) => {

        const existe = usuariosConectados.find(
            u => u.id == usuario.id
        );

        if (!existe) {

            usuariosConectados.push({
                id: usuario.id,
                nombre: usuario.nombre,
                socketId: socket.id
            });

        } else {

            existe.socketId = socket.id;

        }

        io.emit(
            "listaUsuarios",
            usuariosConectados
        );

        const mensajes = getMessages();

        socket.emit(
            "historialPublico",
            mensajes.publico
        );

    });

    // ---------------------------
    // CHAT PÚBLICO
    // ---------------------------

    socket.on("mensajePublico", (mensaje) => {

        const mensajes = getMessages();

        const nuevoMensaje = {

            usuario: mensaje.usuario,
            texto: mensaje.texto,
            fecha: Date.now()

        };

        mensajes.publico.push(
            nuevoMensaje
        );

        saveMessages(mensajes);

        io.emit(
            "nuevoMensajePublico",
            nuevoMensaje
        );

    });

    // ---------------------------
    // CHAT PRIVADO
    // ---------------------------

    socket.on("mensajePrivado", (data) => {

        const mensajes = getMessages();

        const clave = [
            String(data.de),
            String(data.para)
        ]
        .sort()
        .join("_");

        if (!mensajes.privados[clave]) {

            mensajes.privados[clave] = [];

        }

        const nuevoMensaje = {

            de: data.de,
            para: data.para,
            usuario: data.usuario,
            texto: data.texto,
            fecha: Date.now()

        };

        mensajes.privados[clave].push(
            nuevoMensaje
        );

        saveMessages(mensajes);

        const destino = usuariosConectados.find(
            u => u.id == data.para
        );

        if (destino) {

            io.to(destino.socketId).emit(
                "nuevoMensajePrivado",
                nuevoMensaje
            );

        }

        socket.emit(
            "nuevoMensajePrivado",
            nuevoMensaje
        );

    });
        // ---------------------------
    // OBTENER HISTORIAL PRIVADO
    // ---------------------------

    socket.on("obtenerChatPrivado", (data) => {

        const mensajes = getMessages();

        const clave = [
            String(data.de),
            String(data.para)
        ]
        .sort()
        .join("_");

        socket.emit(
            "historialPrivado",
            mensajes.privados[clave] || []
        );

    });

    // ---------------------------
    // DESCONECTAR
    // ---------------------------

    socket.on("disconnect", () => {

        usuariosConectados = usuariosConectados.filter(
            u => u.socketId !== socket.id
        );

        io.emit(
            "listaUsuarios",
            usuariosConectados
        );

        console.log(
            "Usuario desconectado:",
            socket.id
        );

    });

});

// =====================================
// RUTA PRINCIPAL
// =====================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../client/index.html"
        )
    );

});

// =====================================
// INICIAR SERVIDOR
// =====================================

const PORT = 3000;

server.listen(PORT, () => {

    console.log("==============================");
    console.log("Servidor iniciado correctamente");
    console.log("http://localhost:" + PORT);
    console.log("==============================");

});