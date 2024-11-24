// Obtener referencias a los elementos del DOM
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const previewImg = document.getElementById("preview-img");

// Función para mostrar la imagen cargada
function displayImage(file) {
    const reader = new FileReader();
    reader.onload = () => {
        previewImg.src = reader.result;
        previewImg.hidden = false;
    };
    reader.readAsDataURL(file);
}

// Detectar arrastre y soltar en el área de drop
dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = "#e8f4ff";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.backgroundColor = "#f0f8ff";
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = "#f0f8ff";
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
        displayImage(file);
    } else {
        alert("Por favor, selecciona un archivo de imagen válido.");
    }
});

// Detectar clic en el área de drop y abrir el selector de archivos
dropArea.addEventListener("click", () => fileInput.click());

// Mostrar la imagen seleccionada con el input de archivo
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
        displayImage(file);
    } else {
        alert("Por favor, selecciona un archivo de imagen válido.");
    }
});

// Manejar envío del formulario
document.getElementById("profile-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const city = document.getElementById("city").value;

    if (!city) {
        alert("Por favor, selecciona una ciudad.");
        return;
    }

    alert("Perfil actualizado con éxito.");
    // Aquí puedes agregar lógica para enviar los datos al servidor.
});