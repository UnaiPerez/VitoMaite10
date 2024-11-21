/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


let db;

// Abrir la base de datos
function openDB(callback) {
    const request = indexedDB.open('vitomaite10', 1);

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Base de datos abierta en eliminar aficiones.');
        callback();
    };

    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
        alert('No se pudo conectar a la base de datos.');
    };
}

// Cargar las aficiones del usuario logueado
function loadUserAficiones() {
    const emailUsuario = JSON.parse(sessionStorage.getItem('loggedInUser')).email;

    const transaction = db.transaction(['usuAfi'], 'readonly');
    const usuAfiStore = transaction.objectStore('usuAfi');

    const request = usuAfiStore.getAll();

    request.onsuccess = function (event) {
        const relaciones = event.target.result;
        const afiSelect = document.getElementById('afi-select');

        relaciones
            .filter(rel => rel.emailUsuario === emailUsuario)
            .forEach(rel => {
                const option = document.createElement('option');
                option.value = rel.idAficion;
                option.textContent = `Afición ID ${rel.idAficion}`;
                afiSelect.appendChild(option);
            });
    };

    request.onerror = function () {
        console.error('Error al cargar las aficiones del usuario.');
    };
}

// Eliminar una afición del usuario logueado
function deleteUsuAfi() {
    const emailUsuario = JSON.parse(sessionStorage.getItem('loggedInUser')).email;
    const idAficion = parseInt(document.getElementById('afi-select').value);

    const transaction = db.transaction(['usuAfi'], 'readwrite');
    const usuAfiStore = transaction.objectStore('usuAfi');

    const request = usuAfiStore.delete([emailUsuario, idAficion]);

    request.onsuccess = function () {
        alert('Afición eliminada con éxito.');
    };

    request.onerror = function (event) {
        console.error('Error al eliminar la afición:', event.target.error);
    };
}

// Inicializar
document.addEventListener('DOMContentLoaded', function () {
    openDB(() => {
        loadUserAficiones();

        const removeButton = document.getElementById('btn-remove-afi');
        removeButton.addEventListener('click', deleteUsuAfi);
    });
});
