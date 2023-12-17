/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


let PROCESS = [];
let cyclesDispatcher=0;
let cyclesInterrupts=0;
let TotalEjecucion= [];


document.getElementById("processInput").addEventListener("input", function(event) {
    const inputValue = event.target.value.toUpperCase();
    const excluyentes = /^(?:[0-9TIF]+,?)+$/;
    if(inputValue[inputValue.length-2] !== "F"){
        if(!excluyentes.test(inputValue)) {
           event.target.value = inputValue.slice(0, -1);
        }

        if(inputValue[inputValue.length-1] === "T" || inputValue[inputValue.length-1] === "I"){
           event.target.value = inputValue + ",";
        }

        if(inputValue[inputValue.length-1] === "F"){
            event.target.value = inputValue
        }
        
    }else{

        event.target.value = inputValue.slice(0, -1);

    }
});



function addProcess() {
    const inputElement = document.getElementById('processInput');

    let infoProcess = inputElement.value.trim();

    if(infoProcess[infoProcess.length-1]===","){
        infoProcess = infoProcess.slice(0, -1);
    }

    let todosLosProcesos = '';

    for(let i = 0; i<PROCESS.length;i++){
        todosLosProcesos += PROCESS[i] + ",";
    }

    todosLosProcesos+= infoProcess;
    let elementos = todosLosProcesos.split(',');
    elementos = elementos.filter(elemento => !/[^\d]/.test(elemento));
    console.log(elementos);

    let conjuntoUnico = new Set(elementos);
    let formatoCorrecto = procesarinfoProcess(infoProcess);

    if (elementos.length === conjuntoUnico.size && formatoCorrecto) {
        console.log("No hay números repetidos.");
        if (infoProcess !== '') {
            PROCESS.push(infoProcess);
            inputElement.value = '';
            document.getElementById("size").textContent = PROCESS.length;
            showR();
        }
    } else {
        if(formatoCorrecto){
            alert("NO PUEDES INGRESAR DIRECCIONES REPETIDAS")
        }
    }
}

function showR() {
    const outBody = document.getElementById('outBody');
    outBody.innerHTML = '';

    for (let i = 0; i < PROCESS.length; i++) {
        const Out = procesarinfoProcess(PROCESS[i]);

        const row = document.createElement('tr');
        const cellinfoProcess = document.createElement('td');
        const cellOut = document.createElement('td');

        cellinfoProcess.textContent = "P-"+i;
        cellOut.textContent = PROCESS[i];

        row.appendChild(cellinfoProcess);
        row.appendChild(cellOut);

        outBody.appendChild(row);
    }
}

function procesarinfoProcess(infoProcess) {
    
    const excluyentes = /^([0-9TIF]+,?)+$/;

    if (infoProcess !== "" && excluyentes.test(infoProcess)) {
        return true;
    } else {
        alert("La entrada no es válida. Ingrese en el formato correcto (por ejemplo, 1,2,3,I,5,F ).");
        return false;
    }
}

function dispatcher(){

    calcularTiempoEjecucion();
    const container = document.getElementById('tablaProcesosContainer')
    if(PROCESS.length>0){
        container.classList.remove("ocultar");
    }else{
        alert("INGRESE ALGUNOS PROCESOS PRIMERO");
    }
    
    const tablaBody = document.getElementById('tablaProcesos').getElementsByTagName('tbody')[0];

        tablaBody.innerHTML = '';
        
        TotalEjecucion.forEach(proceso => {
            const fila = tablaBody.insertRow();
            const celdaProceso = fila.insertCell(0);
            const celdaTiempoEjecucion = fila.insertCell(1);
            const celdaEstadoFinal = fila.insertCell(2);

            celdaProceso.innerHTML = proceso.id;
            celdaTiempoEjecucion.innerHTML = proceso.executionTime; 
            celdaEstadoFinal.innerHTML = proceso.estadoFinal; 

            if(proceso.estadoFinal === "FINISH"){
                celdaEstadoFinal.classList.add("yellow")
            }else{
                celdaEstadoFinal.classList.add("red")
            }
        });

}

function calcularTiempoEjecucion(){

    for(let i=0; i<PROCESS.length;i++){
        let proceso = PROCESS[i];
        proceso = proceso.split(',');
        let termino = ""
         if(proceso[proceso.length - 1] === "F"){
            termino = "FINISH"
         }else{
            termino = "BLOCK"
         }
        proceso = proceso.filter(elemento => !/[^\d]/.test(elemento))
        tiempoTotal = proceso.length;

        TotalEjecucion.push({ id: "P-"+i, executionTime: tiempoTotal, estadoFinal: termino })
    }
}

 function readAndDisplayData() {
      // read window :
      cyclesDispatcher = prompt("Dispatcher Cycles:");
      cyclesInterrupts = prompt("Interrupts Cycles:");
      
      if(cyclesDispatcher<cyclesInterrupts){
        alert("LOS CICLOS DEL DISPATCHER DEBE SER MAYOR A LOS CICLOS DE INTERRUPCION")
      }else{
        document.getElementById("result").innerHTML = `
        <p>Dispatcher Cycles: ${cyclesDispatcher}</p>
        <p>Interrupts Cycles: ${cyclesInterrupts}</p>
      `;
      }
      

      // Show data
      
    }
