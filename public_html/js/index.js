let db;

function initDB() {
    const request = indexedDB.open('vitomaite10', 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;

        if (!db.objectStoreNames.contains('usuario')) {
            const userStore = db.createObjectStore('usuario', { keyPath: 'email' });
            console.log('Tabla "usuario" creada.');
        }
        
        const usuarios = [
        {
            email: 'juan1234@gmail.com',
            contraseña: 'juan1234',
            nombre: 'Juan',
            ciudad: 'Vitoria',
            edad: 28,
            genero: 'M',
            latitud: 42.8380031,
            longitud: -2.6760067,
            foto: 'images/perfilHombre.png'
        },
        {
            email: 'laura1234@gmail.com',
            contraseña: '1234',
            nombre: 'Laura',
            ciudad: 'Vitoria',
            edad: 34,
            genero: 'F',
            latitud: 42.8391109,
            longitud: -2.6746331,
            foto: 'images/perfilMujer.png'
        },
        {
            email: 'unai@gmail.com',
            contraseña: 'unai',
            nombre: 'Unai',
            ciudad: 'Vitoria',
            edad: 20,
            genero: 'M',
            latitud: 42.8482362,
            longitud: -2.6691077,
            foto: 'images/perfilHombre.png'
        },
        {
            email: 'natalia@gmail.com',
            contraseña: '1234',
            nombre: 'Natalia',
            ciudad: 'Bilbao',
            edad: 41,
            genero: 'F',
            latitud: 43.2565746,
            longitud: -2.9225389,
            foto: 'images/perfilMujer.png'
        },
        {
            email: 'ibai@gmail.com',
            contraseña: '1234',
            nombre: 'Ibai',
            ciudad: 'Donostia',
            edad: 22,
            genero: 'M',
            latitud: 43.3035169,
            longitud: -1.9952225,
            foto: 'images/perfilHombre.png'
        }
        
    ];

    usuarios.forEach(user => {
        addUser(user);
    });
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log('Base de datos abierta con éxito.');
    };

    request.onerror = function (event) {
        console.error('Error al abrir la base de datos:', event.target.errorCode);
    };
}

function addUser(user) {
    const transaction = db.transaction(['usuario'], 'readwrite');
    const userStore = transaction.objectStore('usuario');

    const request = userStore.add(user);

    request.onsuccess = function () {
        console.log(`Usuario ${user.email} añadido con éxito.`);
    };

    request.onerror = function (event) {
        console.error(`Error al añadir usuario ${user.email}:`, event.target.error);
    };
}


// Inicializamos la base de datos
initDB();
