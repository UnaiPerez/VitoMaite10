
// verLikes.js
async function verMisLikes() {
    try {
        // Asegurar que la base de datos está abierta
        if (!db) {
            await openDB();
        }

        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        if (!loggedInUser) {
            alert('No se encontró información del usuario logueado.');
            return;
        }

        const transaction = db.transaction(['meGusta', 'usuario'], 'readonly');
        const meGustaStore = transaction.objectStore('meGusta');
        const usuarioStore = transaction.objectStore('usuario');

        // Obtener todos los "me gusta" hacia el usuario logueado
        const likesRequest = meGustaStore.getAll();
        likesRequest.onsuccess = function (event) {
            const allLikes = event.target.result;

            // Filtrar quiénes le dieron like al usuario logueado
            const likesRecibidos = allLikes.filter(
                like => like.emailDestino === loggedInUser.email
            );

            if (likesRecibidos.length === 0) {
                document.getElementById('likes-container').innerHTML = `<p>No tienes likes aún.</p>`;
                return;
            }

            const likesContainer = document.getElementById('likes-container');
            likesContainer.innerHTML = ''; // Limpiar la sección

            likesRecibidos.forEach(like => {
                // Verificar si hay reciprocidad
                const reciproco = allLikes.some(
                    l => l.emailOrigen === loggedInUser.email && l.emailDestino === like.emailOrigen
                );

                // Obtener la información del usuario
                const userRequest = usuarioStore.get(like.emailOrigen);
                userRequest.onsuccess = function (event) {
                    const user = event.target.result;
                    if (user) {
                        // Crear la tarjeta de usuario
                        const userCard = document.createElement('div');
                        userCard.className = 'user-card';
                        userCard.innerHTML = `
                            <img src="${user.foto}" alt="Foto de ${user.nombre}">
                            <h3>${user.nombre}, ${user.edad}</h3>
                            <p>${user.ciudad}</p>
                            ${reciproco ? '<div class="heart">❤️</div>' : ''}
                        `;
                        likesContainer.appendChild(userCard);
                    }
                };
            });
        };

        likesRequest.onerror = function () {
            alert('Hubo un problema al cargar los likes.');
        };
    } catch (error) {
        console.error('Error inesperado:', error);
        alert('Ocurrió un error al intentar cargar los likes.');
    }
}

// Iniciar la función al cargar la página
document.addEventListener('DOMContentLoaded', verMisLikes);
