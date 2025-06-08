// LOGIN FORMULARIO
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const email = document.getElementById("emailLogin");
const errorEmail = document.getElementById("errorEmailLogin");
const password = document.getElementById("passwordLogin");
const errorPassword = document.getElementById("errorPasswordLogin");

// Función para enviar el login
const postLogin = () => {
    let user = {
        correo: email.value.trim().toLowerCase(),
        clave: password.value
    };

    fetch("http://localhost:3000/api/usuarios/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
        .then(res => res.json())
        .then(data => {
            if (data.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("correo", data.usuario.correo);
                localStorage.setItem("rol", data.usuario.rol);
                location.href = data.usuario.rol === "dueño" ? "admin.html" : "index.html";
            } else {
                errorPassword.textContent = "Usuario o contraseña inválidos.";
            }
        })
        .catch(error => {
            console.error("Error en login:", error);
        });
};

// Validación del login
const validacionLogin = () => {
    let valido = true;

    if (email.validity.valueMissing) {
        errorEmail.textContent = "*Campo obligatorio";
        valido = false;
    } else if (email.validity.typeMismatch) {
        errorEmail.textContent = "*Correo inválido";
        valido = false;
    } else {
        errorEmail.textContent = "";
    }

    if (password.validity.valueMissing) {
        errorPassword.textContent = "*Campo obligatorio";
        valido = false;
    } else if (password.value.length < 8 || password.value.length > 16) {
        errorPassword.textContent = "*Contraseña entre 8 y 16 caracteres";
        valido = false;
    } else {
        errorPassword.textContent = "";
    }

    return valido;
};

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validacionLogin()) {
            postLogin();
        }
    });
}

// REGISTRO FORMULARIO
// REGISTRO FORMULARIO
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let valido = true;

        let dni = document.getElementById("dni");
        let name = document.getElementById("name");
        let lastName = document.getElementById("lastName");
        let email = document.getElementById("emailRegister");
        let password = document.getElementById("passwordRegister");
        let password2 = document.getElementById("password2Register");
        let rol = document.getElementById("rol");

        let errorDni = document.getElementById("errorDni");
        let errorName = document.getElementById("errorName");
        let errorLastName = document.getElementById("errorLastName");
        let errorEmail = document.getElementById("errorEmailRegister");
        let errorPassword = document.getElementById("errorPasswordRegister");
        let errorRol = document.getElementById("errorRol");

        if (dni.validity.valueMissing) {
            errorDni.textContent = "*Campo obligatorio";
            valido = false;
        } else {
            errorDni.textContent = "";
        }

        if (name.validity.valueMissing) {
            errorName.textContent = "*Campo obligatorio";
            valido = false;
        } else {
            errorName.textContent = "";
        }

        if (lastName.validity.valueMissing) {
            errorLastName.textContent = "*Campo obligatorio";
            valido = false;
        } else {
            errorLastName.textContent = "";
        }

        if (email.validity.valueMissing || email.validity.typeMismatch) {
            errorEmail.textContent = "*Correo inválido";
            valido = false;
        } else {
            errorEmail.textContent = "";
        }

        if (password.validity.valueMissing) {
            errorPassword.textContent = "*Campo obligatorio";
            valido = false;
        } else if (password.value.length < 8 || password.value.length > 16) {
            errorPassword.textContent = "*Contraseña entre 8 y 16 caracteres";
            valido = false;
        } else if (password.value !== password2.value) {
            errorPassword.textContent = "*Las contraseñas no coinciden";
            valido = false;
        } else {
            errorPassword.textContent = "";
        }

        if (!rol.value) {
            errorRol.textContent = "*Selecciona un rol";
            valido = false;
        } else {
            errorRol.textContent = "";
        }

        if (valido) {
            let newUser = {
                dni: dni.value,
                nombre: name.value,
                apellidos: lastName.value,
                correo: email.value.trim().toLowerCase(),
                clave: password.value,
                rol: rol.value
            };

            fetch("http://localhost:3000/api/usuarios/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            })
                .then(res => res.json())
                .then(data => {
                    if (!data || data.error) {
                        mostrarModal(data?.mensaje || "Error en registro", "error", "❌ Registro fallido");
                        return;
                    }

                    mostrarModal("Usuario registrado correctamente. Inicia sesión.", "success", "✅ Registrado");
                    registerForm.classList.add("hidden");
                    loginForm.classList.remove("hidden");
                })

                .catch(error => {
                    console.error("Error en el registro:", error);
                    mostrarModal("No se pudo contactar con el servidor", "error", "❌ Error de red");
                });
        }
    });
}

