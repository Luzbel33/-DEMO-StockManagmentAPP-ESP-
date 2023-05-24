getTotal = () => {
    let stock = document.querySelector('#stock').value;
    let finalStock = document.querySelector('#finalStock').value;
    let sold = document.querySelector('#sold').value;
    if(isNaN(finalStock)){
         alert("Por favor ingresar valores validos")
    }else{
        let total = parseFloat( stock - sold);
        document.querySelector('#total').value = total.toFixed(2);
    }
}

addInventory = () =>{
    let pageUrl = window.location.href;
    let totalInventory = JSON.parse(localStorage.getItem(pageUrl + "_script"));
    if(totalInventory == null){
        totalInventory = []
    }
    
    let product = document.querySelector('#product').value;
    let stock = document.querySelector('#stock').value;
    let sold = document.querySelector('#sold').value;
    let finalStock = parseFloat(stock) - parseFloat(sold);

    if (product == "" || product == null) {
        alert("Porfavor ingresar un nombre.")
    } else if (stock == "" || isNaN(stock)) {
        alert("Porfavor ingrese un valor numerico.")
    } else {
        let total = parseFloat(stock - sold);
        let newInventory = {
            product : product,
            stock : stock,
            finalStock : finalStock,
            sold: sold,
            total : total
        }
        totalInventory.push(newInventory)
        localStorage.setItem(pageUrl + "_script", JSON.stringify(totalInventory))
        window.location.reload()
    }
}

getGrandTotal = () =>{
    let pageUrl = window.location.href;
    let totalInventory = JSON.parse(localStorage.getItem(pageUrl + "_script"));
    let grandTotal = totalInventory ? totalInventory.reduce((acc, item) => acc + parseFloat(item.total), 0) : 0;
    document.querySelector('#grandTotal').innerHTML = grandTotal;
}

// OLDER VERSION OF THE FUNCTION//
// getGrandTotal = () =>{
//  let grandTotal = 0;
//  let pageUrl = window.location.href;
//  let totalInventory = JSON.parse(localStorage.getItem(pageUrl + "_script"));
//  if (totalInventory != null && totalInventory.length > 0) {
//      
//      for (let index = 0; index < totalInventory.length; index++) {

//            grandTotal  += parseFloat(totalInventory[index]["total"]);
//          grandTotal = grandTotal;
//      }
//  }
//  document.querySelector('#grandTotal').innerHTML = grandTotal;
//   }



showInvent = () =>{
    getGrandTotal();
    let pageUrl = window.location.href;
    let totalInventory = JSON.parse(localStorage.getItem(pageUrl + "_script"));
    if (totalInventory != null && totalInventory.length > 0) {
        let table = document.querySelector('#inventoryTable');
        for (let index = 0; index < totalInventory.length; index++) {
            let row = table.insertRow(1);
            let inventoryProduct = row.insertCell(0);
            let inventoryStock = row.insertCell(1);
            let inventorySold = row.insertCell(2);
            let inventoryfinalStock = row.insertCell(3);
            let inventoryAction = row.insertCell(4);

            inventoryAction.className = "text-center";

            let editBtn = document.createElement('input');
            editBtn.type = "button";
            editBtn.className = "btn";
            editBtn.value = "EDITAR";

            inventoryAction.appendChild(editBtn);

            inventoryProduct.innerHTML = totalInventory[index]["product"];
            inventoryStock.innerHTML = totalInventory[index]["stock"];
            inventorySold.innerHTML = totalInventory[index]["sold"];
            inventoryfinalStock.innerHTML = totalInventory[index]["finalStock"];

            getGrandTotal();

            let deleteBtn = document.createElement('input');
            deleteBtn.type = "button";
            deleteBtn.className = "btn";
            deleteBtn.id = "btn-del"
            deleteBtn.value = "ELIMINAR";
            deleteBtn.onclick = (function(index) {
                return function() {
            
                    if (confirm("¿Estas seguro de que quieres borrar esta fila?")) {
                        totalInventory.splice(index, 1) 
                        alert("item eliminado")
                        window.location.reload();
                        localStorage.setItem(pageUrl + "_script", JSON.stringify(totalInventory)); 
                        getGrandTotal();
                    }
                }
            })(index);
            inventoryAction.appendChild(deleteBtn);

            editBtn.onclick = (function(index) {
                return function() {
                    let inventoryRow = this.parentNode.parentNode;
                    let inventoryProduct = inventoryRow.cells[0];
                    let inventoryStock = inventoryRow.cells[1];
                    let inventorySold = inventoryRow.cells[2];
                    let inventoryfinalStock = inventoryRow.cells[3];
            
                    let newProduct = prompt("Ingresar nombre del Item:", inventoryProduct.innerText);
                    let newStock = prompt("Ingresar valor de Stock Inicial:", inventoryStock.innerText);
                    let newSold = prompt("Ingresar numero de Vendidos:", inventorySold.innerText);
            
                    if (newProduct != null && newStock != null && newSold != null) {
                        inventoryProduct.innerText = newProduct;
                        inventoryStock.innerText = newStock;
                        inventorySold.innerText = newSold;
                        inventoryfinalStock.innerText = parseFloat(newStock - newSold);
            
                        let totalInventory = JSON.parse(localStorage.getItem(pageUrl + "_script"));
                        totalInventory[index]["product"] = newProduct;
                        totalInventory[index]["stock"] = newStock;
                        totalInventory[index]["sold"] = newSold;
                        totalInventory[index]["finalStock"] = parseFloat(newStock - newSold);
            
                        localStorage.setItem(pageUrl + "_script", JSON.stringify(totalInventory)); 
                        getGrandTotal();
                    }
                }
            })(index);
        }
    }
}

let editTitleButton = document.querySelector('.invTitle-button');
let invTitle = document.querySelector('#invTitle');
let invTitle2 = document.querySelector('#invTitle2');
let pageUrl = window.location.href;
let invTitleKey = pageUrl + "_scriptTitle_" + invTitle;
let invTitleKey2 = pageUrl + "_scriptTitle_" + invTitle2;

editTitleButton.addEventListener('click', function() {
    let newText = prompt("Ingresar Nombre:");
    if (newText != null) {
        invTitle.textContent = newText;
        invTitle2.textContent = newText;
        localStorage.setItem(invTitleKey, newText);
        localStorage.setItem(invTitleKey2, newText);
    }
});

// Set invTitle text from localStorage
let savedValue = localStorage.getItem(invTitleKey);
let savedValue2 = localStorage.getItem(invTitleKey2);
if (savedValue && savedValue2) {
    invTitle.textContent = savedValue;
    invTitle2.textContent = savedValue2;
}


clearButton = () => {
    if (confirm("¿Estas seguro de que quieres ELIMINAR TODOS los datos? Esta accion es definitiva.")) {
        localStorage.removeItem(window.location.href + "_script");
        window.location.reload();
    }
}

downloadInventory = () => {
    let pageUrl = window.location.href;
    let totalInventory = JSON.parse(localStorage.getItem(pageUrl + "_script"));
    let delimiter = ";"; // change this to the desired delimiter character
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Producto" + delimiter + "Stock Inicial" + delimiter + "Vendidos" + delimiter + "Stock Final" + delimiter + "Total" + "\n";
    totalInventory.forEach(function(row) {
        csvContent += row.product + delimiter + row.stock + delimiter + row.sold + delimiter + row.finalStock + delimiter + row.total + "\n";
    });
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    let today = new Date();
    let fileName = "Inventario_de_(" + invTitle.textContent + ")" + "FECHA_" + "(" + today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear() + ")" + "_HORA-DE-CIERRE_" + "(" + today.getHours() + "-" + today.getMinutes() + "hs" + ")" + ".csv";
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
}

uploadInventory = () => {
    let pageUrl = window.location.href;
    let file = document.getElementById("fileInput").files[0];
    let reader = new FileReader();
    reader.onload = function(event) {
        let csvData = event.target.result;
        let inventory = [];
        let rows = csvData.split("\n");

        for (let i = 1; i < rows.length; i++) {
        let row = rows[i].split(";");
        // Skip rows that have missing values
        if (row.length < 5) continue; // Assuming all columns are required
        
        let item = {
            product: row[0],
          stock: row[1] || "", // Set to empty string if the value is missing
          sold: row[2] || "", // Set to empty string if the value is missing
          finalStock: row[3] || "", // Set to empty string if the value is missing
          total: row[4] || "", // Set to empty string if the value is missing
        };
        
        inventory.push(item);
    }
  
      localStorage.setItem(pageUrl + "_script", JSON.stringify(inventory));
      window.location.reload();
    };
    
    reader.readAsText(file);
};

getDate = () => {
    let today = new Date();
    return today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear() + "_HORA_" + "(" + today.getHours() + "-" + today.getMinutes() + "hs)" + "<br>" ;
}

printData = () => { 
    let divContents = document.getElementById("allInventory").cloneNode(true);
    let actions = divContents.querySelectorAll("#actions");
    for (let i = 0; i < actions.length; i++) {
        actions[i].remove();
    }
    let buttons = divContents.querySelectorAll(".btn");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].remove();
    }
    let invTitle2 = document.querySelector('#invTitle2');
    let a = window.open('', '', 'height=11000, width=1000'); 
    a.document.write('<html>'); 
    a.document.write('<body > <h1>Inventario de ' + invTitle2.textContent + ' del Día : ' + getDate() + '<br>'); 
    a.document.write(divContents.innerHTML); 
    a.document.write('</body></html>'); 
    a.document.close(); 
    a.print(); 
}

showInvent();