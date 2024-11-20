
// Función para manejar el registro de usuarios
function registerUser() {
    // Capturar los datos del formulario
    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    let name = document.getElementById('name').value.trim();
    let city = document.getElementById('city').value;
    let latitud = parseFloat(document.getElementById('latitud').value);
    let longitud = parseFloat(document.getElementById('longitud').value);
    let age = parseInt(document.getElementById('age').value, 10);
    let gender = document.getElementById('gender').value;
    let photoFile = document.getElementById('photo').files[0];

    // Validar datos básicos
    if (!email || !password || !name || !city || isNaN(latitud) || isNaN(longitud) || isNaN(age) || !gender || !photoFile) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Leer la foto en formato Base64
    let reader = new FileReader();
    reader.onload = function (event) {
        let photoBase64 = event.target.result;

        let user = {
            email,
            contraseña: password,
            nombre: name,
            ciudad: city,
            latitud,
            longitud,
            edad: age,
            genero: gender,
            foto: photoBase64
        };

        // Verificar y guardar el usuario en IndexedDB
        saveUserToDB(user);
    };
    reader.readAsDataURL(photoFile);
}

// Guardar usuario en IndexedDB
function saveUserToDB(user) {
    const transaction = db.transaction(['usuario'], 'readwrite');
    const userStore = transaction.objectStore('usuario');

    // Verificar si el email ya está registrado
    const request = userStore.get(user.email);
    request.onsuccess = function (event) {
        if (event.target.result) {
            alert('El correo ya está registrado. Por favor, inicia sesión.');
        } else {
            // Agregar el nuevo usuario
            const addRequest = userStore.add(user);

            addRequest.onsuccess = function () {
                alert('Usuario registrado con éxito.');
                window.location.href = 'login.html'; // Redirigir al login
            };

            addRequest.onerror = function (error) {
                console.error('Error al guardar el usuario:', error.target.error);
            };
        }
    };

    request.onerror = function (error) {
        console.error('Error al verificar el usuario:', error.target.error);
    };
}

// Inicializar la base de datos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {

    // Vincular el botón de registro
    let registerButton = document.getElementById('btn-register');
    registerButton.addEventListener('click', registerUser);
});

