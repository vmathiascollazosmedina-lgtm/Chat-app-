console.log("chat.js funcionando");


// =====================================
// USUARIO ACTUAL
// =====================================

const usuario = JSON.parse(
    localStorage.getItem("usuario")
);


if (!usuario) {

    window.location.href = "index.html";

}


// Mostrar nombre del usuario

const usuarioActual =
document.getElementById("usuarioActual");


if (usuarioActual) {

    usuarioActual.textContent = usuario.nombre;

}


// Mostrar inicial en avatar

const avatar =
document.querySelector(".avatar");


if (avatar) {

    avatar.textContent =
    usuario.nombre
    .charAt(0)
    .toUpperCase();

}



// =====================================
// CONEXIÓN SOCKET.IO
// =====================================


const socket = io(
    "http://localhost:3000"
);



socket.on("connect", () => {

    console.log(
        "Conectado al servidor:",
        socket.id
    );


    socket.emit(
        "usuarioConectado",
        usuario
    );

});




// =====================================
// ELEMENTOS DEL CHAT
// =====================================


const messagesContainer =
document.getElementById(
    "messagesContainer"
);


const messageInput =
document.getElementById(
    "messageInput"
);


const sendMessage =
document.getElementById(
    "sendMessage"
);




// =====================================
// RECIBIR HISTORIAL
// =====================================


socket.on(
    "historialPublico",
    (mensajes)=>{


        messagesContainer.innerHTML = "";


        mensajes.forEach(
            (mensaje)=>{


                mostrarMensaje(mensaje);


            }
        );


    }
);




// =====================================
// RECIBIR MENSAJES NUEVOS
// =====================================


socket.on(
    "nuevoMensajePublico",
    (mensaje)=>{


        mostrarMensaje(mensaje);


    }
);





// =====================================
// MOSTRAR MENSAJE EN PANTALLA
// =====================================


function mostrarMensaje(mensaje){


    const div =
    document.createElement("div");


    div.className =
    "mensaje";



    div.innerHTML = `

        <b>${mensaje.usuario}</b>

        <br>

        <span>${mensaje.texto}</span>

    `;



    messagesContainer.appendChild(div);



    messagesContainer.scrollTop =
    messagesContainer.scrollHeight;


}






// =====================================
// ENVIAR MENSAJE
// =====================================


function enviarMensaje(){


    const texto =
    messageInput.value.trim();



    if(texto === "") {

        return;

    }



    socket.emit(

        "mensajePublico",

        {

            usuario: usuario.nombre,

            texto: texto

        }

    );



    messageInput.value = "";


}





// Botón enviar

if(sendMessage){

    sendMessage.addEventListener(
        "click",
        enviarMensaje
    );

}



// Enter para enviar

if(messageInput){

    messageInput.addEventListener(
        "keydown",
        (e)=>{


            if(e.key === "Enter"){

                enviarMensaje();

            }


        }
    );

}