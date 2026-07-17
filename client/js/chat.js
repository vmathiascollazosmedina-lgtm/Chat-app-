console.log("chat.js funcionando");


// =====================================
// USUARIO ACTUAL
// =====================================


const usuario = JSON.parse(
    localStorage.getItem("usuario")
);


if(!usuario){

    window.location.href = "/index.html";

}



// Mostrar usuario

const usuarioActual =
document.getElementById("usuarioActual");


if(usuarioActual){

    usuarioActual.textContent =
    usuario.nombre;

}



// Avatar

const avatar =
document.querySelector(".avatar");


if(avatar){

    avatar.textContent =
    usuario.nombre
    .charAt(0)
    .toUpperCase();

}



// =====================================
// SOCKET.IO
// =====================================


const socket = io(
    "http://localhost:3000"
);



socket.on("connect",()=>{


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
// ELEMENTOS
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



const usuariosOnline =
document.getElementById(
    "usuariosOnline"
);



const listaUsuarios =
document.getElementById(
    "listaUsuarios"
);



const cantidadUsuarios =
document.getElementById(
    "cantidadUsuarios"
);



const logoutBtn =
document.getElementById(
    "logoutBtn"
);



// =====================================
// HISTORIAL PUBLICO
// =====================================


socket.on(
    "historialPublico",
    (mensajes)=>{


        messagesContainer.innerHTML = "";


        mensajes.forEach(
            mensaje=>{

                mostrarMensaje(
                    mensaje
                );

            }
        );


    }
);



// =====================================
// NUEVOS MENSAJES
// =====================================


socket.on(
    "nuevoMensajePublico",
    (mensaje)=>{


        mostrarMensaje(
            mensaje
        );


    }
);



// =====================================
// MOSTRAR MENSAJE
// =====================================


function mostrarMensaje(mensaje){


    const div =
    document.createElement("div");



    div.className =
    "mensaje";



    if(
        mensaje.usuario === usuario.nombre
    ){

        div.classList.add(
            "propio"
        );

    }



    const hora =
    new Date(
        mensaje.fecha
    )
    .toLocaleTimeString(
        [],
        {
            hour:"2-digit",
            minute:"2-digit"
        }
    );



    div.innerHTML = `

        <b>
            ${mensaje.usuario}
        </b>

        <br>

        <span>
            ${mensaje.texto}
        </span>

        <small>
            ${hora}
        </small>

    `;



    messagesContainer.appendChild(
        div
    );



    messagesContainer.scrollTop =
    messagesContainer.scrollHeight;


}
// =====================================
// ENVIAR MENSAJE
// =====================================


function enviarMensaje(){


    const texto =
    messageInput.value.trim();



    if(texto === ""){

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



// =====================================
// BOTÓN ENVIAR
// =====================================


if(sendMessage){


    sendMessage.addEventListener(
        "click",
        enviarMensaje
    );


}



// =====================================
// ENTER PARA ENVIAR
// =====================================


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




// =====================================
// USUARIOS CONECTADOS
// =====================================


socket.on(
    "listaUsuarios",
    (usuarios)=>{


        if(listaUsuarios){


            listaUsuarios.innerHTML = "";


        }



        let cantidad = 0;



        usuarios.forEach(
            (user)=>{


                cantidad++;



                if(
                    user.id === usuario.id
                ){

                    return;

                }



                const div =
                document.createElement(
                    "div"
                );



                div.className =
                "usuarioItem";



                div.innerHTML = `

                    🟢 ${user.nombre}

                `;



                if(listaUsuarios){

                    listaUsuarios.appendChild(
                        div
                    );

                }



            }
        );



        if(cantidadUsuarios){

            cantidadUsuarios.textContent =
            cantidad;

        }



        if(usuariosOnline){

            usuariosOnline.textContent =
            cantidad + " usuarios conectados";

        }


    }
);



// =====================================
// CERRAR SESIÓN
// =====================================


if(logoutBtn){


    logoutBtn.addEventListener(
        "click",
        ()=>{


            const confirmar =
            confirm(
                "¿Deseas cerrar sesión?"
            );



            if(!confirmar){

                return;

            }



            localStorage.removeItem(
                "usuario"
            );



            window.location.href =
            "/index.html";


        }
    );


}