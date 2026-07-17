const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile = path.join(__dirname, "../data/users.json");

// ===============================
// OBTENER TODOS LOS USUARIOS
// ===============================

router.get("/", (req, res) => {

    try {

        if (!fs.existsSync(usersFile)) {

            fs.writeFileSync(usersFile, "[]");

        }

        const data = fs.readFileSync(usersFile, "utf8");

        let users = [];

        if (data.trim() !== "") {

            users = JSON.parse(data);

        }

        const lista = users.map(user => ({

            id: user.id,
            nombre: user.nombre,
            correo: user.correo

        }));

        res.json(lista);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Error obteniendo los usuarios."

        });

    }

});

module.exports = router;