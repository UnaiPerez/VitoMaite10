/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */
function iniciar(){
    var boton = document.getElementById("logout");
    boton.addEventListener("click", eliminarDatos);
}
function eliminarDatos(){
    localStorage.clear();
    window.location.href = 'sinlogin.html';
}

window.addEventListener("load", iniciar);

