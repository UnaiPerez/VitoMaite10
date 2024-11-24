document.addEventListener('DOMContentLoaded', () => {
    let db; // Variable para la base de datos

    // Inicializar la base de datos
    function initDB() {
        let request = indexedDB.open('vitomaite10', 1);

        request.onsuccess = function (event) {
            db = event.target.result;
            console.log('Base de datos abierta con éxito.');
        };

        request.onerror = function (event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode);
        };
    }

    // Función para actualizar el perfil
    function actualizarPerfil() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        if (!loggedInUser) {
            alert('Error: No se encontró el usuario logueado.');
            return;
        }

        // Obtener los valores del formulario
        const ciudad = document.getElementById('city').value.trim();
        const archivoImagen = document.getElementById('imagen').files[0];

        if (!ciudad && !archivoImagen) {
            alert('Por favor, selecciona una ciudad o una imagen para actualizar.');
            return;
        }

        if (archivoImagen) {
            // Convertir la imagen a Base64
            const reader = new FileReader();
            reader.readAsDataURL(archivoImagen);

            reader.onload = function () {
                const imagenBase64 = reader.result; // Imagen en formato Base64
                actualizarDB(loggedInUser.email, ciudad, imagenBase64);
            };
        } else {
            actualizarDB(loggedInUser.email, ciudad, null); // Solo actualizar ciudad
        }
    }

    // Función para actualizar en la base de datos
    function actualizarDB(email, nuevaCiudad, nuevaFoto) {
        const transaction = db.transaction(['usuario'], 'readwrite');
        const userStore = transaction.objectStore('usuario');

        const request = userStore.get(email);

        request.onsuccess = function (event) {
            const usuario = event.target.result;

            if (!usuario) {
                alert('Error: Usuario no encontrado.');
                return;
            }

            // Actualizar los campos necesarios
            if (nuevaCiudad) {
                usuario.ciudad = nuevaCiudad;
            }
            if (nuevaFoto) {
                usuario.foto = nuevaFoto;
            }

            // Guardar los cambios
            const updateRequest = userStore.put(usuario);

            updateRequest.onsuccess = function () {
                alert('Perfil actualizado con éxito.');
                sessionStorage.setItem('loggedInUser', JSON.stringify(usuario)); // Actualizar la sesión
                window.location.href = 'pantallaLogueado.html'; // Redirigir al inicio
            };

            updateRequest.onerror = function (event) {
                console.error('Error al actualizar el perfil:', event.target.error);
                alert('Hubo un error al actualizar el perfil.');
            };
        };

        request.onerror = function (event) {
            console.error('Error al obtener el usuario:', event.target.error);
        };
    }

    // Previsualizar la imagen seleccionada o arrastrada
    function previsualizarImagen() {
        const archivo = document.getElementById('imagen').files[0];
        const previewImg = document.getElementById('preview-img');

        if (archivo) {
            const reader = new FileReader();
            reader.readAsDataURL(archivo);

            reader.onload = function (e) {
                previewImg.src = e.target.result;
            };
        }
    }

    // Función para manejar el drag-and-drop
    function configurarDragAndDrop() {
        const dropZone = document.getElementById('deposito');
        const inputImagen = document.getElementById('imagen');
        const previewImg = document.getElementById('preview-img');

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');

            const archivo = e.dataTransfer.files[0];
            if (archivo) {
                inputImagen.files = e.dataTransfer.files;

                const reader = new FileReader();
                reader.readAsDataURL(archivo);

                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                };
            }
        });
    }

    // Manejo del botón cancelar
    function cancelarEdicion() {
        window.location.href = 'pantallaLogueado.html'; // Redirigir sin guardar cambios
    }

    // Inicializar la base de datos
    initDB();

    // Vincular eventos
    document.getElementById('btn-accept').addEventListener('click', actualizarPerfil);
    document.getElementById('btn-cancel').addEventListener('click', cancelarEdicion);
    document.getElementById('imagen').addEventListener('change', previsualizarImagen);
    configurarDragAndDrop();
});
