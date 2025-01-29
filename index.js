const operation = document.getElementById("operation");
const output = document.getElementById("output");

function appendToOperation(input) {
    operation.textContent  += input;
}

function clearDisplay() {
    operation.textContent = "";
    output.textContent = "0";
}
