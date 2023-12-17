/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


let PROCESS = [];
let cyclesDispatcher=0;
let cyclesInterrupts=0;

function addProcess() {
    const inputElement = document.getElementById('processInput');

    const infoProcess = inputElement.value.trim();

    if (infoProcess !== '') {
        PROCESS.push(infoProcess);
        inputElement.value = '';
        document.getElementById("size").textContent = PROCESS.length;

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
    // Aquí puedes realizar cualquier procesamiento necesario en la infoProcess
    // En este ejemplo, simplemente devolvemos la longitud de la infoProcess
    return infoProcess.length;
}

function dispatcher(){
    document.getElementById("outDistpatcher").textContent = "Must print the dispatcher run table";
    
}


 function readAndDisplayData() {
      // read window :
      cyclesDispatcher = prompt("Dispatcher Cycles:");
      cyclesInterrupts = prompt("Interrupts Cycles:");
      
      

      // Show data
      document.getElementById("result").innerHTML = `
        <p>Dispatcher Cycles: ${cyclesDispatcher}</p>
        <p>Interrupts Cycles: ${cyclesInterrupts}</p>
      `;
    }
