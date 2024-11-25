/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
document.addEventListener('DOMContentLoaded', async function () {
    let resultsContainer = document.getElementById('results-container');
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        resultsContainer.textContent = 'No se ha encontrado información del usuario logueado.';
        return;
    }

    // Abrir la base de datos
    let db;
    let request = indexedDB.open('vitomaite10', 1);

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Base de datos abierta con éxito.');

        // Obtener todos los "Me gusta" del usuario logueado usando el índice emailOrigen
        let transaction = db.transaction(['meGusta'], 'readonly');
        let meGustaStore = transaction.objectStore('meGusta');
        let meGustaIndex = meGustaStore.index('emailOrigen');
        let meGustaRequest = meGustaIndex.getAll(loggedInUser.email);

        meGustaRequest.onsuccess = function (event) {
            let likes = event.target.result;

            if (likes.length === 0) {
                resultsContainer.textContent = 'No has dado "Me gusta" a ningún usuario.';
                return;
            }

            let likedUsersEmails = likes.map(like => like.emailDestino);

            // Crear una transacción para la tabla 'usuario' y buscar la información de los usuarios "liked"
            let userTransaction = db.transaction('usuario', 'readonly');
            let userStore = userTransaction.objectStore('usuario');

            likedUsersEmails.forEach(email => {
                let userRequest = userStore.get(email);
                userRequest.onsuccess = function (event) {
                    let user = event.target.result;

                    if (user) {
                        let userCard = document.createElement('div');
                        userCard.classList.add('user-card');
                        userCard.innerHTML = `
                            <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
                            <h3>${user.nombre}, ${user.edad}</h3>
                            <p>${user.ciudad}</p>
                            <a href="detalles.html?email=${encodeURIComponent(user.email)}">Ver más detalles</a>
                        `;

                        resultsContainer.appendChild(userCard);
                    }
                };

                userRequest.onerror = function () {
                    console.error(`Error al obtener información del usuario con email: ${email}`);
                };
            });
        };

        meGustaRequest.onerror = function () {
            resultsContainer.textContent = 'Error al cargar los "Me gusta".';
        };
    };

    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
        resultsContainer.textContent = 'Error abriendo la base de datos.';
    };
});