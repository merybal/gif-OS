//Varables Globales
const misGuifos = document.querySelector('.recuadrosMisGuifos');

//Crear recuadro gif
const crearRecuadroMiGif = function(urlDeFondo) {
    const imagenGifSubido = `<img src="${urlDeFondo}">`;
    const divRecuadroGif = document.createElement('div');
    divRecuadroGif.classList.add('recuadroGifC');
    divRecuadroGif.innerHTML += imagenGifSubido;
    misGuifos.prepend(divRecuadroGif);
}

//Cargar todos los gifs del local storage (mis guifos)
const cargarMisGuifos = function(URLsLocalStorage) {
    let arrayURLsLocalStorage = JSON.parse(URLsLocalStorage);
    
    arrayURLsLocalStorage.forEach((url) => {
        crearRecuadroMiGif(url);
    })
}


//CUANDO ABRE LA VENTANA
window.onload = () => {
    //Recuperar tema guardado
    if (localStorage.getItem('theme') === 'dark-theme') {
        document.body.classList.add('dark-theme');
        logo.setAttribute('src', './images/gifOF_logo_dark.png');
    }

    //Recuperar gifs guardados
    if (localStorage.getItem('misGuifos') !== null) {
        let URLsLocalStorage = localStorage.getItem('misGuifos');
        cargarMisGuifos(URLsLocalStorage);
    }
}