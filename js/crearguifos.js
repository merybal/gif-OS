//Variables Globales
const flecha = document.querySelector('.flecha');
const logo = document.querySelector('#logo');
const camara = document.querySelector('#camara');
const contenedorCrearGuifos = document.querySelector(".contenedorCrearGuifos");
const botonComenzar = document.querySelector('#comenzar');
const botonCancelar = document.querySelector('#cancelar');
const contenedorMisGuifos = document.querySelector('.contenedorMisGuifos');
const ventanaDeCptura = document.querySelector('.ventanaDeCaptura');
const textoBarraVDC = document.querySelector('#textoBarraVDC');
const cruz = document.querySelector('#cruz');
const capturar = document.querySelector('.botonCapturar');
const grabando = document.querySelector('.grabando');
const listo = document.querySelector('.botonListo'); //stop
let liveRecorder;
const visor = document.querySelector('.visor');
const video = document.querySelector('#video');
const contenedorVistaPrevia = document.querySelector('.contenedorVistaPrevia')
const vistaPrevia = document.querySelector('.vistaPrevia');
const contenedorSubirGuifo = document.querySelector('.contenedorSubirGuifo');
const repetirCaptura = document.querySelector('#repetirCaptura');
const botonSubirGuifo = document.querySelector('#subirGuifo');
const contenedorSubiendoGuifo = document.querySelector('.contenedorSubiendoGuifo');
const botonCancelarSubida = document.querySelector('#cancelarSubida');
const apikey = '3cNUhVwjkf5KOHMMLTI8rqkZRY5ZNBjW';
let form = new FormData();
let blob;
let gifID = '';
let gifURL = '';
const contenedorSubidoExitosamente = document.querySelector('.contenedorSubidoExitosamente');
const vistaPreviaGifSubido = document.querySelector('#vistaPreviaGifSubido')
const botonCopiarEnlace = document.querySelector('#copiarEnlace');
const botonDescargarGuifo = document.querySelector('#descargarGuifo');
const cruzExito = document.querySelector('.cruzExito');
const botonListoSubido = document.querySelector('#botonListoSubido');
let URLsMisGuifos = [];


//Volver a la pagina anterior con la flecha
flecha.addEventListener('click', () => {
    window.history.back()
})

//Refresh page con el logo 
logo.addEventListener('click', () => {
    location.href = "./index.html";
})

//Habilitar camara con exito (y los settings para grabar)
let succesCallback = function(stream) {
    liveRecorder = stream; //lo que recibe del navigator.getMedia()
    video.srcObject = liveRecorder; //hace que se vea la camara
    video.play(); //reproduce la camara
    recorder = RecordRTC(liveRecorder, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
            console.log('started')
        },
    })
}

//Habilitar camara falló
let errorCallback = function(error) {
    alert('No se ha podido acceder a la cámara!');
    console.error(error);
}

//Abre la camara (pide permiso) y muestra vista previa
botonComenzar.addEventListener('click', () => {
    contenedorCrearGuifos.style.display = 'none';
    ventanaDeCptura.style.display = 'block';
    contenedorMisGuifos.style.display = 'none';
    navigator.getMedia = (  
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mediaDevices.getUserMedia
        );
    navigator.getMedia({
        audio: false,
        video: true
    }, succesCallback, errorCallback)
    contenedorMisGuifos.style.display = 'none';
})

//Cancelar y volver al home
botonCancelar.addEventListener('click', () => {
    location.href = "./index.html";
})

//Cierra grabacion y vuelve a instrucciones
cruz.addEventListener('click', () =>{
    contenedorCrearGuifos.style.display = 'block';
    ventanaDeCptura.style.display = 'none';
    contenedorMisGuifos.style.display = 'block';
    liveRecorder.getTracks().forEach( function(track) {
        track.stop();
    })
})

//Comienza a grabar
capturar.addEventListener('click', () => {
    capturar.style.display = 'none';
    grabando.style.display = 'flex';
    cruz.style.display = 'none';
    recorder.startRecording();
    textoBarraVDC.innerHTML = 'Capturando tu Guifo';

    if (contenedorSubirGuifo.style.display == 'flex') {
        contenedorSubirGuifo.style.display = 'none';
        listo.style.display = 'flex';
    }
})

//Termina de grabar y muestra vista previa
listo.addEventListener('click', ()=> {
    console.log('fin de grabacion');
    recorder.stopRecording( () => {
        blob = recorder.getBlob()
        form.append('file', blob, 'myGif.gif');
        let urlCreator = window.URL || window.webkitURL;
        let videoURL = urlCreator.createObjectURL(blob);
        vistaPrevia.setAttribute("src", videoURL);
        liveRecorder.getTracks().forEach( function(track) {
            track.stop();
        })
    })
    textoBarraVDC.innerHTML = 'Vista Previa';
    visor.style.display = 'none';
    contenedorVistaPrevia.style.display = 'flex';
    listo.style.display = 'none';
    contenedorSubirGuifo.style.display = 'flex';
});

//Cancela la grabacion y vuelve a instrucciones
repetirCaptura.addEventListener('click', () => {
    location.reload();
})

//Subir Gifs
let subirGuifo = async function() {
    let data = form;
    let url = `https://upload.giphy.com/v1/gifs?api_key=${apikey}` 
    let post = {
        method: 'post',
        body: data
    }
    let resp = await fetch(url, post);
    let datos = await resp.json();
    return datos;
}

//Trae el objeto del gif subido
let traerGuifoSubido = async function(gifID) {
    let url = `https://api.giphy.com/v1/gifs?api_key=${apikey}&ids=${gifID}`;
    let resp = await fetch(url);
    let datos = await resp.json();
    return datos;
}

//Sube el guifo a Giphy
botonSubirGuifo.addEventListener('click', () => {
    textoBarraVDC.innerHTML = 'Subiendo Guifo';
    grabando.style.display = 'none';
    contenedorVistaPrevia.style.display = 'none';
    contenedorSubiendoGuifo.style.display = 'flex';
    subirGuifo().then(resp => {
        traerGuifoSubido(resp.data.id).then(gif => {
            gifID = gif.data[0].id; //obtiene el ID del gif subido
            gifURL = gif.data[0].images.original.url; //obtiene la URL del gif subido

            //Pone en el preview
            vistaPreviaGifSubido.setAttribute('src', gifURL);

            //Agrega al local Storage
            URLsMisGuifos.push(gifURL);
            if (localStorage.getItem('misGuifos') !== null) {
                let URLsLocalStorage = localStorage.getItem('misGuifos');
                let arrayURLsLocalStorage = JSON.parse(URLsLocalStorage);
                URLsMisGuifos = arrayURLsLocalStorage.concat(URLsMisGuifos);
            }
            stringURLsMisGuifos = JSON.stringify(URLsMisGuifos);
            localStorage.setItem('misGuifos', stringURLsMisGuifos);
            crearRecuadroMiGif(gifURL);
        })
    })

    setTimeout(() => {
        contenedorMisGuifos.style.display = 'block'      
        contenedorSubidoExitosamente.style.display = "block";
        ventanaDeCptura.style.display = 'none';
    }, 2800); 
})

//Cancela la subida y vuelve a las instrucciones
botonCancelarSubida.addEventListener('click', () => {
    location.reload();
})

//Copia el link del gif
botonCopiarEnlace.addEventListener('click', ()=> {
    let textarea = document.createElement('textarea');
    textarea.value = gifURL;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
})

//Descarga del guifo
botonDescargarGuifo.addEventListener('click', () => {
    let url = `https://media.giphy.com/media/${gifID}/giphy.gif`;
    let resp = fetch(url);
    resp.then(gif => {
        return gif.blob()
    }).then(blob => {
        let urlGif = URL.createObjectURL(blob);
        let elementA = document.createElement("a");
        elementA.href = urlGif;
        elementA.download = "myGuifo.gif";
        elementA.style = 'display: "none"';
        document.body.appendChild(elementA);
        elementA.click();
        document.body.removeChild(elementA); 
    })
})

//Va a Mis Guifos
botonListoSubido.addEventListener('click', () => {
    location.href = "./misguifos.html";
})

//Va a Mis Guifos
cruzExito.addEventListener('click', () => {
    location.href = "./misguifos.html";
})

//CUANDO ABRE LA VENTANA
window.onload = () => {
    //Recuperar tema guardado
    if (localStorage.getItem("theme") === "dark-theme") {
        document.body.classList.add('dark-theme');
        logo.setAttribute('src', './images/gifOF_logo_dark.png');
    }
}