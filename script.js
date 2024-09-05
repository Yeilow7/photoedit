const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const uploadInput = document.getElementById('upload');
const transformBtn = document.getElementById('transformBtn');
const downloadBtn = document.getElementById('downloadBtn');
const filtersModal = document.getElementById('filtersModal');
const transformModal = document.getElementById('transformModal');
const cornerModal = document.getElementById('cornerModal');
const closeModal = document.getElementsByClassName('close');
const cornerRadiusInput = document.getElementById('cornerRadius');
const applyCornersBtn = document.getElementById('applyCorners');
const applyFiltersBtn = document.getElementById('applyFilters');
const applyTransformBtn = document.getElementById('applyTransform');

let image = new Image();
let originalImage = null;
let currentFilter = 'none';
let tempFilter = 'none';
let isFlippedVertically = false;
let tempFlipVertically = false;
let isFlippedHorizontally = false;
let tempFlipHorizontally = false;
let cornerRadius = 0;
let tempCornerRadius = 0;

// Cargar y mostrar la imagen
uploadInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
        image.src = event.target.result;
        image.onload = function () {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            originalImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
            applyTransformations(); // Apply after image load
        };
    };
    reader.readAsDataURL(file);
});

// Aplicar todas las transformaciones acumuladas
function applyTransformations() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Aplicar voltear
    if (isFlippedVertically) {
        ctx.scale(1, -1);
        ctx.translate(0, -canvas.height);
    }

    if (isFlippedHorizontally) {
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
    }

    // Aplicar filtro
    ctx.filter = currentFilter;

    // Aplicar esquinas redondeadas
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, cornerRadius);
    ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, cornerRadius);
    ctx.arcTo(0, canvas.height, 0, 0, cornerRadius);
    ctx.arcTo(0, 0, canvas.width, 0, cornerRadius);
    ctx.clip();

    // Dibujar la imagen
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// Aplicar los cambios temporalmente sin confirmar
function applyTemporaryTransformations() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Aplicar voltear temporalmente
    if (tempFlipVertically) {
        ctx.scale(1, -1);
        ctx.translate(0, -canvas.height);
    }

    if (tempFlipHorizontally) {
        ctx.scale(-1, 1);
        ctx.translate(-canvas.width, 0);
    }

    // Aplicar filtro temporalmente
    ctx.filter = tempFilter;

    // Aplicar esquinas redondeadas temporalmente
    ctx.beginPath();
    ctx.moveTo(tempCornerRadius, 0);
    ctx.arcTo(canvas.width, 0, canvas.width, canvas.height, tempCornerRadius);
    ctx.arcTo(canvas.width, canvas.height, 0, canvas.height, tempCornerRadius);
    ctx.arcTo(0, canvas.height, 0, 0, tempCornerRadius);
    ctx.arcTo(0, 0, canvas.width, 0, tempCornerRadius);
    ctx.clip();

    // Dibujar la imagen
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    ctx.restore();
}

// Mostrar modales
transformBtn.addEventListener('click', () => {
    transformModal.style.display = 'block';
});

document.getElementById('filtersBtn').addEventListener('click', () => {
    filtersModal.style.display = 'block';
});

document.getElementById('cornerBtn').addEventListener('click', () => {
    cornerModal.style.display = 'block';
});

// Cerrar modales
Array.from(closeModal).forEach((element) => {
    element.addEventListener('click', () => {
        filtersModal.style.display = 'none';
        cornerModal.style.display = 'none';
        transformModal.style.display = 'none';
    });
});

// Aplicar filtros en tiempo real
document.getElementById('grayscale').addEventListener('click', () => {
    tempFilter = 'grayscale(100%)';
    applyTemporaryTransformations();
});

document.getElementById('blackwhite').addEventListener('click', () => {
    tempFilter = 'contrast(200%) brightness(150%) grayscale(100%)';
    applyTemporaryTransformations();
});

document.getElementById('sharpen').addEventListener('click', () => {
    tempFilter = 'contrast(150%)';
    applyTemporaryTransformations();
});

document.getElementById('invert').addEventListener('click', () => {
    tempFilter = 'invert(100%)';
    applyTemporaryTransformations();
});

document.getElementById('vintage').addEventListener('click', () => {
    tempFilter = 'sepia(100%)';
    applyTemporaryTransformations();
});

document.getElementById('polaroid').addEventListener('click', () => {
    tempFilter = 'contrast(120%) sepia(60%) saturate(150%)';
    applyTemporaryTransformations();
});

document.getElementById('kodachrome').addEventListener('click', () => {
    tempFilter = 'contrast(180%) saturate(120%)';
    applyTemporaryTransformations();
});

// Confirmar filtros
applyFiltersBtn.addEventListener('click', () => {
    currentFilter = tempFilter;
    applyTransformations();
    filtersModal.style.display = 'none';
});

// Aplicar esquinas redondeadas en tiempo real
cornerRadiusInput.addEventListener('input', () => {
    tempCornerRadius = cornerRadiusInput.value;
    applyTemporaryTransformations();
});

// Confirmar esquinas
applyCornersBtn.addEventListener('click', () => {
    cornerRadius = tempCornerRadius;
    applyTransformations();
    cornerModal.style.display = 'none';
});

// Aplicar transformación (voltear) en tiempo real
document.getElementById('flipVertical').addEventListener('click', () => {
    tempFlipVertically = !tempFlipVertically;
    applyTemporaryTransformations();
});

document.getElementById('flipHorizontal').addEventListener('click', () => {
    tempFlipHorizontally = !tempFlipHorizontally;
    applyTemporaryTransformations();
});

// Confirmar transformaciones
applyTransformBtn.addEventListener('click', () => {
    isFlippedVertically = tempFlipVertically;
    isFlippedHorizontally = tempFlipHorizontally;
    applyTransformations();
    transformModal.style.display = 'none';
});

// Descargar la imagen editada
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'edited-image.png';
    link.href = canvas.toDataURL();
    link.click();
});
