// ==============================
// USUARIO ACTUAL
// ==============================

const usuario = JSON.parse(localStorage.getItem("usuario"));


if (!usuario) {

    window.location.href = "index.html";

}



// Mostrar usuario arriba

document.getElementById("usuarioActual").textContent =
    usuario.nombre;



// ==============================
// ELEMENTOS
// ==============================

const btnPublico = document.getElementById("btnPublico");
const btnPrivado = document.getElementById("btnPrivado");

const tituloChat = document.getElementById("tituloChat");

const mensajes = document.getElementById("mensajes");

const usuariosConectados =
    document.getElementById("usuariosConectados");

const listaUsuarios =
    document.getElementById("listaUsuarios");




// ==============================
// CAMBIAR A CHAT PUBLICO
// ==============================

btnPublico.addEventListener("click", ()=>{


    tituloChat.textContent = "Chat Público";


    usuariosConectados.classList.add("oculto");


    mensajes.innerHTML = "";


});




// ==============================
// CAMBIAR A CHAT PRIVADO
// ==============================

btnPrivado.addEventListener("click", ()=>{


    tituloChat.textContent = "Chat Privado";


    usuariosConectados.classList.remove("oculto");


    mensajes.innerHTML = "";



    cargarUsuarios();


});




// ==============================
// CARGAR USUARIOS
// ==============================

async function cargarUsuarios(){


    const respuesta = await fetch(
        "http://localhost:3000/api/users"
    );


    const usuarios = await respuesta.json();



    listaUsuarios.innerHTML = "";



    if(usuarios.length === 0){


        listaUsuarios.innerHTML =
        "<p>No hay usuarios registrados</p>";


        return;


    }




    usuarios.forEach(user=>{


        if(user.id === usuario.id){

            return;

        }



        const div = document.createElement("div");



        div.textContent =
        "🟢 " + user.nombre;



        div.onclick = ()=>{


            abrirChatPrivado(user);


        };



        listaUsuarios.appendChild(div);



    });



}



// ==============================
// ABRIR CHAT PRIVADO
// ==============================


function abrirChatPrivado(user){


    tituloChat.textContent =
    "Chat privado con " + user.nombre;


    usuariosConectados.classList.add("oculto");


    mensajes.innerHTML = "";


}
// ==============================
// ENVIAR MENSAJES CHAT PUBLICO
// ==============================

const inputMensaje = document.getElementById("mensajeInput");
const btnEnviar = document.getElementById("enviarMensaje");



function enviarMensaje(){


    const texto = inputMensaje.value.trim();


    if(texto === ""){

        return;

    }



    const mensaje = document.createElement("div");


    mensaje.style.marginBottom = "10px";


    mensaje.innerHTML = `

        <b>${usuario.nombre}:</b>

        ${texto}

    `;



    mensajes.appendChild(mensaje);



    inputMensaje.value = "";



    // bajar automáticamente

    mensajes.scrollTop = mensajes.scrollHeight;


}



// Botón enviar

btnEnviar.addEventListener("click", ()=>{


    enviarMensaje();


});




// Enter para enviar

inputMensaje.addEventListener("keydown",(e)=>{


    if(e.key === "Enter"){


        enviarMensaje();


    }


});