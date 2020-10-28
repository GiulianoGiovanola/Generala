let contenedorDados = document.getElementById("contenedorDados");

let estadoDelJuego = {
    dados: [],
    dadosSeleccionados: [],
    jugador: Math.floor(Math.random() * 2) + 1,
    contadorTiros: 0,
    puntajes: [[0,0,0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0,0,0]]
}

function tirarDado(){
    return Math.floor(Math.random()* 6) + 1;
}

function tirarDados(){
    if(estadoDelJuego.dadosSeleccionados.length === 0){
        estadoDelJuego.dadosSeleccionados = [0, 1, 2, 3, 4];
    }
    estadoDelJuego.dadosSeleccionados.forEach(indice => {
        estadoDelJuego.dados[indice] = tirarDado();
    });
    estadoDelJuego.dados.sort((a, b) => {return a - b; });
    estadoDelJuego.contadorTiros++;
    actualizarPantalla();
    if (estadoDelJuego.contadorTiros === 3) {
        anotarPuntos();
    }
    
}

function actualizarPantalla(){
    estadoDelJuego.dadosSeleccionados = [];
    contenedorDados.innerHTML = null;
    for(let i=0; i<5; i++){
        let dado = document.createElement("div");
        let imgdado = document.createElement("img");
        imgdado.setAttribute("src", "assets/css/img/dado_" + estadoDelJuego.dados[i] + ".png")
        imgdado.setAttribute("data-dado-index", i);
        dado.appendChild(imgdado);
        contenedorDados.appendChild(dado);

        imgdado.onclick = evt => {
            let dadoSeleccionado = parseInt(evt.target.getAttribute("data-dado-index"));
            if(estadoDelJuego.dadosSeleccionados.indexOf(dadoSeleccionado) === -1){
                estadoDelJuego.dadosSeleccionados.push(dadoSeleccionado);
                evt.target.classList.add("seleccionado");
            } else{
                estadoDelJuego.dadosSeleccionados.splice(estadoDelJuego.dadosSeleccionados.indexOf(dadoSeleccionado), 1);
                evt.target.classList.remove("seleccionado");
            }
        };
    }
    document.getElementById("turno").innerHTML = estadoDelJuego.jugador;
    document.getElementById("tiro").innerHTML = estadoDelJuego.contadorTiros;
}

function anotarPuntos(juego){
    let celda = document.querySelector("#puntajes tbody tr:nth-of-type("+ (juego + 1) +") td:nth-of-type("+ estadoDelJuego.jugador +")");
    if(!celda.classList.contains("anotado")){
        celda.classList.add("anotado");
        switch(juego){
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                estadoDelJuego.puntajes[estadoDelJuego.jugador - 1][juego] = puntos(juego + 1);
                break;
            case 6:
                estadoDelJuego.puntajes[estadoDelJuego.jugador - 1][juego] = esEscalera() ? 20 : 0;
                breakl;
            case 7:
                estadoDelJuego.puntajes[estadoDelJuego.jugador - 1][juego] = esFull() ? 30 : 0;
                break;
            case 8:
                estadoDelJuego.puntajes[estadoDelJuego.jugador - 1][juego] = esPoker() ? 40 : 0;
                break;
            case 9:
                estadoDelJuego.puntajes[estadoDelJuego.jugador - 1][juego] = esGenerala() ? 50 : 0;
                break;
            case 10:
                estadoDelJuego.puntajes[estadoDelJuego.jugador - 1][juego] = esGenerala() ? 100 : 0;
                break;
        }
        celda.innerHTML = estadoDelJuego.puntajes[estadoDelJuego.jugador - 1][juego] === 0 ? "X" : estadoDelJuego.puntajes[estadoDelJuego.jugador - 1][juego];
    }
    [1, 2, 3, 4, 5, 6].forEach(dado => { console.info (dado + "=>" + puntos(dado)); });
    console.info("Escalera => " + esEscalera());
    console.info("Full => " + esFull());
    console.info("Poker => " + esPoker());
    console.info("Generala => " + esGenerala());

    cambiarJugador();
}

function cambiarJugador(){
    estadoDelJuego.contadorTiros = 0;
    estadoDelJuego.dados = [];
    estadoDelJuego.dadosSeleccionados = [];
    estadoDelJuego.jugador = estadoDelJuego.jugador === 2 ? 1 : 2;
    contenedorDados.innerHTML = null;
    //actualizarPantalla();
}

function esEscalera(){
    return /12345|23456|13456/.test(dadosComoString())== null;
}

function esFull(){
    return /1{3}(22|33|44|55|66)|2{3}(33|44|55|66)|3{3}(44|55|66)|4{3}(55|66)|5{3}(66)|1{2}(222|333|444|555|666)|2{2}(333|444|555|666)|3{2}(444|555|666)|4{2}(555|666)|5{2}(666)/.test(dadosComoString()) !== null;
}

function esPoker(){
    return /1{4}|2{4}|3{4}|4{4}|5{4}|6{4}/.test(dadosComoString());
}

function esGenerala(){
    return /1{5}|2{5}|3{5}|4{5}|5{5}|6{5}/.test(dadosComoString());
}

function puntos(elDado){
    let puntosSumados = 0;
    estadoDelJuego.dados.forEach(dado => {
        puntos += (elDado === dado) ? elDado : 0;
    })
    return puntosSumados;
}

function dadosComoString(){
    return estadoDelJuego.dados.join('');
}