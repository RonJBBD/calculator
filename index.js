let clearFirst = false;
const operation = document.getElementById("operation");
const output = document.getElementById("output");

function appendToOperation(input) {
    if (clearFirst){
        operation.textContent = "";
        clearFirst = false;
    }

    operation.textContent  += input;
}

function clearDisplay() {
    operation.textContent = "";
    output.textContent = '0';
}

function calculate() {
    try
    {
        let expression = operation.textContent;

        expression = expression.replace(/(\d)(sin|cos|tan|log|exp)\(/g, '$1*$2('); 
        expression = expression.replace(/(\d)(e|π)/g, '$1*$2');
        expression = expression.replace(/(e|π)(\d)/g, '$1*$2');


        expression = expression.replace(/×/g, "*");
        expression = expression.replace(/sin\(/g, 'Math.sin(');
        expression = expression.replace(/cos\(/g, 'Math.cos(');
        expression = expression.replace(/tan\(/g, 'Math.tan(');
        expression = expression.replace(/log\(/g, 'Math.log10(');
        expression = expression.replace(/exp\(/g, 'Math.pow(10,');
        expression = expression.replace(/π/g, 'Math.PI');
        expression = expression.replace(/e/g, 'Math.E');
        expression = expression.replace(/°/g, '*Math.PI/180');
        expression = expression.replace(/\^/g, '**');

        output.textContent = eval(expression);
    }
    catch(error)
    {
        output.textContent = "Error";
    }

    clearFirst = true;
}