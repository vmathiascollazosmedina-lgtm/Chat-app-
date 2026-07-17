// ===============================
// CAMBIO ENTRE LOGIN Y REGISTRO
// ===============================

const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");

const abrirRegistro = document.getElementById("abrirRegistro");
const abrirLogin = document.getElementById("abrirLogin");


// Abrir registro
abrirRegistro.addEventListener("click", () => {

    loginModal.classList.add("oculto");

    registerModal.classList.remove("oculto");

});


// Abrir login
abrirLogin.addEventListener("click", () => {

    registerModal.classList.add("oculto");

    loginModal.classList.remove("oculto");

});