getTotal = () => {
    let price = document.querySelector('#price').value;
    let quantity = document.querySelector('#quantity').value;
    let sold = document.querySelector('#sold').value;
    if(isNaN(price) || isNaN(quantity)){
         alert("Quantity and Price Must be valid numbers")
    }else{
        let total = parseFloat( price * sold);
        document.querySelector('#total').value = total.toFixed(2);
    }
}

addInventory = () =>{
    let totalinventory = JSON.parse(localStorage.getItem("totalinventory"));
    if(totalinventory == null){
        totalinventory = []
    }
    
    let product = document.querySelector('#product').value;
    let price = document.querySelector('#price').value;
    let quantity = document.querySelector('#quantity').value;
    let sold = document.querySelector('#sold').value;
    let egresos = document.querySelector('#egresos').checked;

    if (product == "" || product == null) {
        alert("Porfavor ingrese un nombre")
    }else if (price == "" || isNaN(price)) {
        alert("Porfavor ingrese un numero valido")
    }else if (quantity == "" || isNaN(quantity)) {
        alert("Porfavor ingrese un numero valido")
    }else if (sold == "" || isNaN(sold)) {
        alert("Porfavor ingrese un numero valido")
    }else{
        if (egresos) {
            price = -price;
        }
        let total = parseFloat( price * sold);
        total = total.toFixed(2);     
        let newInventory = {
            product : product,
            price : price,
            quantity : quantity,
            sold: sold,
            total : total
        }
        totalinventory.push(newInventory)
        localStorage.setItem("totalinventory", JSON.stringify(totalinventory))
        window.location.reload() 
    }
}

getGrandTotal = () =>{
    let grandTotal = 0;
    let totalinventory = JSON.parse(localStorage.getItem("totalinventory"));
    if (totalinventory != null && totalinventory.length > 0) {
        
        for (let index = 0; index < totalinventory.length; index++) {

            grandTotal  += parseFloat(totalinventory[index]["total"]);
            grandTotal = grandTotal;


            
        }
    }
    document.querySelector('#grandTotal').innerHTML = grandTotal;
    
}



showInvent = () =>{
    getGrandTotal();
    let totalinventory = JSON.parse(localStorage.getItem("totalinventory"));
    if (totalinventory != null && totalinventory.length > 0) {
        let table = document.querySelector('#inventoryTable');
        for (let index = 0; index < totalinventory.length; index++) {
            let row = table.insertRow(1);
            let inventoryProduct = row.insertCell(0);
            let inventoryPrice = row.insertCell(1);
            let inventoryQuantity = row.insertCell(2);
            let inventorySold = row.insertCell(3);
            let inventoryTotal = row.insertCell(4);
            let inventoryAction = row.insertCell(5);

            inventoryAction.className = "text-center";

            let editBtn = document.createElement('input');
            editBtn.type = "button";
            editBtn.className = "btn";
            editBtn.value = "edit";

            inventoryAction.appendChild(editBtn);

            inventoryProduct.innerHTML = totalinventory[index]["product"];
            inventoryPrice.innerHTML = totalinventory[index]["price"];
            inventoryQuantity.innerHTML = totalinventory[index]["quantity"];
            inventorySold.innerHTML = totalinventory[index]["sold"];
            inventoryTotal.innerHTML = totalinventory[index]["total"];

            getGrandTotal();

            let deleteBtn = document.createElement('input');
            deleteBtn.type = "button";
            deleteBtn.className = "btn";
            deleteBtn.value = "delete";
            deleteBtn.onclick = (function(index) {
                return function() {

                    if (confirm("Do you want to delete your inventory data ?")) {
                        localStorage.clear();
                        window.location.reload();

                        totalinventory.splice(index, 1) 
                        alert("item deleted")
                        window.location.reload();
                        localStorage.setItem("totalinventory", JSON.stringify(totalinventory)); 
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
                    let inventorySold = inventoryRow.cells[3];
                    let inventoryTotal = inventoryRow.cells[4];
            
                    let newProduct = prompt("Introducir Nombre:", inventoryProduct.innerText);
                    let newPrice = prompt("Introducir Monto:", inventoryPrice.innerText);
                    let newQuantity = prompt("Introducir Cantidad:", inventoryQuantity.innerText);
                    let newSold = prompt("Introducir Vendidos:", inventorySold.innerText);
            
                    if (newProduct != null && newPrice != null && newQuantity != null) {
                        inventoryProduct.innerText = newProduct;
                        inventoryPrice.innerText = newPrice;
                        inventoryQuantity.innerText = newQuantity;
                        inventorySold.innerText = newSold;
                        inventoryTotal.innerText = parseFloat(newPrice * newSold).toFixed(2);
            
                        let totalinventory = JSON.parse(localStorage.getItem("totalinventory"));
                        totalinventory[index]["product"] = newProduct;
                        totalinventory[index]["price"] = newPrice;
                        totalinventory[index]["quantity"] = newQuantity;
                        totalinventory[index]["sold"] = newSold;
                        totalinventory[index]["total"] = parseFloat(newPrice * newSold).toFixed(2);
            
                        localStorage.setItem("totalinventory", JSON.stringify(totalinventory)); 
                        getGrandTotal();
                    }
                }
            })(index);
        }
    }
}






clearButton = () => {
    if (confirm("Do you want to clear all your inventory data ? This action cannot be un done")) {
        localStorage.clear();
        window.location.reload();
    }
    
}


getDate = () => {
    let today = new Date();
    return today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear() + '  '  + today.getHours() + ":" + today.getMinutes() + "<br>" ;
}


printData = () => { 
    var divContents = document.getElementById("allInventory").innerHTML; 
    var a = window.open('', '', 'height=11000, width=1000'); 
    a.document.write('<html>'); 
    a.document.write('<body > <h1>Inventario del Día : ' + getDate() + '<br>'); 
    a.document.write(divContents); 
    a.document.write('</body></html>'); 
    a.document.close(); 
    a.print(); 
} 

showInvent();