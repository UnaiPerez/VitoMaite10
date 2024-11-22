/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

document.addEventListener('DOMContentLoaded', function(){
    let detailsContainer = document.getElementById("userDetails-container");
    
    let parametros = new URLSearchParams(window.location.search);
    let email = parametros.get('email');
    
    if(!email) {
        detailsContainer.textContent = 'No se han dado datos del usuario';
        return;
    }


let request = indexedDB.open('vitomaite10',1);

request.onsuccess = function(e){
    let db = e.target.result;
    
    let transaction = db.transaction(['usuario'],'readonly');
    let userStore = transaction.objectStore('usuario');
    
    let userRequest = userStore.get(email);
    userRequest.onsuccess = function(e){
        let user = e.target.result;
        
        if(!user){
            detailsContainer.textContent = 'El usuario no existe';
            return;
        }
        
        detailsContainer.innerHTML = `
            <img src="${user.foto}" alt="Foto de ${user.nombre}" class="user-photo">
            <h2>${user.nombre}</h2>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Ciudad:</strong> ${user.ciudad}</p>
            <p><strong>Edad:</strong> ${user.edad}</p>
            <p><strong>Género:</strong> ${user.genero}</p>
            <p><strong>Latitud:</strong>${user.latitud}</p>
            <p><strong>Longitud:</strong>${user.longitud}</p>
        `;
    };
    
    userRequest.onerror = function(){
        detailsCotantainer = 'Error obteniendo mas detalles del usuario';
    };
  };
  
  request.onerror = function(){
      detailsContainer.textContent = 'Error abriendo la base de datos';
  };
  
});
