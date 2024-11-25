/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', function () {
    const detailsContainer = document.getElementById('userDetails-container');
    const params = new URLSearchParams(window.location.search);
    const emailDestino = params.get('email'); // Email del usuario a mostrar
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('Debes iniciar sesión para ver los detalles.');
        window.location.href = 'login.html';
        return;
    }

    if (!emailDestino) {
        detailsContainer.textContent = 'No se proporcionaron detalles del usuario.';
        return;
    }

    // Inicializar la base de datos y cargar detalles del usuario
    const request = indexedDB.open('vitomaite10', 1);

    request.onsuccess = function (event) {
        const db = event.target.result;

        const transaction = db.transaction(['usuario'], 'readonly');
        const userStore = transaction.objectStore('usuario');
        const userRequest = userStore.get(emailDestino);

        userRequest.onsuccess = function (event) {
            const user = event.target.result;

            if (!user) {
                detailsContainer.textContent = 'El usuario no existe.';
                return;
            }
            renderUserDetails(user);
            // Inicializar el mapa
            initMap(user.latitud, user.longitud);
        };

        userRequest.onerror = function () {
            detailsContainer.textContent = 'Error al cargar los detalles del usuario.';
        };
    };

    request.onerror = function () {
        detailsContainer.textContent = 'Error al abrir la base de datos.';
    };

    // Función para renderizar los detalles del usuario
    function renderUserDetails(user) {
        detailsContainer.innerHTML = `
            <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
            <h2>${user.nombre}</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Ciudad:</strong> ${user.ciudad}</p>
            <p><strong>Edad:</strong> ${user.edad}</p>
            <p><strong>Genero:</strong> ${user.genero}</p>
            <div id="map"></div>
        `;
    }

    // Función para inicializar el mapa
    function initMap(lat, lng) {
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat, lng },
            zoom: 14 // Nivel de zoom estándar para mostrar la ubicación
        });

        // Añadir un marcador en la posición del usuario
        new google.maps.Marker({
            position: { lat, lng },
            map,
            title: 'Ubicación del usuario'
        });
    }
});

