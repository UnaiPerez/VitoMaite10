/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

function openDB() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open('vitomaite10', 1);
        
        request.onsuccess = function (event) {
            db = event.target.result;
            console.log('Base de datos abierta con éxito.');
            resolve(db);
        };
        
        request.onerror = function (event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode);
            alert('Hubo un problema al conectarse a la base de datos.');
            reject(event.target.errorCode);
        };
    });
}

// Función que maneja el clic en "Me gusta"
async function handleLikeButtonClick() {
    console.log("Se ha iniciado el proceso de dar 'Me gusta'.");

    // Asegurarse de que la base de datos esté abierta
    try {
        if (!db) {
            await openDB();
        }

        // Obtener el usuario logueado desde sessionStorage
        let loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
        // Obtener el usuario visitado desde sessionStorage
        let selectedUser = JSON.parse(sessionStorage.getItem('selectedUser'));

        // Validar la información de los usuarios
        if (!loggedInUser || !selectedUser) {
            console.error("No se encontró información sobre el usuario visitado o el usuario logueado.");
            alert("Hubo un error al cargar los datos. Por favor, vuelve a la página de resultados.");
            window.location.href = "resultadosLogueado.html"; // Redirigir al usuario si faltan datos
            return;
        }

        console.log("Usuario logueado:", loggedInUser);
        console.log("Usuario visitado:", selectedUser);

        let emailDestino = selectedUser.email;

        // Crear la transacción para agregar el "Me gusta"
        let transaction = db.transaction(['meGusta'], 'readwrite');
        let meGustaStore = transaction.objectStore('meGusta');

        let likeEntry = {
            emailOrigen: loggedInUser.email,  // Email del usuario que da "Me gusta"
            emailDestino: emailDestino        // Email del usuario que recibe "Me gusta"
        };

        // Intentar agregar el registro a la base de datos
        let request = meGustaStore.add(likeEntry);

        request.onsuccess = function () {
            console.log(`Registro de 'Me gusta' añadido para ${selectedUser.nombre}.`);
            alert(`Le has dado "Me gusta" a ${selectedUser.nombre}.`);
            // Redirigir al usuario a la página de resultados logueados
            window.location.href = "resultadosLogueado.html";
        };

        request.onerror = function (event) {
            if (event.target.error.name === 'ConstraintError') {
                alert('Ya le has dado "Me gusta" a este usuario.');
            } else {
                console.error('Error al registrar el "Me gusta":', event.target.error);
                alert('Hubo un problema al registrar el "Me gusta". Intenta nuevamente más tarde.');
            }
        };
    } catch (error) {
        console.error("Error durante el proceso de dar 'Me gusta':", error);
        alert("Hubo un problema al intentar dar 'Me gusta'. Intenta nuevamente más tarde.");
    }
}

// Evento `DOMContentLoaded` para configurar el botón "Me gusta"
document.addEventListener('DOMContentLoaded', async function () {
    try {
        await openDB(); // Asegurarnos de que la base de datos esté abierta

        let btnLike = document.getElementById('btn-like');
        if (btnLike) {
            console.log('Botón "Me gusta" encontrado. Añadiendo listener.');
            btnLike.addEventListener('click', handleLikeButtonClick);
        } else {
            console.error('No se encontró el botón "Me gusta".');
        }
    } catch (error) {
        console.error('Error al abrir la base de datos:', error);
    }
});