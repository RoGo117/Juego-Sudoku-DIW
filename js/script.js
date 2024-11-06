
/*
  Page made by Rodrigo Moreno Bielsa 2ºDAW
  JS game

*/


//Asociar ids del HTML
const sudoku__container = document.getElementById("sudoku__container");
const resultado__juego = document.getElementById("resultado__juego");
const tiempo_final = document.getElementById("tiempo_final");
const timer = document.getElementById("timer");

const btn_inicio = document.getElementById("btn_inicio");
const btn_reiniciar = document.getElementById("btn_reiniciar");
const btn_volverJuego = document.getElementById("btn_volverJuego");
const btn_resolver = document.getElementById("btn_resolver");
const sudoku__tabla = document.getElementById("sudoku__tabla");

const error_incompleto = document.getElementById("error__incompleto");
const error_mal = document.getElementById("error__mal");

const info_juego =  document.getElementById("info_juego");
const nombre_jugador = document.getElementById("nombre_jugador");
const dificultad_final = document.getElementById("dificultad_final");
const menu = document.getElementById("menu");

const nombreInput = document.getElementById("nombre");
const dificultadInput = document.getElementById("dificultad");

console.log("SUDOKU RODRIGO MB")
console.log("-----------------");


/* ####################################
   ## Apartado para iniciar el juego ##
   ####################################
*/


// Función para iniciar el juego
const darValoresJuego = () => {
    console.log("Inicio del juego.");
    IniciarJuego(nombre.value, dificultad.value);
    startTimer();
};

//btn "Comenzar Juego"
btn_inicio.addEventListener("click", darValoresJuego);


//Función para cargar y mostrar el juego y los datos
const IniciarJuego = (nombre, dificultad) => {
    //Añadir en el nav del juego la información del jugador
    info_juego.textContent = "Jugador: " + nombre + " - Celdas libres iniciales: " + dificultad;
    nombre_jugador.textContent = nombre;
    dificultad_final.textContent = dificultad;

    //Mostrar y ocultar el contenido del HTML
    menu.style.display = 'none';
    sudoku__container.style.display = 'block';
    btn_resolver.style.display = 'block';

    //Iniciar otras funciones
    //Carga la tabla vacía
    cargarTabla(sudoku__tabla);
    //Rellena la tabla ( 0, 0 representa columna y fila 0,
    // la esquina superior derecha, desde donde se empezará a rellenar)
    //!cambiar nombre de la función de rellenarTabla
    rellenarTabla(sudoku__tabla, 0, 0);
    borrarCeldasRandoms(dificultad);

    console.log("Iniciar juego para " + nombre + " con " + dificultad +" celdas libres iniciales.");
};

/* #######################################
   ## Apartado para la tabla del sudoku ##
   #######################################
*/

// Función para cargar la tabla del sudoku
const cargarTabla = (tabla) => {
    //Para cada fila (i=fila)
    for (let i = 0; i < 9; i++) {
        //cada repetición del for de filas se añade una fila a la tabla
        const row = document.createElement("tr");
        //Para cada columna (j=columna)
        for (let j = 0; j < 9; j++) {
            //cada repetición del for de columnas se añade una celda a la fila
            const celda = document.createElement("td");
            //A cada celda: 
            celda.className = "sudoku_cell";
            celda.contentEditable = true;
            celda.addEventListener("input", manejarInputCelda);
            row.appendChild(celda);
        }
    //Añadir las filas a la tabla    
    tabla.appendChild(row);
    }
    estilosTabla(tabla);
    console.log("Tabla del sudoku cargada");
};


//Función para dar estilos a la tabla (diferenciar cuadros de 3x3)
const estilosTabla = (tabla) => {
    //Para cada fila (i=fila)
    for (let i = 0; i < 9; i++) {
        //Para cada columna (j=columna)
        for (let j = 0; j < 9; j++) {
            //Acceder a las celdas individualmente
            const celda = tabla.rows[i].cells[j];
            //Dar estilos a los bordes de los cuadros de 3x3
            // No se da una clase directamente porque se quitaría la clase por defecto inicial
            if ((j + 1) % 3 === 0 && j < 8) celda.style.borderRight = "3px solid #333";
            if ((i + 1) % 3 === 0 && i < 8) celda.style.borderBottom = "3px solid #333";
        }
    }
    console.log("Estilos dados a la tabla.");
};

//Función para manejar los inputs de cada celda
const manejarInputCelda = (event) => {
    //Obtiene el valor del input, el último valor de la celda
    const valorCelda = event.target.textContent.slice(-1);
    //Verifica si es un número entre el 1 y el 9
    if (valorCelda >= "1" && valorCelda <= "9") {
        //Si es valido se pone la cifra en la celda
        event.target.textContent = valorCelda;
    } else {
        // Si no es valido se borra el contenido
        event.target.textContent = "";
    }

    // Validar la celda modificada
    validarCeldas(event.target);
};


/* ######################################################
   ## Apartado para las reglas del sudoku en la tabla  ##
   ######################################################
*/


// Función para validar cada celda
const validarCeldas = (celda) => {
    const tabla = sudoku__tabla;
    const valor = celda.textContent;

    // i = nº de fila actual
    for (let i = 0; i < 9; i++) {
        //comprobar si la fila contiene la celda
        // Si la fila contiene la celda se le asigna el valor a la fila
        if (tabla.rows[i].contains(celda)) {
            row = i;
            //salir del bucle una vez se encuentre la row correcta
            break;
        }
    }

    //Hacer que sólo se busque la columna si la fila se encontró antes
    if (row !== -1) {
        //sobre cada celda de la fila encontrada
        for (let j = 0; j < tabla.rows[row].cells.length; j++) {
            //si la celda es la celda objetivo
            // se le da el valor a la columna
            if (tabla.rows[row].cells[j] === celda) {
                col = j;
                //salir del bucle una vez se encuentre la celda correcta
                break;
            }
        }
    }

    // Comprobar so es valido o no si la celda tiene contenido
    if (valor.length > 0) {
        const valido = reglasSudoku(tabla, row, col, valor);
        //Borrar el error si la casilla es valida
        if (valido) {
            celda.classList.remove("error");
        //Poner el error si la casilla no es valida
        } else {
            celda.classList.add("error");
        }
    } //Borrar el error si la casilla queda vacía
    else {
        celda.classList.remove("error");
    }
    console.log("Celda validada");
};


//Función para comprobar las reglas del sudoku de las casillas
const reglasSudoku = (tabla, row, col, value) => {
    //Primero comprobar si el valor no tiene conflicto
    if (!value) {
        return true;
    }
    //Comprobar que el valor no se repita en su fila y columna
    for (let i = 0; i < 9; i++) {
        //que no se repita la columna
        if (i !== col && tabla.rows[row].cells[i].textContent === value) {
            return false;
        }
        //que no se repita la fila
        if (i !== row && tabla.rows[i].cells[col].textContent === value) {
            return false;
        }
    }
    //Cuadros de celdas (3x3) (Los 3 del código representan el ancho o largo del cuadro)
    //Calcular la fila y columna donde empiezan los cuadros
    const cuadroIniciorow = Math.floor(row / 3) * 3;
    const cuadroInicioColumna = Math.floor(col / 3) * 3;
    //Comprobar que el valor no se repita en su cuadro 3x3
    //(i = filas) (j = columnas)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            //if para no validar la casilla del cuadro que no debe repetirse
            if (cuadroIniciorow + i !== row || cuadroInicioColumna + j !== col) {
                //que no se repita el valor en el cuadro
                if (tabla.rows[cuadroIniciorow + i].cells[cuadroInicioColumna + j].textContent === value) {
                    return false;
                }
            }
        }
    }
    return true;
};



/* ####################################################
   ## Apartado para verficiar las reglas del sudoku  ##
   ####################################################
*/

// Función para crear un array del 1 al 9 y barajarlos
const crearArrayBarajado = () => {
    let valores = [];
    for (let i = 1; i <= 9; i++) {
        //agregar los valores al array
        valores.push(i);
    }

    // Utilizar la función barajarArray para barajar los valores
    return barajarArray(valores);
};


//Función para comprobar las reglas del sudoku
const rellenarTabla = (tabla, row, col) => {
    //Revisar que todas las filas están rellenas
    if (row >= 9) {
        return true;
    }

    //Calcula cual será la proxima fila
    let nextrow = row;
    // Incrementar nextrow si col es 8
    if (col == 8) {
        nextrow++;
    }
    //Calcula cual será la proxima columna
    // Resetea la columna a 0 si es 9 (Si se alcanza el final de la fila)
    let nextCol = (col + 1) % 9;

    //Crea un array de 9 elementos
    let valoresPosibles = crearArrayBarajado();

    //For sobre cada valor posible barajado
    for (let value of valoresPosibles) {
        /*Verifica si el valor actual se puede poner en la celda siguiendo las reglas
         del sudoku (Un valor no puede repetirse en una misma fila, columna o cuadro (3x3))
        */
        if (reglasSudoku(tabla, row, col, value.toString())) {
            //Si es valido se asigna como "porDefecto"
            tabla.rows[row].cells[col].textContent = value;
            tabla.rows[row].cells[col].classList.add("porDefecto");
            //Si no se llama de nuevo a la misma función para llenar el tablero
            if (rellenarTabla(tabla, nextrow, nextCol)) {
                return true;
            }
            //Si no sirve se quitan los valores dados
            tabla.rows[row].cells[col].textContent = "";
            tabla.rows[row].cells[col].classList.remove("porDefecto");
        }
    }
    return false;
};



/* ####################################################
   ## Apartado para los espacios según la dificultad ##
   ####################################################
*/

//Función para crear espacios vacios en función a la 
//dificultad que se escoja en el menu de configuración
const borrarCeldasRandoms = (dificultad) =>  {
    console.log("Borrando celdas aleatoriamente según dificultad, dificultad elegida: " + dificultad);
    let cont = 0;

    //Se ejecuta hasta que no queden celdas que borrar
    while (dificultad > cont) {
        //Seleccionar una fila y una columna aleatoria
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        //Si la casilla no tiene contenido
        if (!sudoku__tabla.rows[row].cells[col].textContent == "") {
            //Se borra el contenido de la casilla
            //y se le quita la clase de casilla por defecto
            sudoku__tabla.rows[row].cells[col].textContent = "";
            sudoku__tabla.rows[row].cells[col].classList.remove("porDefecto");
            cont++;
        }
    }
};


/* ###############################################
   ## Apartado para barajar el array de números ##
   ###############################################
*/

//Randomizar los valores del array
//(Que no aparezcan los valores en orden numérico)
const barajarArray = (array) => {
    //Crear variables para barajear
    let posicion1, posicion2, aux;

    //dar valores aleatorios a cada posicón del array
    for (let i = 0; i < array.length; i++) {
        posicion1 = Math.floor(Math.random() * array.length);
        posicion2 = Math.floor(Math.random() * array.length);

        //Para que todos los elementos tengan la oportunidad de cambiar de posición:
        // aux = a, a = b, b = aux
        aux = array[posicion1];
        array[posicion1] = array[posicion2];
        array[posicion2] = aux;
    }

    return array;
};



/* #########################################
   ## Apartado para iniciar el cronometro ##
   #########################################
*/

// Iniciar variables
let timerInterval;
let inicioTiempo;

let minutes2 = document.getElementById("minutes2");
let seconds2 = document.getElementById("seconds2");
let milliseconds2 = document.getElementById("milliseconds2");

let minutes3 = document.getElementById("minutes3");
let seconds3 = document.getElementById("seconds3");
let milliseconds3 = document.getElementById("milliseconds3");

//Función para ir actualizando el cronómetro
const cronometro = () => {
    //Crear objeto date
    const fecha_actual = new Date();
    //Diferencia del tiempo actual al inicial
    const tiempoTrancurrido = fecha_actual - inicioTiempo;
    const tiempo = new Date(tiempoTrancurrido);

    //getUTC----- saca el tiempo de Date en ese valor
    //"0" para que aparezca el 0 delante del número y .slice(-2) para
    const minutes = ("0" + tiempo.getUTCMinutes()).slice(-2);
    const seconds = ("0" + tiempo.getUTCSeconds()).slice(-2);
    const milliseconds = ("0" + Math.floor(tiempo.getUTCMilliseconds() / 10)).slice(-2);

    //Mostrar el tiempo en el cronometro
    minutes2.textContent = minutes;
    seconds2.textContent = seconds;
    milliseconds2.textContent = milliseconds;
};

//Función para iniciar el cronómetro
const startTimer = () => {
    inicioTiempo = new Date();
    timerInterval = setInterval(cronometro, 100);
    console.log("Cronometro iniciado")
};

// Asegúrate de iniciar el cronómetro en algún punto
startTimer();



/* ####################################
   ## Apartado de reiniciar el juego ##
   ####################################
*/

//Función que recarga la página
const reiniciar = () => {
    location.reload();
};

btn_reiniciar.addEventListener("click", reiniciar);
btn_volverJuego.addEventListener("click", reiniciar);


/* ##################################################
    ## Apartado de mostrar los resultados del juego ##
   ##################################################
*/

// Función para comprobar la solución antes de continuar
const comprobarSolucion = () => {
    console.log("Intento de comprobar solución")
    //Inicializar variables por defecto como true
    let completo = true;
    let valido = true;

    //Comprobar la tabla completa (i=fila, j=columna)
    // De cada fila todas las columnas
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            //cada celda individual 
            const celda = sudoku__tabla.rows[i].cells[j];
            const valor = celda.textContent;
            //Si hay celdas vacías indica que no está completo
            if (valor === "") {
                completo = false;
            }
            //Si hay celdas erroneas indica que no es valido
            //Cargamos la función para comprobar si son validas o no
            if (!reglasSudoku(sudoku__tabla, i, j, valor)) {
                valido = false;
            }
        }
    }

    //Posibles resultados al pulsar sobre le botón
    //Si la tabla no está completa:
    if (!completo) {
        error__incompleto.style.display = "block";
        error__mal.style.display = "none";
        console.log("Existencia de huecos vacios en la tabla")
    //Si hay valores erroneos en la tabla:
    } else if (!valido) {
        error__incompleto.style.display = "none";
        error__mal.style.display = "block";
        console.log("Existencia de errores en la tabla")
    //Si todo está como debe, termina le juego y cargan los resultados
    } else {
        mostrarResultados();
    }

    
};

//Función que muestra la pantalla final de resultados
const mostrarResultados = () => {
    console.log("Juego terminado");
    //Ocultar y mostrar los elementos necesarios
    error__incompleto.style.display = 'none';
    error__mal.style.display = 'none';
    sudoku__container.style.display = 'none';
    resultado__juego.style.display = 'block';
    //Mostrar tiempo final
    minutes3.textContent = minutes2.textContent;
    seconds3.textContent = seconds2.textContent;
    milliseconds3.textContent = milliseconds2.textContent;

    console.log("Tiempo final:")
    console.log(minutes2.textContent +":"+ seconds2.textContent +":"+ milliseconds2.textContent);
};

//Botón para terminar el juego
btn_resolver.addEventListener("click", comprobarSolucion);