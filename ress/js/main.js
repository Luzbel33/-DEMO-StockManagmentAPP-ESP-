getTotal = () => {
    let price = document.querySelector('#price').value;
    let quantity = document.querySelector('#quantity').value;
    if(isNaN(price) || isNaN(quantity)){
         alert("Cantidad y Precio deben ser numeros validos.")
    }else{
        let total = parseFloat(price) * parseFloat(quantity);
        document.querySelector('#total').value = total.toFixed(2);
    }
}

addInventory = () => {
  let pageUrl = window.location.href;
  let totalinventory = JSON.parse(localStorage.getItem(pageUrl + "_script_registro"));
  if (totalinventory == null) {
    totalinventory = [];
  }

  let product = document.querySelector('#product').value;
  let price = document.querySelector('#price').value;
  let quantity = document.querySelector('#quantity').value;
  let egresos = document.querySelector('#egreso-ch').checked;

  if (product == "" || product == null) {
    alert("Porfavor ingrese un Nombre valido");
  } else if (price == "" || isNaN(price)) {
    alert("Porfavor ingrese un Numero valido para el Precio.");
  } else if (quantity == "" || isNaN(quantity)) {
    alert("Porfavor ingrese un Numero valido para la Cantidad");
  } else {
    let total = parseFloat(price) * parseFloat(quantity);
    total = total.toFixed(2);

    // Update the egresos variable to set the price and total as negative if egresos is true
    if (egresos) {
      price = -Math.abs(price);
      total = -Math.abs(total);
    }

    let newInventory = {
      product: product,
      price: price,
      quantity: quantity,
      total: total,
      egresos: egresos
    };

    totalinventory.unshift(newInventory);
    localStorage.setItem(pageUrl + "_script_registro", JSON.stringify(totalinventory));
    window.location.reload();
  }
};


getGrandTotal = () =>{
    let grandTotal = 0;
    let pageUrl = window.location.href;
    let totalinventory = JSON.parse(localStorage.getItem(pageUrl + "_script_registro"));
    if (totalinventory != null && totalinventory.length > 0) {
        
        for (let index = 0; index < totalinventory.length; index++) {

            grandTotal  += parseFloat(totalinventory[index]["total"]);
            grandTotal = grandTotal;
        }
    }
    document.querySelector('#grandTotal').innerHTML = "$" + grandTotal.toFixed(2);
    
}



showInvent = () =>{
    getGrandTotal();
    let pageUrl = window.location.href;
    let totalinventory = JSON.parse(localStorage.getItem(pageUrl + "_script_registro"));
    if (totalinventory != null && totalinventory.length > 0) {
        let table = document.querySelector('#inventoryTable');
        for (let index = 0; index < totalinventory.length; index++) {
            let row = table.insertRow(1);
            let inventoryProduct = row.insertCell(0);
            let inventoryPrice = row.insertCell(1);
            let inventoryQuantity = row.insertCell(2);
            let inventoryTotal = row.insertCell(3);
            let inventoryAction = row.insertCell(4);

            inventoryAction.className = "text-center";

            let editBtn = document.createElement('input');
            editBtn.type = "button";
            editBtn.className = "btn";
            editBtn.value = "EDITAR";

            inventoryAction.appendChild(editBtn);

            inventoryProduct.innerHTML = totalinventory[index]["product"];
            inventoryPrice.innerHTML = "$" + totalinventory[index]["price"];
            inventoryQuantity.innerHTML = totalinventory[index]["quantity"];
            inventoryTotal.innerHTML =  "$" + totalinventory[index]["total"];

            getGrandTotal();

            let deleteBtn = document.createElement('input');
            deleteBtn.type = "button";
            deleteBtn.className = "btn";
            deleteBtn.id = "btn-del"
            deleteBtn.value = "ELIMINAR";
            deleteBtn.onclick = (function(index) {
                return function() {
            
                    if (confirm("¿Estas seguro de que quieres borrar esta fila?")) {
                        let pageUrl = window.location.href;
                        let totalinventory = JSON.parse(localStorage.getItem(pageUrl + "_script_registro"));
                        totalinventory.splice(index, 1) 
                        alert("Eliminado")
                        localStorage.setItem(pageUrl + "_script_registro", JSON.stringify(totalinventory)); 
                        window.location.reload();
                        getGrandTotal();
                    }
                }
            })(index);
            inventoryAction.appendChild(deleteBtn);

            editBtn.onclick = (function(index) {
                return function() {
                  let inventoryRow = this.parentNode.parentNode;
                  let inventoryProduct = inventoryRow.cells[0];
                  let inventoryPrice = inventoryRow.cells[1];
                  let inventoryQuantity = inventoryRow.cells[2];
                  let inventoryTotal = inventoryRow.cells[3];
              
                  let newProduct = prompt("Ingresar Nombre:", inventoryProduct.innerText);
                  let newPrice = prompt("Ingresar Monto:", inventoryPrice.innerText.replace("$", ""));
                  let newQuantity = prompt("Ingresar Cantidad:", inventoryQuantity.innerText);
                  let newEgresos = totalinventory[index]["egresos"]; // Preserve the 'egresos' value
              
                  if (newProduct != null && newPrice != null && newQuantity != null) {
                    inventoryProduct.innerText = newProduct;
                    inventoryPrice.innerText = "$" + newPrice;
                    inventoryQuantity.innerText = newQuantity;
                    inventoryTotal.innerText = "$" + parseFloat(newPrice * newQuantity).toFixed(2);
              
                    let totalinventory = JSON.parse(localStorage.getItem(pageUrl + "_script_registro"));
                    totalinventory[index]["product"] = newProduct;
                    totalinventory[index]["price"] = newPrice;
                    totalinventory[index]["quantity"] = newQuantity;
                    totalinventory[index]["total"] = parseFloat(newPrice * newQuantity).toFixed(2);
                    totalinventory[index]["egresos"] = newEgresos; // Update the 'egresos' value
              
                    if (totalinventory[index]["egresos"]) {
                      totalinventory[index]["price"] = -Math.abs(totalinventory[index]["price"]); // Set price as negative if 'egresos' is true
                      totalinventory[index]["total"] = -Math.abs(totalinventory[index]["total"]); // Update the total as negative as well
                    }
              
                    localStorage.setItem(pageUrl + "_script_registro", JSON.stringify(totalinventory));
                    getGrandTotal();
                  }
                };
              })(index);
              
              
        }
    }
}

downloadInventory = () => {
    let pageUrl = window.location.href;
    let totalinventory = JSON.parse(localStorage.getItem(pageUrl + "_script_registro"));
    let delimiter = ";"; // change this to the desired delimiter character
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Movimiento" + delimiter + "Monto $$" + delimiter + "Cantidad" + delimiter + "Total $$" + "\n";
    let grandTotal = 0; // initialize grand total variable
    totalinventory.forEach(function(row) {
        csvContent += row.product + delimiter + row.price + delimiter + row.quantity + delimiter + row.total + "\n";
        grandTotal += parseFloat(row.total); // add to grand total
    });
    csvContent += "Total Neto" + delimiter + delimiter + delimiter + "$" + grandTotal.toFixed(2) + "\n"; // add grand total to CSV
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    let today = new Date();
    let fileName = "Registro_" + "FECHA_" + "(" + today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear() + ")" + "_HORA-DE-CIERRE_" + "(" + today.getHours() + "-" + today.getMinutes() + "hs" + ")" + ".csv";
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
        // Skip rows that have missing values or are the "Grand Total" row
        if (row.length < 4 || row[0] === "Total Neto") continue;
  
        let item = {
          product: row[0] || "",
          price: row[1] || "",
          quantity: row[2] || "",
          total: row[3] || "",
        };
  
        inventory.push(item);
      }
  
      localStorage.setItem(pageUrl + "_script_registro", JSON.stringify(inventory));
      window.location.reload();
    };
  
    reader.readAsText(file);
  };
  

// Function to download a file
function downloadFile(content, fileName) {
    let encodedUri = encodeURI(content);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
  }
  
  // Event listener for excName-button
  document.getElementById("excName-button").addEventListener("click", function() {
    let content = "../excel/REGISTROS_ENERO_A_JUNIO.xls";
    let fileName = "REGISTROS_DE_ENERO A_JUNIO.xls";
    downloadFile(content, fileName);
  });
  
  // Event listener for excName-button2
  document.getElementById("excName-button2").addEventListener("click", function() {
    let content = "../excel/REGISTROS_JULIO_A_DICIEMBRE.xls";
    let fileName = "REGISTROS_DE_JULIO_A_DICIEMBRE.xls";
    downloadFile(content, fileName);
});
  


clearButton = () => {
    if (confirm("¿Estas seguro de que quieres ELIMINAR TODOS los datos? Esta accion es definitiva.")) {
        localStorage.removeItem(window.location.href + "_script_registro");
        window.location.reload();
    }
}


getDate = () => {
    let today = new Date();
    return today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + '  '  + today.getHours() + ":" + today.getMinutes() + "<br>" ;
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
    let a = window.open('', '', 'height=11000, width=1000'); 
    a.document.write('<html>'); 
    a.document.write('<body > <h1>Registro del Día : ' + getDate() + '<br>'); 
    a.document.write(divContents.innerHTML); 
    a.document.write('</body></html>'); 
    a.document.close(); 
    a.print(); 
}

showInvent();