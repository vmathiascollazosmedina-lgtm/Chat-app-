console.log("auth.js funcionando");

const btnRegister = document.getElementById("btnRegister");
const btnLogin = document.getElementById("btnLogin");


// ============================
// REGISTRARSE
// ============================

if (btnRegister) {

    btnRegister.addEventListener("click", async () => {

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();


        if (!nombre || !correo || !password) {

            alert("Completa todos los campos");
            return;

        }


        try {
            const res = await fetch("http://localhost:3000/api/auth/register", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({

        nombre: nombre,
        correo: correo,
        password: password

    })

});


            console.log("STATUS:", res.status);

const texto = await res.text();

console.log("RESPUESTA SERVIDOR:", texto);

const data = JSON.parse(texto);


            if (data.success) {


                localStorage.setItem(
                    "usuario",
                    JSON.stringify(data.usuario)
                );


                window.location.href = "/client/chat.html";

            } else {


                alert(data.message);


            }


        } catch(error) {


            console.error(error);

            alert("Error conectando con el servidor");


        }


    });

}


// ============================
// INICIAR SESIÓN
// ============================

if (btnLogin) {


    btnLogin.addEventListener("click", async () => {


        const correo =
        document.getElementById("loginCorreo").value.trim();


        const password =
        document.getElementById("loginPassword").value.trim();



        if (!correo || !password) {

            alert("Completa todos los campos");
            return;

        }



        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {


                method:"POST",


                headers:{


                    "Content-Type":"application/json"


                },


                body:JSON.stringify({


                    correo,
                    password


                })


            });



            const data = await res.json();



            if(data.success){



                localStorage.setItem(

                    "usuario",

                    JSON.stringify(data.usuario)

                );



                window.location.href = "/client/chat.html";



            }else{


                alert(data.message);


            }



        }catch(error){



            console.error(error);


            alert("Error conectando con el servidor");


        }



    });


}