/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', function () {
    const resultsContainer = document.getElementById('results-container');

    const results = JSON.parse(sessionStorage.getItem('searchResults'));

    if (!results || results.length === 0) {
        resultsContainer.textContent = 'No se encontraron resultados.';
        return;
    }

    results.forEach(user => {
        const userCard = document.createElement('div');
        userCard.classList.add('user-card');


        userCard.innerHTML = `
            <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
            <h3>${user.nombre}, ${user.edad}</h3>
            <p>${user.ciudad}</p>
            <a href="detalles.html">Ver más detalles</a>
        `;

        resultsContainer.appendChild(userCard);
    });
});

