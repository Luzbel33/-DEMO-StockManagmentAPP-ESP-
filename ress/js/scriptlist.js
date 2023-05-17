let invNameButtons = document.querySelectorAll('.invName-button');
for (let i = 0; i < invNameButtons.length; i++) {
    invNameButtons[i].addEventListener('click', function() {
        let newText = prompt("Enter the new text:");
        if (newText != null) {
            let invName = this.parentNode.querySelector('h4');
            invName.textContent = newText;
            let pageUrl = window.location.href;
            let invNameKey = pageUrl + "_scriptlist_" + invName.id; // unique key for each invName value
            localStorage.setItem(invNameKey, newText); // save the invName value using the unique key
        }
    });
}

let pageUrl = window.location.href;
for (let i = 0; i < invNameButtons.length; i++) {
    let invName = invNameButtons[i].parentNode.querySelector('h4');
    let invNameKey = pageUrl + "_scriptlist_" + invName.id;
    let savedValue = localStorage.getItem(invNameKey);
    if (savedValue) {
        invName.textContent = savedValue;
    }
}
  