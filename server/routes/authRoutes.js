const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();


// =====================================
// ARCHIVO DE USUARIOS
// =====================================

const usersFile = path.join(
    __dirname,
    "../data/users.json"
);



// =====================================
// LEER USUARIOS
// =====================================

function getUsers(){


    if(!fs.existsSync(usersFile)){


        fs.writeFileSync(
            usersFile,
            "[]"
        );


    }



    const data =
    fs.readFileSync(
        usersFile,
        "utf8"
    );



    if(!data.trim()){

        return [];

    }



    try {


        return JSON.parse(data);


    } catch(error){


        return [];


    }


}



// =====================================
// GUARDAR USUARIOS
// =====================================

function saveUsers(users){


    fs.writeFileSync(

        usersFile,

        JSON.stringify(
            users,
            null,
            4
        )

    );


}




// =====================================
// REGISTRO
// =====================================


router.post("/register",(req,res)=>{


    console.log(
        "REGISTRO RECIBIDO:",
        req.body
    );



    const {

        nombre,
        correo,
        password

    } = req.body;



    if(
        !nombre ||
        !correo ||
        !password
    ){


        return res.json({

            success:false,

            message:"Completa todos los campos"

        });


    }




    const users =
    getUsers();




    const existe =
    users.find(

        user =>
        user.correo.toLowerCase()
        ===
        correo.toLowerCase()

    );




    if(existe){


        return res.json({

            success:false,

            message:"El correo ya está registrado"

        });


    }





    const nuevoUsuario = {


        id: Date.now(),


        nombre,


        correo,


        password


    };





    users.push(
        nuevoUsuario
    );



    saveUsers(
        users
    );





    return res.json({

        success:true,

        message:"Registro exitoso",

        usuario:nuevoUsuario


    });



});






// =====================================
// LOGIN
// =====================================


router.post("/login",(req,res)=>{


    console.log(
        "LOGIN RECIBIDO:",
        req.body
    );



    const {

        correo,
        password

    } = req.body;





    if(
        !correo ||
        !password
    ){


        return res.json({

            success:false,

            message:"Completa todos los campos"

        });


    }






    const users =
    getUsers();





    const usuario =
    users.find(

        user =>

        user.correo.toLowerCase()
        ===
        correo.toLowerCase()

        &&

        user.password
        ===
        password

    );







    if(!usuario){


        return res.json({

            success:false,

            message:"Correo o contraseña incorrectos"

        });


    }





    return res.json({

        success:true,

        message:"Inicio de sesión correcto",

        usuario

    });



});






module.exports = router;