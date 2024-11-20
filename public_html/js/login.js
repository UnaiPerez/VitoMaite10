/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

// Función para manejar el login
function loginUser() {
    // Obtener los valores del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Verificar que se haya ingresado información
    if (!email || !password) {
        alert('Por favor, ingresa el email y la contraseña.');
        return;
    }

    // Crear una transacción para leer la tabla "usuario"
    const transaction = db.transaction(['usuario'], 'readonly');
    const userStore = transaction.objectStore('usuario');

    // Buscar el usuario por email
    const request = userStore.get(email);

    request.onsuccess = function (event) {
        const user = event.target.result;

        // Verificar si el usuario existe
        if (!user) {
            alert('El email no está registrado.');
            return;
        }

        // Validar la contraseña
        if (user.contraseña === password) {
            alert(`¡Bienvenido, ${user.nombre}!`);
            // Guardar al usuario en la sesión (opcional)
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            // Redirigir a la pantalla de usuario logueado
            window.location.href = 'pantallaLogueado.html';
        } else {
            alert('La contraseña es incorrecta.');
        }
    };

    request.onerror = function () {
        console.error('Error al buscar el usuario.');
        alert('Hubo un error al intentar iniciar sesión.');
    };
}

