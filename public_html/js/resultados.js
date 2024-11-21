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
        
        // Verificar si el usuario está logueado
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        const detailsLink = loggedInUser
            ? `<a href="detalles.html?email=${user.email}">Ver más detalles</a>` // Link a detalles
            : `<a href="login.html">Inicia sesión para ver más detalles</a>`; // Link al login

        userCard.innerHTML = `
            <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
            <h3>${user.nombre}, ${user.edad}</h3>
            <p>${user.ciudad}</p>
            ${detailsLink}
        `;

        resultsContainer.appendChild(userCard);
    });
});
