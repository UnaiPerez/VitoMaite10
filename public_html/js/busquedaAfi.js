/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
// script.js
let db;

// Inicializar la base de datos y cargar las aficiones
document.addEventListener('DOMContentLoaded', function () {
    initDB();

    // Esperar a que la base de datos esté lista y cargar aficiones
    setTimeout(() => {
        cargarAficiones();
    }, 500);

    // Vincular el botón de búsqueda
    const searchButton = document.getElementById('btn-search');
    if (searchButton) {
        searchButton.addEventListener('click', manejarBusquedaPorAficiones);
    }
});

// Función para cargar las aficiones en el formulario
function cargarAficiones() {
    const transaction = db.transaction(['aficion'], 'readonly');
    const aficionStore = transaction.objectStore('aficion');
    const request = aficionStore.getAll();

    request.onsuccess = function (event) {
        const aficiones = event.target.result;
        console.log('Aficiones obtenidas de la base de datos:', aficiones);

        const hobbiesSelect = document.getElementById('hobbies');

        // Limpiar opciones previas
        hobbiesSelect.innerHTML = '';

        // Añadir opciones dinámicamente
        aficiones.forEach(aficion => {
            const option = document.createElement('option');
            option.value = aficion.id; // Usar el ID como valor
            option.textContent = aficion.nombre;
            hobbiesSelect.appendChild(option);
        });
    };

    request.onerror = function (event) {
        console.error('Error cargando aficiones:', event.target.error);
    };
}


// Función para manejar la búsqueda por aficiones
function manejarBusquedaPorAficiones(event) {
    event.preventDefault();

    // Recoger las aficiones seleccionadas
    const selectedHobbies = Array.from(document.getElementById('hobbies').selectedOptions).map(opt => parseInt(opt.value));

    if (selectedHobbies.length === 0) {
        alert('Por favor, selecciona al menos una afición.');
        return;
    }

    const transaction = db.transaction(['usuario', 'usuAfi'], 'readonly');
    const userStore = transaction.objectStore('usuario');
    const userHobbyStore = transaction.objectStore('usuAfi');

    userStore.getAll().onsuccess = function (event) {
        const allUsers = event.target.result;

        // Verificar usuarios por aficiones seleccionadas
        userHobbyStore.getAll().onsuccess = function (event) {
            const userHobbies = event.target.result;

            const filteredUsers = allUsers.filter(user => {
                const userHobbyIds = userHobbies
                    .filter(uh => uh.emailUsuario === user.email)
                    .map(uh => uh.idAficion);

                // Verificar que el usuario tenga todas las aficiones seleccionadas
                return selectedHobbies.every(hobby => userHobbyIds.includes(hobby));
            });

            mostrarResultados(filteredUsers);
        };
    };
}

// Función para mostrar los resultados en pantalla
function mostrarResultados(users) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (users.length === 0) {
        resultsDiv.textContent = 'No se encontraron usuarios con las aficiones seleccionadas.';
        return;
    }

    users.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');
        userCard.innerHTML = `
            <p><strong>Nombre:</strong> ${user.nombre}</p>
            <p><strong>Edad:</strong> ${user.edad}</p>
            <p><strong>Ciudad:</strong> ${user.ciudad}</p>
        `;
        resultsDiv.appendChild(userCard);
    });
}
