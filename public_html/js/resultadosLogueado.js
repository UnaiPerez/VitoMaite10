/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

/*document.addEventListener('DOMContentLoaded', function () {
    let resultsContainer = document.getElementById('results-container');

    let results = JSON.parse(sessionStorage.getItem('searchResults'));

    if (!results || results.length === 0) {
        resultsContainer.textContent = 'No se encontraron resultados.';
        return;
    }

    results.forEach(user => {
        let userCard = document.createElement('div');
        userCard.classList.add('user-card');


        userCard.innerHTML = `
            <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
            <h3>${user.nombre}, ${user.edad}</h3>
            <p>${user.ciudad}</p>
            <a href="detalles.html?email=${encodeURIComponent(user.email)}">Ver más detalles</a>
        `;

        resultsContainer.appendChild(userCard);
    });
});*/
document.addEventListener('DOMContentLoaded', async function () {
    let resultsContainer = document.getElementById('results-container');
    let results = JSON.parse(sessionStorage.getItem('searchResults'));
    let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

    if (!results || results.length === 0) {
        resultsContainer.textContent = 'No se encontraron resultados.';
        return;
    }

    // Abrir la base de datos para acceder a los "Me gusta"
    let db;
    let request = indexedDB.open('vitomaite10', 1);

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Base de datos abierta con éxito.');

        // Obtener los "Me gusta" del usuario logueado
        let transaction = db.transaction(['meGusta'], 'readonly');
        let meGustaStore = transaction.objectStore('meGusta');
        let meGustaRequest = meGustaStore.getAll();

        meGustaRequest.onsuccess = function (event) {
            let likes = event.target.result;

            // Filtrar los resultados de búsqueda para eliminar los que ya tienen "Me gusta"
            let filteredResults = results.filter(user => {
                return !likes.some(like => like.emailOrigen === loggedInUser.email && like.emailDestino === user.email);
            });

            // Mostrar los resultados filtrados
            if (filteredResults.length === 0) {
                resultsContainer.textContent = 'No se encontraron resultados después del filtrado de "Me gusta".';
                return;
            }

            filteredResults.forEach(user => {
                let userCard = document.createElement('div');
                userCard.classList.add('user-card');

                userCard.innerHTML = `
                    <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
                    <h3>${user.nombre}, ${user.edad}</h3>
                    <p>${user.ciudad}</p>
                    <a href="detalles.html?email=${encodeURIComponent(user.email)}">Ver más detalles</a>
                `;

                resultsContainer.appendChild(userCard);
            });
        };

        meGustaRequest.onerror = function () {
            console.error('Error al obtener los registros de "Me gusta".');
        };
    };

    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
        alert('Hubo un problema al conectarse a la base de datos.');
    };
});

