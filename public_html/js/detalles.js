/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', async function () {
    let detailsContainer = document.getElementById("userDetails-container");
    
    let parametros = new URLSearchParams(window.location.search);
    let email = parametros.get('email');
    
    if (!email) {
        detailsContainer.textContent = 'No se han dado datos del usuario';
        return;
    }

    // Abrir la base de datos utilizando la función compartida
    try {
        await openDB();

        let transaction = db.transaction(['usuario'], 'readonly');
        let userStore = transaction.objectStore('usuario');

        let userRequest = userStore.get(email);
        userRequest.onsuccess = function (e) {
            let user = e.target.result;

            if (!user) {
                detailsContainer.textContent = 'El usuario no existe';
                return;
            }

            // Mostrar la información del usuario en el HTML
            detailsContainer.innerHTML = `
                <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
                <h2>${user.nombre}</h2>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Ciudad:</strong> ${user.ciudad}</p>
                <p><strong>Edad:</strong> ${user.edad}</p>
                <p><strong>Género:</strong> ${user.genero}</p>
                <p><strong>Latitud:</strong>${user.latitud}</p>
                <p><strong>Longitud:</strong>${user.longitud}</p>
            `;

            // Guardar el usuario visitado en sessionStorage
            sessionStorage.setItem('selectedUser', JSON.stringify(user));
        };

        userRequest.onerror = function () {
            detailsContainer.textContent = 'Error obteniendo más detalles del usuario';
        };
    } catch (error) {
        detailsContainer.textContent = 'Error abriendo la base de datos';
    }
});