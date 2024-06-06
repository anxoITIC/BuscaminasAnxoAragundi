let x = 0; // Files del taulell
let y = 0; // Columnes del taulell
let acabado = false; // Es posa a true quan el jugador guanya/perd

/* Funció que demana 2 números per prompt (files, columnes)
   i crea el taulell, les mines i el càlcul de mines adjacents */
function iniciarPartida() {
    x = parseInt(prompt("Número de files: (10/30)"));
    y = parseInt(prompt("Número de columnes: (10/30)"));

    // Comprovació dimensions del taulell
    x = checkNumero(x);
    y = checkNumero(y);

    // Creació del taulell
    crearTaulell();

    //Creació de mines
    setMines();

    //Càlcul de mines adjacents
    calculaAdjacents();

    acabado = false;
}

/* Funció que comprova si el número de files/columnes
   és menor que 10 o major que 30 */
function checkNumero(num) {
    if (num < 10) return num = 10;
    if (num > 30) return num = 30;
    return num;
}


/* Funció que rep unes coordenades i mostra
   el número de mines adjacents en aquella posició.
   Si és una mina, mostra una imatge d'una mina i s'acaba el joc */
function obreCasella(i, j) {
    if (acabado) return;
    let casilla = getCasilla(i, j);
    if (esMina(casilla)) {
        acabado = true;
        mostrarMines();
        alert("Has perdut");
        return; // Acaba la partida
    } else {
        if (casilla.getAttribute("data-num-mines") == "0") mostrarCasellesZero(i, j);
        casilla.innerHTML = casilla.getAttribute("data-num-mines");
        if (checkVictoria()) {
            acabado = true;
            mostrarMines();
            alert("Has guanyat");
            return; // Acaba la partida
        }
    }
}

/* Getter de casella */
function getCasilla(i, j) {
    return document.getElementById(`${i}_${j}`);
}

/* Funció que recorre el taulell de buscamines
   i posa una mina en una casella amb un 17% de probabilitats */
function setMines() {
    let num_mines = Math.round((x * y) * 0.17); // nombre de mines = 17%(files * columnes)
    while (num_mines > 0) {
        let i = Math.floor(Math.random() * x) + 1; // Coordenada x aleatòria
        let j = Math.floor(Math.random() * y) + 1; // Coordenada y aleatòria
        let casilla = getCasilla(i, j);
        if (casilla == null || esMina(casilla)) continue;
        casilla.setAttribute("data-mina", "true");
        num_mines--;
    }
}

/* Funció que crea el taulell de buscamines
   segons les files i columnes donades anteriorment */
   function crearTaulell() {
    let divTaulell = document.getElementById("taulell");
    let taulell = "<table>";
    for (let i = 1; i <= x; i++) {
        taulell += "<tr>"
        for (let j = 1; j <= y; j++) {
            taulell += `<td id="${i}_${j}" data-mina="false">`;
            taulell += `<img src="img_pescamines/fons20px.jpg" onclick="obreCasella(${i}, ${j})" oncontextmenu="setBandera(${i}, ${j})">`;
            taulell += "</td>";
        }
        taulell += "</tr>";
    }
    taulell += "</table>";
    divTaulell.innerHTML = taulell;
}






/* Funció que recorre el taulell de buscamines
   i en cada casella emmagatzema el número de mines adjacents
   en un atribut 'data-mina' */
function calculaAdjacents() {
    // Bucles for per recórrer el taulell
    for (let i = 1; i <= x; i++) {
        for (let j = 1; j <= y; j++) {
            let casilla = getCasilla(i, j);
            let adjacents = 0;
            // Bucles for per recórrer les caselles adjacents
            for (let k = i-1; k <= i+1; k++) {
                for (let l = j-1; l <= j+1; l++) {
                    let casellaAdjacent = getCasilla(k, l);
                    if (casellaAdjacent == null) continue;
                    if (casellaAdjacent.getAttribute("data-mina") == "true") adjacents++;
                }
            }
            casilla.setAttribute("data-num-mines", adjacents);
        }
    }
}





/* Funció que rep les coordenades d'una casella amb 0 mines adjacents
   i mostra totes les caselles adjacents a aquesta.
   Si una d'aquestes caselles té 0 mines adjacents, farà el mateix de forma recursiva */
function mostrarCasellesZero(i, j) {
    // Bucles for per recórrer les caselles adjacents
    for (let k = i-1; k <= i+1; k++) {
        for (let l = j-1; l <= j+1; l++) {
            let casilla = getCasilla(k, l);
            if (casilla != null) {
                let num_mines = casilla.getAttribute("data-num-mines");
                if (casilla.innerHTML != num_mines) {
                    casilla.innerHTML = num_mines;
                    if (num_mines == 0) mostrarCasellesZero(k, l); 
                }
            }
        }
    }
}
/* Funció que rep les coordenades
   i comprova si la casella d'aquella posició és una mina */
   function esMina(casilla) {
    if (casilla.getAttribute("data-mina") == "true") return true;
    return false;
}
/* Funció que rep les coordenades
   i posa una bandera en aquella casella */
function setBandera(i, j) {
    if (acabado) return;
    let casilla = getCasilla(i, j);
    casilla.innerHTML = `<img src="img_pescamines/bandera20px.jpg" onclick="unsetBandera(${i}, ${j})">`;
}

/* Funció que rep les coordenades
   i elimina la bandera de la casella */
function unsetBandera(i, j) {
    if (acabado) return;
    let casilla = getCasilla(i, j);
    casilla.innerHTML = `<img src="img_pescamines/fons20px.jpg" onclick="obreCasella(${i}, ${j})" oncontextmenu="setBandera(${i}, ${j})">`
}






/* Funció que comprova si totes les caselles que no són mines
   estan descobertes */
function checkVictoria() {
    // Bucles for per recórrer el taulell
    for (let i = 1; i <= x; i++) {
        for (let j = 1; j <= y; j++) {
            let casilla = getCasilla(i, j);
            let num_mines = casilla.getAttribute("data-num-mines");
            if (esMina(casilla)) continue;
            if (casilla.innerHTML != num_mines) return false;
        }
    }
    return true;
}

/* Funció que mostra totes les mines del taulell */
function mostrarMines() {
    for (let i = 1; i <= x; i++) {
        for (let j = 1; j <= y; j++) {
            let casilla = getCasilla(i, j);
            if (esMina(casilla)) casilla.innerHTML = "<img src= img_pescamines/mina20px.jpg>";
        }
    }
}
