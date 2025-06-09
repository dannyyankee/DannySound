document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const resetForm = document.getElementById('resetForm');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const changePasswordEmailForm = document.getElementById('changePasswordEmailForm');

  // LOGIN
  loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('emailLogin').value.trim();
    const password = document.getElementById('passwordLogin').value;

    if (!email) return showError('errorEmailLogin', 'El correo es obligatorio');
    if (!password) return showError('errorPasswordLogin', 'La contraseña es obligatoria');

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, clave: password })
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarModal(data?.mensaje || 'Credenciales inválidas', 'error', '❌ Error de login');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        rol: data.usuario.rol.toLowerCase(),
        correo: data.usuario.correo,
        dni: data.usuario.dni
      }));
      localStorage.setItem('rol', data.usuario.rol.toLowerCase());

      mostrarModal('Inicio de sesión correcto. Redirigiendo...', 'success', '✅ Bienvenido');
      setTimeout(() => {
        const rol = data.usuario.rol.toLowerCase();
        if (rol === 'cliente') {
          window.location.href = 'alquiler.html';
        } else if (rol === 'dueño' || rol === 'admin') {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      }, 2000);
    } catch (err) {
      console.error('Error en login:', err);
      mostrarModal('No se pudo conectar al servidor', 'error', '❌ Error de red');
    }
  });

  // REGISTRO
  registerForm?.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();

    const dni = document.getElementById('dni').value.trim();
    const nombre = document.getElementById('name').value.trim();
    const apellidos = document.getElementById('lastName').value.trim();
    const correo = document.getElementById('emailRegister').value.trim();
    const clave = document.getElementById('passwordRegister').value;
    const clave2 = document.getElementById('password2Register').value;
    const rol = document.getElementById('rol').value;

    if (!dni) return showError('errorDni', 'El DNI es obligatorio');
    if (!nombre) return showError('errorName', 'El nombre es obligatorio');
    if (!apellidos) return showError('errorLastName', 'Los apellidos son obligatorios');
    if (!correo) return showError('errorEmailRegister', 'El correo es obligatorio');
    if (!clave) return showError('errorPasswordRegister', 'La contraseña es obligatoria');
    if (clave !== clave2) return showError('errorPasswordRegister', 'Las contraseñas no coinciden');
    if (!rol) return showError('errorRol', 'Selecciona un rol');

    try {
      const res = await fetch('http://localhost:3000/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dni, nombre, apellidos, correo, clave, rol })
      });

      const data = await res.json();

      if (!res.ok || data?.error) {
        mostrarModal(data?.mensaje || 'Error en el registro', 'error', '❌ Error');
        return;
      }

      mostrarModal('Registro exitoso. Ahora puedes iniciar sesión.', 'success', '✅ Registrado');
      setTimeout(() => toggleForms('loginForm'), 2500);
    } catch (err) {
      console.error('Error en registro:', err);
      mostrarModal('No se pudo conectar al servidor', 'error', '❌ Error de red');
    }
  });

  // RECUPERAR CONTRASEÑA
  resetForm?.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();

    const email = document.getElementById('resetEmail').value.trim();
    if (!email) return showError('errorResetEmail', 'El correo es obligatorio');

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email })
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarModal(data?.mensaje || 'Error al enviar correo', 'error', '❌ Recuperación fallida');
        return;
      }

      document.getElementById('modalSuccess').classList.remove('hidden');
      document.getElementById('resetEmail').value = '';
    } catch (err) {
      console.error('Error en recuperación:', err);
      mostrarModal('No se pudo contactar con el servidor', 'error', '❌ Error de red');
    }
  });

  // CAMBIO CONTRASEÑA CON TOKEN
  changePasswordForm?.addEventListener('submit', async e => {
    e.preventDefault();

    ['errorCurrentPassword', 'errorNewPassword', 'errorRepeatNewPassword'].forEach(id => {
      document.getElementById(id).textContent = '';
    });

    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const repeatNewPassword = document.getElementById('repeatNewPassword').value.trim();

    let valido = true;

    if (!currentPassword) {
      document.getElementById('errorCurrentPassword').textContent = 'Debe ingresar la contraseña actual.';
      valido = false;
    }

    if (!newPassword || newPassword.length < 8 || newPassword.length > 16) {
      document.getElementById('errorNewPassword').textContent = 'La contraseña debe tener entre 8 y 16 caracteres.';
      valido = false;
    }

    if (repeatNewPassword !== newPassword) {
      document.getElementById('errorRepeatNewPassword').textContent = 'Las contraseñas no coinciden.';
      valido = false;
    }

    if (!valido) return;

    const token = localStorage.getItem('token');
    if (!token) {
      mostrarModal('No estás autenticado. Inicia sesión primero.', 'error');
      toggleForms('loginForm');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarModal(data.mensaje || 'Error al cambiar la contraseña', 'error');
        return;
      }

      mostrarModal('Contraseña cambiada correctamente. Inicia sesión de nuevo.', 'success');
      changePasswordForm.reset();
      localStorage.clear();
      setTimeout(() => {
        toggleForms('loginForm');
        window.location.href = 'login.html';
      }, 2500);
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      mostrarModal('No se pudo conectar al servidor', 'error');
    }
  });

  // CAMBIO CONTRASEÑA SIN TOKEN
  changePasswordEmailForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const errorChangePassword = document.getElementById('errorChangePassword');
    errorChangePassword.textContent = '';

    const email = changePasswordEmailForm.email.value.trim();
    const currentPassword = changePasswordEmailForm.currentPassword.value.trim();
    const newPassword = changePasswordEmailForm.newPassword.value.trim();
    const repeatNewPassword = changePasswordEmailForm.repeatNewPassword.value.trim();

    if (!email || !currentPassword || !newPassword || !repeatNewPassword) {
      errorChangePassword.textContent = 'Por favor, rellena todos los campos.';
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 16) {
      errorChangePassword.textContent = 'La nueva contraseña debe tener entre 8 y 16 caracteres.';
      return;
    }

    if (newPassword !== repeatNewPassword) {
      errorChangePassword.textContent = 'Las nuevas contraseñas no coinciden.';
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/change-password-no-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: email, contrasenaActual: currentPassword, contrasenaNueva: newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        errorChangePassword.textContent = data.error || data.mensaje || 'Error al cambiar la contraseña.';
        return;
      }

      mostrarModal('Contraseña cambiada correctamente. Inicia sesión con la nueva.', 'success');
      changePasswordEmailForm.reset();
      toggleForms('loginForm');
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      errorChangePassword.textContent = 'Error de conexión con el servidor.';
    }
  });

  // Cierre de modal de éxito
  document.getElementById('modalCloseBtn')?.addEventListener('click', () => {
    document.getElementById('modalSuccess').classList.add('hidden');
    toggleForms('loginForm');
  });

  // Mostrar formulario de cambio sin token
  document.getElementById('showChangePasswordEmail')?.addEventListener('click', e => {
    e.preventDefault();
    toggleForms('changePasswordEmailForm');
  });

  // Volver a login desde cambio sin token
  document.getElementById('backToLoginFromChange')?.addEventListener('click', e => {
    e.preventDefault();
    toggleForms('loginForm');
  });
});

// Funciones auxiliares
function clearErrors() {
  document.querySelectorAll('p[id^="error"]').forEach(p => p.textContent = '');
}
function showError(id, message) {
  const elem = document.getElementById(id);
  if (elem) elem.textContent = message;
}
function toggleForms(form) {
  const forms = ['loginForm', 'registerForm', 'resetForm', 'changePasswordEmailForm', 'changePasswordForm'];
  forms.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.classList.add('hidden');
  });
  if (form) {
    const showForm = document.getElementById(form);
    if (showForm) showForm.classList.remove('hidden');
  }
}
function mostrarModal(mensaje, tipo = "info", titulo = "") {
  const modal = document.getElementById("notificationModal");
  const box = document.getElementById("notificationBox");
  const title = document.getElementById("notificationTitle");
  const message = document.getElementById("notificationMessage");

  box.className = "modal-box text-center";
  if (tipo === "success") box.classList.add("mod-success");
  else if (tipo === "error") box.classList.add("mod-error");
  else box.classList.add("mod-info");

  title.textContent = titulo || (tipo === "success" ? "✅ Éxito" : tipo === "error" ? "❌ Error" : "ℹ️ Información");
  message.textContent = mensaje;

  modal.classList.remove("hidden");
}

document.getElementById("notificationClose")?.addEventListener("click", () => {
  document.getElementById("notificationModal").classList.add("hidden");
});
