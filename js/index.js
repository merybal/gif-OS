//Variables Globales
const contenedorResultados = document.querySelector('#contenedorResultadosDeBusqueda');
const apikey = '3cNUhVwjkf5KOHMMLTI8rqkZRY5ZNBjW';
const contenedorBusqueda = document.querySelector('.contenedorBusqueda')
const inputBusqueda = document.querySelector('#barraBusqueda');
const botonBusqueda = document.querySelector('#botonBusqueda');
const lupa = document.querySelector('#lupa')
const botonBusquedaDesplegado = document.querySelector('#desplegableBusqueda');
const botonesPalabrasSimilares = document.querySelectorAll('.botonF');
const botonVerMas = document.querySelectorAll('.botonE');
const divsGifsA = document.querySelectorAll('.recuadroGifA');
const divsGifsB = document.querySelectorAll('.recuadroGifB');
const contenedorTendencias = document.querySelector('#tendencias');
const historial = document.querySelector('#historial');
let busquedasGuardadas = [];

//fetch autofill de palabras similares con lo escrito
let buscarPalabrasSimilares = async function(keyword) {
    let url = `https://api.giphy.com/v1/tags/related/${keyword}?api_key=${apikey}`;
    const resp = await fetch(url);
    const datos = await resp.json();
    return datos;
}

//Mostrar palabras similares  
const mostrarPalabrasSimilares = function(palabrasArray) {
    let palabrasSimilares = palabrasArray.slice(0, 3);
    i = 0;
    palabrasSimilares.forEach( function(palabra) {
        const palabraSimilar = palabra.name;
        botonesPalabrasSimilares[i].innerHTML = palabraSimilar;
        i += 1;
    })
}

//Habilitar boton de busqueda y cambiar estilos
inputBusqueda.addEventListener('keyup', (event) => {
    var inputValor = inputBusqueda.value;
    if (event.keyCode == 13) {
        return;
    }
    if (inputValor != '') {
        botonBusqueda.removeAttribute('disabled');
        botonBusqueda.classList.add('habilitado');
        
        if (document.body.classList.contains("dark-theme") == true) {
            if (lupa.getAttribute('src') != './images/lupa_light.svg'){
                lupa.setAttribute('src', './images/lupa_light.svg');
            }
        } else {
            if (lupa.getAttribute('src') != './images/lupa.svg'){
                lupa.setAttribute('src', './images/lupa.svg');
            }
        }

        if (inputValor.length >= 3) {
            buscarPalabrasSimilares(inputValor).then(resp => {
                mostrarPalabrasSimilares(resp.data);
            })
            botonBusquedaDesplegado.style.display = 'flex';
        } else {
            botonBusquedaDesplegado.style.display = 'none';
            botonesPalabrasSimilares.forEach( function(boton) {
                boton.innerHTML = '';
            })
        }

    } else {
        botonBusqueda.setAttribute('disabled', true);
        botonBusqueda.classList.remove('habilitado');
        if (lupa.getAttribute('src') != './images/lupa_inactive.svg') {
            lupa.setAttribute('src', './images/lupa_inactive.svg')
        }
        botonBusquedaDesplegado.style.display = 'none';
    }
});

//BUSQUEDA DE GIFS

//fetch gifs
let buscarGifs = async function(keyword) {
    let url = `https://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${apikey}&limit=24`;
    const resp = await fetch(url);
    const datos = await resp.json();
    return datos;
};

//crear .h3
const crearTitulo = function(texto, ubicacion) {
    const tituloBusqueda = `
    <h3>${texto}:</h3>
    
    `
    const divTitulo = document.createElement('div');
    divTitulo.classList.add('h3');
    divTitulo.innerHTML += tituloBusqueda;
    ubicacion.append(divTitulo);
}

//crear div resultados
const crearDivResultados = function() {
    const divResultados = document.createElement('div');
    divResultados.setAttribute("id", "resultados");
    contenedorResultados.append(divResultados);
}

const rellenarTitulo = function(gif, ubicacion) {
    let palabrasTitulo = gif.title;
    let arrayPalabrasTitulo = palabrasTitulo.split(' ');
    let indiceGIF = arrayPalabrasTitulo.indexOf('GIF');
    arrayPalabrasTitulo.splice(indiceGIF, 1);
    let titulo = ubicacion.querySelector('h2');
    for (let i = 0; i < arrayPalabrasTitulo.length && i < 4; i++) {
        titulo.innerHTML += `#${arrayPalabrasTitulo[i]}`;
        titulo.innerHTML += ` `
    }
}

//mostrar resultados
const mostrarResultados = function(gifsArray, keyword) {
    let resultados = document.querySelector('#resultados');
    if (gifsArray.length < 1) {
        const ningunResultado = 'Oops!! No se encontraron resultados =(';
        const parrafo = document.createElement('p');
        parrafo.innerHTML = ningunResultado;
        resultados.append(parrafo);
    } else {
        busquedasGuardadas.push(keyword);
        let stringBusquedasGuardadas = JSON.stringify(busquedasGuardadas);
        localStorage.setItem('historial', stringBusquedasGuardadas);
        crearBotonHistorial(keyword);

        gifsArray.forEach( function(gif) { //gifs siendo el objeto
            const recuadroGif = `
            <div class="recuadroGifB recuadroBusqueda">
                <div class="gifs">
                    <img src="${gif.images.original.url}">
                </div>
                <div class="barraAzul hashtags">
                    <h2></h2>
                </div>
            </div>
                            `;
                        
            const divRecuadroGif = document.createElement('div');
            divRecuadroGif.innerHTML += recuadroGif;
            divRecuadroGif.addEventListener('click', () => {
                busquedaGifResultados(divRecuadroGif, '.hashtags');
            })

            resultados.append(divRecuadroGif);
            rellenarTitulo(gif,divRecuadroGif);
        })
    }
};


//Busqueda con palabras similares
botonesPalabrasSimilares.forEach( function(boton) {
    boton.addEventListener('click', () => {
        let valorBoton = boton.innerHTML;
        contenedorResultados.innerHTML = '';
        crearTitulo(valorBoton, contenedorResultados);
        crearDivResultados();
        buscarGifs(valorBoton).then (resp => {
            mostrarResultados(resp.data, valorBoton);
        })
        botonBusquedaDesplegado.style.display = 'none';
        contenedorResultados.style.display = 'block';
        resultados.style.display = 'flex';
    })
})


//Evento Submit de Busqueda
const formulario = document.forms.buscador;

formulario.addEventListener('submit', function(event) {
    event.preventDefault();
    let inputValor = inputBusqueda.value;
    contenedorResultados.innerHTML = '';
    crearTitulo(inputValor, contenedorResultados);
    crearDivResultados();
    buscarGifs(inputValor).then (resp => {
        mostrarResultados(resp.data, inputValor);
    })
    inputBusqueda.value = '';
    botonBusquedaDesplegado.style.display = 'none';
    contenedorResultados.style.display = 'block';
    resultados.style.display = 'flex';
})

// funcion Busqueda tomando el titulo del gif como argumento de busqueda
const busquedaGifResultados = function(ubicacionPadre, ubicacionHija) {
    let h2 = ubicacionPadre.querySelector(`${ubicacionHija} h2`);
    let h2Texto = h2.innerHTML;
    let h2Array = h2Texto.split('#');
    let h2TextoNuevo = h2Array.join(' ');
    let keyword = h2TextoNuevo.slice(1,-1);
    contenedorResultados.innerHTML = '';
    crearTitulo(h2TextoNuevo, contenedorResultados);
    crearDivResultados();
    buscarGifs(h2TextoNuevo).then(resp => {
        mostrarResultados(resp.data, keyword)
    });

    window.scrollTo(0, 0);
    contenedorResultados.style.display = 'block';
    resultados.style.display = 'flex';
}

//GIFS SUGERENCIAS
const palabrasSugerencias = ['perro', 'gato', 'marte', 'pajaro', 'hola', 
    'calor', 'dog', 'birthday', 'cumpleaños', 'sol', 'sunset', 'bugs', 'surprise', 
    'sorpresa', 'simpsons', 'harry potter', 'cake', 'sandwich', 'mano', 'gracias', 
    'thank you', 'die', 'guitarra', 'musica', 'poop', 'animal', 'pie', 'bucket', 
    'wineglass', 'copa de vino', 'mate', 'australia', 'argentina', 'cerveza', 
    'beer', 'family guy', 'casa de papel', 'avengers', 'ironman', 'captain america', 
    'murica', 'canasta', 'love', 'poodle', 'caniche', 'crab', 
    'breaking bad', 'hate', 'rubber duck', 'autocorrect', 'sailor moon', 'bitch what', 
    'katy keene', 'buffy', 'beatles', 'beetles', 'hair', 'musical', 'happy birthday', 
    'salem', '90s', 'back to the future', 'IT', 'stephen king', 'twilight', 'no'];

//Mostrar una sola sugerencia
const mostrarSugerencia = function(gif, i) {
    const sugeridos = divsGifsA[i].querySelector('.sugeridos');
    const titulo = divsGifsA[i].querySelector('.recuadro h2');
    const srcImagen = gif.images.original.url;
    const imagenDeFondo = document.createElement('img');
    imagenDeFondo.setAttribute("src", srcImagen);
    imagenDeFondo.setAttribute("class", "imagenSugeridos")
    sugeridos.append(imagenDeFondo);
    
    let palabrasTitulo = gif.title;
    let arrayPalabrasTitulo = palabrasTitulo.split(' ');
    let indiceGIF = arrayPalabrasTitulo.indexOf('GIF');
    arrayPalabrasTitulo.splice(indiceGIF, 1);
    
    for (let i = 0; i < arrayPalabrasTitulo.length && i < 4; i++) {
        titulo.innerHTML += `#${arrayPalabrasTitulo[i]}`;
        titulo.innerHTML += ` `
    }

    //Nueva busqueda cuando se apreta la cruz de sugeridos
    const cruz = divsGifsA[i].querySelector('.cruz');
    cruz.addEventListener('click', () => {
        const palabraSugeridaNueva = palabrasSugerencias[Math.floor(Math.random() * palabrasSugerencias.length)];
        buscarGifs(palabraSugeridaNueva).then(resp => { //buscar gifs con la palabra sugerida nueva
            srcImagenNueva = resp.data[0].images.original.url;
            let imagenSugeridos = sugeridos.querySelector('.imagenSugeridos');
            imagenSugeridos.removeAttribute("src");
            imagenSugeridos.setAttribute("src", srcImagenNueva);
            //reemplazar el innerHTML del h2
            let tituloNuevo = divsGifsA[i].querySelector('.recuadro h2');
            tituloNuevo.innerHTML = '';
            let palabrasTituloNuevo = resp.data[0].title;
            let arrayPalabrasTituloNuevo = palabrasTituloNuevo.split(' ');
            let indiceGIF = arrayPalabrasTituloNuevo.indexOf('GIF');
            arrayPalabrasTituloNuevo.splice(indiceGIF, 1);

            for (let i = 0; i < arrayPalabrasTituloNuevo.length && i < 4; i++) {
                tituloNuevo.innerHTML += `#${arrayPalabrasTituloNuevo[i]}`;
                tituloNuevo.innerHTML += ` `
            }
        })
    })
}

//Mostrar todas las sugerencias
const mostrarSugerencias = async function() {
    let arrayPalabrasSugeridas = [];
    for (let index = 0; index < 4; index++) {
        const palabraSugerida = palabrasSugerencias[Math.floor(Math.random() * palabrasSugerencias.length)];
        arrayPalabrasSugeridas.push(palabraSugerida);
    }
    arrayPalabrasSugeridas.forEach(async (palabra, i) => {
        const resp = await buscarGifs(palabra)
        mostrarSugerencia(resp.data[0], i, palabra);
    })
}

//funcion del boton VerMas y haciendo click sobre los gifs de Tendencias
const busquedaVerMas = function(ubicacionPadre, i, ubicacionHija) {
    let h2 = ubicacionPadre[i].querySelector(`${ubicacionHija} h2`);
    let h2Texto = h2.innerHTML;
    let h2Array = h2Texto.split('#');
    let h2TextoNuevo = h2Array.join(' ');
    let keyword = h2TextoNuevo.slice(1,-1);
    contenedorResultados.innerHTML = '';
    crearTitulo(h2TextoNuevo, contenedorResultados);
    crearDivResultados();
    buscarGifs(h2TextoNuevo).then(resp => {
        mostrarResultados(resp.data, keyword);
    });
    window.scrollTo(0, 0);
    contenedorResultados.style.display = 'block';
    resultados.style.display = 'flex';
}

//Boton Ver Mas de las Sugerencias
botonVerMas.forEach( function(boton, i) {
    boton.addEventListener('click', () => {
        busquedaVerMas(divsGifsA, i , '.recuadro');
    })
})

//GIFS DE TENDENCIAS
let traerTendencias = async function() {
    let url = 'https://api.giphy.com/v1/gifs/trending?api_key=' + apikey + '&limit=10';
    const resp = await fetch(url);
    const datos = await resp.json();
    return datos;
}

//Mostrar una tendencia
const mostrarTendencia = function(gif, i) {
    const tendencias = divsGifsB[i].querySelector('.tendencias');
    const titulo = divsGifsB[i].querySelector('.hashtags h2');
    const srcImagen = gif.images.original.url;
    const imagenDeFondo = document.createElement('img');
    imagenDeFondo.setAttribute("src", srcImagen);
    tendencias.append(imagenDeFondo);

    let palabrasTitulo = gif.title;
    let arrayPalabrasTitulo = palabrasTitulo.split(' ');
    let indiceGIF = arrayPalabrasTitulo.indexOf('GIF');
    arrayPalabrasTitulo.splice(indiceGIF, 1);

    for (let i = 0; i < arrayPalabrasTitulo.length && i < 4; i++) {
        titulo.innerHTML += `#${arrayPalabrasTitulo[i]}`;
        titulo.innerHTML += ` `
    }
};

//Mostrar todas las tendencias
const mostrarTendencias = async function() {
    const resp = await traerTendencias()
    resp.data.forEach( function (gif, i) {
        mostrarTendencia(gif, i);
    })

}

//Ver mas haciendo click en recuadroGifB Tendencias (no tiene boton)
divsGifsB.forEach( function(divGif, i) {
    divGif.addEventListener('click', () => {
        busquedaVerMas(divsGifsB, i, '.hashtags');
    })
})

//crear botones historial
const crearBotonHistorial = function(keyword) {
    const botonHTML = `
    #${keyword}
    `;
    const boton = document.createElement('button');
    boton.classList.add('botonG');
    boton.innerHTML += botonHTML;
    boton.addEventListener('click', () => {
        contenedorResultados.innerHTML = '';
        crearTitulo(keyword, contenedorResultados);
        crearDivResultados();
        buscarGifs(keyword).then (resp => {
            mostrarResultados(resp.data, keyword);
        })
        contenedorResultados.style.display = 'block';
        resultados.style.display = 'flex';
    })
    historial.prepend(boton);
}

const cargarHistorial = function(stringLocalStorage) {
    let arrayLocalStorage = JSON.parse(stringLocalStorage);
    busquedasGuardadas = busquedasGuardadas.concat(arrayLocalStorage);
    if (busquedasGuardadas.length > 15) {
        busquedasGuardadas = busquedasGuardadas.slice(-15, busquedasGuardadas.length);
    }
    busquedasGuardadas.forEach((palabraBuscada) => {
        crearBotonHistorial(palabraBuscada);
    })
}

//CUANDO ABRE LA VENTANA
window.onload = () => {
    //Recuperar tema guardado
    if (localStorage.getItem("theme") === "dark-theme") {
        document.body.classList.add('dark-theme');
        logo.setAttribute('src', './images/gifOF_logo_dark.png');
    }

    //Historial de busqueda
    if (localStorage.getItem("historial") !== null){
        let stringLocalStorage = localStorage.getItem('historial');
        cargarHistorial(stringLocalStorage);
    }

    //llamado a Mostrar sugerencias
    mostrarSugerencias();
    
    //llamado a Mostrar tendencias
    traerTendencias().then(resp => {
        mostrarTendencias(resp.data);
    })
}