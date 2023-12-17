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
    let conjuntoUnico = new Set(elementos);
    let formatoCorrecto = procesarinfoProcess(infoProcess);

    if (elementos.length === conjuntoUnico.size && formatoCorrecto) {
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
const outDistpatcher= document.getElementById("outDistpatcher")
let total = 0;

function dispatcher(){

    calcularTiempoEjecucion();
    
    localStorage.clear()
    outDistpatcher.textContent=""


    if (cyclesDispatcher <= 0 || cyclesInterrupts <= 0) {
        alert("INGRESE LOS VALORES DEL DISPATCHER");
    }

    if (PROCESS.length<=0) {
        outDistpatcher.textContent = "Enter at least one process";
    }

    if (PROCESS.length >= 0 && cyclesDispatcher > 0 && cyclesInterrupts > 0) {
        // Guardar una copia de PROCESS en PROCESSCURRENT
        PROCESSCURRENT = PROCESS.slice();
        ejecutarProcesos()
        verficiarFinishTask()
        cargarProcesosVista();
    }

        
}



function calcularTiempoEjecucion(){
    TotalEjecucion= [];
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

function ejecutarProcesos() {

    while (PROCESS.length >= 0 && PROCESS[0].length > 0) {

        for (let i = 0; i < PROCESS.length; i++) {
            let numberCyclesDispatcher = cyclesDispatcher
            const instructions = PROCESS[i].split(",");
            let nInstructions = instructions.length;
            let countInstructions = 0;
            let pdArrayString = localStorage.getItem("P-D");
            let pdArray = pdArrayString ? JSON.parse(pdArrayString) : [];
            let ArrayString = localStorage.getItem(`P-${i}`);
            let pIdArray = ArrayString ? JSON.parse(ArrayString) : [];

            if (pdArray.length > pIdArray.length) {
                for (let j = pIdArray.length; j < pdArray.length; j++) {
                    pIdArray.push("grey")


                }
            }
            let estado = false;
            for (let j = 0; j < cyclesInterrupts; j++) {
                if (instructions[j] !== "") {
                    if (instructions[j] === "I" || instructions[j] === "T") {
                        pIdArray.push("red")
                        pdArray.push("green")
                        numberCyclesDispatcher--;
                        total++;
                        countInstructions++;
                        j = cyclesInterrupts
                    } else if (instructions[j] === "F") {
                        pIdArray.push("yellow")
                        total++;
                        countInstructions++;
                        j = cyclesInterrupts
                        
                    } else if (!isNaN(instructions[j])) {
                        pIdArray.push("green")
                        pdArray.push("grey")
                        total++;
                        countInstructions++;
                    }

                    if (j === cyclesInterrupts - 1 && (j + 1) < instructions.length) {
                        let instruction = instructions[j + 1]
                        if (instruction === "I" || instruction === "T") {
                            pIdArray.push("red")
                            pdArray.push("green")
                            numberCyclesDispatcher--;
                            countInstructions++;
                            total++;
                            break;
                        } else if (instruction === "F") {
                            pIdArray.push("yellow")
                            pdArray.push("green")
                            countInstructions++;
                            numberCyclesDispatcher--;
                            total++
                            break;
                        }
                    }
                } else {
                    estado = true
                }

            }

            if (!estado) {
                PROCESS[i] = instructions.slice(countInstructions).join(",");
                for (let j = 0; j < numberCyclesDispatcher; j++) {
                    pIdArray.push("grey");
                    pdArray.push("green");
                    total++;
                }
                localStorage.setItem(`P-${i}`, JSON.stringify(pIdArray));
                localStorage.setItem("P-D", JSON.stringify(pdArray));
            }
        }
    }
}

function verficiarFinishTask() {
    for (let i = 0; i < PROCESSCURRENT.length; i++) {
        const instructions = PROCESSCURRENT[i].split(",");
        let nInstructions = instructions.length;
        let ultima = instructions[Number(nInstructions-1) ]
       
        if (ultima !== "F" && ultima !== "") {
            let ArrayString = localStorage.getItem(`P-${i}`);
            let pIdArray = ArrayString ? JSON.parse(ArrayString) : [];
            let pos = 0;
            for (let j = pIdArray.length - 1; j >= 0; j--) {
                let color = pIdArray[j]
                if (color === "grey" || color === "red") {
                    pos = j;
                    j = -1
                }
            }
            for (let j = pos + 1; j < total; j++) {
                pIdArray[j]="red"
            }
            localStorage.setItem(`P-${i}`, JSON.stringify(pIdArray));
        }
    }

}

const theadDraw=document.getElementById("theadDraw");
const tableDraw= document.getElementById("tableDraw");

function cargarProcesosVista() {
    let vista = document.getElementById("tablaProcesosSimulacion");
    vista.classList.remove("ocultar")
    let tableBody = "";
    let pdArrayString = localStorage.getItem("P-D");
    let pdArray = pdArrayString ? JSON.parse(pdArrayString) : [];

    let thead = `
    <th scope="col"></th>`
    for (let i = 1; i <= pdArray.length; i++) {
        thead += `
        <th scope="col">${i}</th>`
    }

    for (let i = 0; i < PROCESS.length; i++) {
        let ArrayString = localStorage.getItem(`P-${i}`);
        let pIdArray = ArrayString ? JSON.parse(ArrayString) : [];
        let td = ""
        let tbody = ""
        if (pIdArray != null) {
            let nPos=pIdArray.length;
            if(pIdArray.length>pdArray.length){
                nPos=pdArray.length
            }
            for (let j = 0; j < nPos; j++) {
                let pi = pIdArray[j]
                td += `<td colspan = '1' class="${pi} text-white border"><div class="issue-details"></div><div class="details"><div class="issue-id"></div><div class="time"></div></div></td>
            `
            }
        }
        tableBody += ` <tr>
        <th scope="row">
          
          <div class="person-name">P-${i}</div></th>
          <div id="P-D"> 
           ${td}
          </div>
       </tr>
      `
    }

    let dis = ""
    for (let i = 0; i < pdArray.length; i++) {
        dis += `<td colspan = '1' class="${pdArray[i]} text-white border"><div class="issue-details"></div><div class="details"><div class="issue-id"></div><div class="time"></div></div></td>
        `
    }
    tableBody += ` <tr>
        <th scope="row">
        
          <div class="person-name">DISPATCHER</div></th>
          <div id="P-D"> 
           ${dis}
          </div>
       </tr>
      `;
      theadDraw.innerHTML = thead;
      tableDraw.innerHTML = tableBody;

    PROCESS = PROCESSCURRENT.slice();
    localStorage.clear()
    total = 0;
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
