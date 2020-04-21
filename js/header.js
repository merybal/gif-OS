//Variables Globales
const logo = document.querySelector('#logo');
const botonCrearGuifos = document.querySelector('.crearGuifos');
const botonElegirTema = document.querySelector('#botonDesplegable');
const desplegable = document.querySelector('.desplegable');
const botonSailorDark = document.querySelector('#dark');
const botonSailorLight = document.querySelector('#light');
const botonMisGuifos = document.querySelector('.misGuifos');

//Refresh page con el logo 
logo.addEventListener('click', () => {
    location.href = "./index.html";
})

//Ir a Crear Guifos
botonCrearGuifos.addEventListener('click', function() {
    location.href = "./crearguifos.html";
})

//Desplegar boton "Elegir Tema"
botonElegirTema.addEventListener('click', () => {

    if (desplegable.style.display == 'flex') {
        desplegable.style.display = 'none'; 
    } else {
        desplegable.style.display = 'flex';
    }
});

//Ir a Mis Guifos
botonMisGuifos.addEventListener('click', function() {
    location.href = "./misguifos.html";
})

//Cambio de tema
botonSailorDark.addEventListener('click', () => {
    document.body.classList.add('dark-theme');
    desplegable.style.display = 'none';
    logo.setAttribute('src', './images/gifOF_logo_dark.png');
    localStorage.setItem("theme", "dark-theme");
});

botonSailorLight.addEventListener('click', () => {
    document.body.classList.remove('dark-theme');
    desplegable.style.display = 'none';
    logo.setAttribute('src', './images/gifOF_logo.png');
    localStorage.setItem("theme", "light-theme");
});

