const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const messagesFile = path.join(__dirname, "../data/messages.json");

// =====================================
// CREAR ARCHIVO SI NO EXISTE
// =====================================

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
// LEER MENSAJES
// =====================================

function getMessages() {

    try {

        const data = fs.readFileSync(messagesFile, "utf8");

        if (!data.trim()) {

            return {
                publico: [],
                privados: {}
            };

        }

        return JSON.parse(data);

    } catch (error) {

        return {
            publico: [],
            privados: {}
        };

    }

}

// =====================================
// GUARDAR MENSAJES
// =====================================

function saveMessages(messages) {

    fs.writeFileSync(
        messagesFile,
        JSON.stringify(messages, null, 4)
    );

}

// =====================================
// HISTORIAL CHAT PÚBLICO
// =====================================

router.get("/public", (req, res) => {

    const messages = getMessages();

    res.json(messages.publico);

});

// =====================================
// GUARDAR MENSAJE PÚBLICO
// =====================================

router.post("/public", (req, res) => {

    const { usuario, texto } = req.body;

    if (!usuario || !texto) {

        return res.status(400).json({
            success: false,
            message: "Faltan datos."
        });

    }

    const messages = getMessages();

    const nuevoMensaje = {

        usuario,
        texto,
        fecha: Date.now()

    };

    messages.publico.push(nuevoMensaje);

    saveMessages(messages);

    res.json({
        success: true,
        mensaje: nuevoMensaje
    });

});

// =====================================
// HISTORIAL CHAT PRIVADO
// =====================================

router.get("/private/:id1/:id2", (req, res) => {

    const { id1, id2 } = req.params;

    const key = [id1, id2].sort().join("_");

    const messages = getMessages();

    res.json(messages.privados[key] || []);

});

// =====================================
// GUARDAR MENSAJE PRIVADO
// =====================================

router.post("/private", (req, res) => {

    const {

        de,
        para,
        usuario,
        texto

    } = req.body;

    if (!de || !para || !texto) {

        return res.status(400).json({

            success: false,
            message: "Faltan datos."

        });

    }

    const key = [de, para].sort().join("_");

    const messages = getMessages();

    if (!messages.privados[key]) {

        messages.privados[key] = [];

    }

    const nuevoMensaje = {

        de,
        para,
        usuario,
        texto,
        fecha: Date.now()

    };

    messages.privados[key].push(nuevoMensaje);

    saveMessages(messages);

    res.json({

        success: true,
        mensaje: nuevoMensaje

    });

});

// =====================================

module.exports = router;