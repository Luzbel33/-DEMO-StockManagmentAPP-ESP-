getTotal = () => {
    let price = document.querySelector('#price').value;
    let quantity = document.querySelector('#quantity').value;
    if(isNaN(price) || isNaN(quantity)){
         alert("Quantity and Price Must be valid numbers")
    }else{
        let total = parseFloat( price * quantity);
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
    let egresos = document.querySelector('#egresos').checked;

    if (product == "" || product == null) {
        alert("please enter a product")
    }else if (price == "" || isNaN(price)) {
        alert("enter a valid number")
    }else if (quantity == "" || isNaN(quantity)) {
        alert("enter a valid quantity")
    }else{
        if (egresos) {
            price = -price;
        }
        let total = parseFloat( price * quantity);
        total = total.toFixed(2);     
        let newInventory = {
            product : product,
            price : price,
            quantity : quantity,
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
            let inventoryTotal = row.insertCell(3);
            let inventoryAction = row.insertCell(4);

            inventoryAction.className = "text-center";


            inventoryProduct.innerHTML = totalinventory[index]["product"];
            inventoryPrice.innerHTML = totalinventory[index]["price"];
            inventoryQuantity.innerHTML = totalinventory[index]["quantity"];
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

            let editBtn = document.createElement('input');
            editBtn.type = "button";
            editBtn.className = "btn";
            editBtn.value = "edit";
            editBtn.onclick = (function(index) {
                return function() {
                    let newProduct = prompt("Enter the new product name:");
                    let newPrice = prompt("Enter the new price:");
                    let newQuantity = prompt("Enter the new quantity:");

                    if (newProduct != null && newPrice != null && newQuantity != null) {
                        totalinventory[index]["product"] = newProduct;
                        totalinventory[index]["price"] = newPrice;
                        totalinventory[index]["quantity"] = newQuantity;
                        totalinventory[index]["total"] = parseFloat(newPrice * newQuantity).toFixed(2);

                        localStorage.setItem("totalinventory", JSON.stringify(totalinventory)); 
                        window.location.reload();
                    }
                }
            })(index);
            inventoryAction.appendChild(editBtn);
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