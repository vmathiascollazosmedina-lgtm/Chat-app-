const fs = require("fs");
const path = require("path");


const messagesFile = path.join(
    __dirname,
    "../data/publicMessages.json"
);



function getMessages(){

    if(!fs.existsSync(messagesFile)){

        fs.writeFileSync(
            messagesFile,
            "[]"
        );

    }


    return JSON.parse(
        fs.readFileSync(messagesFile,"utf8")
    );

}



function saveMessages(messages){

    fs.writeFileSync(
        messagesFile,
        JSON.stringify(messages,null,4)
    );

}



module.exports = (io)=>{


    io.on("connection",(socket)=>{


        console.log(
            "Usuario conectado:",
            socket.id
        );



        // Enviar historial al entrar

        socket.emit(
            "historialPublico",
            getMessages()
        );



        // Recibir mensaje

        socket.on(
            "mensajePublico",
            (data)=>{


                const mensajes = getMessages();



                const nuevoMensaje = {


                    usuario:data.usuario,

                    mensaje:data.mensaje,

                    fecha:new Date()


                };



                mensajes.push(
                    nuevoMensaje
                );


                saveMessages(
                    mensajes
                );



                io.emit(
                    "nuevoMensajePublico",
                    nuevoMensaje
                );


            }
        );



    });


};