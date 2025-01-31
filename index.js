let clearFirst = false;
const operationText = document.getElementById("operation");
const output = document.getElementById("output");

let operations = [];

const buttonMappings = {
    "btn-sin": ["sin","("],
    "btn-tan": ["tan","("],
    "btn-plus": "+",
    "btn-seven": "7",
    "btn-eight": "8",
    "btn-nine": "9",
    "btn-cos": ["cos","("],
    "btn-log": ["log","("],
    "btn-minus": "-",
    "btn-four": "4",
    "btn-five": "5",
    "btn-six": "6",
    "btn-open-paren": "(",
    "btn-pi": "π",
    "btn-e": "e",
    "btn-multiply": "*",
    "btn-one": "1",
    "btn-two": "2",
    "btn-three": "3",
    "btn-close-paren": ")",
    "btn-degree": "°",
    "btn-power": "^",
    "btn-divide": "/",
    "btn-exp": ["exp","("],
    "btn-zero": "0",
    "btn-dot": "."
};

Object.keys(buttonMappings).forEach((id) => {
    let button = document.getElementById(id);
    if (button) {
        button.onclick = () => appendToOperation(buttonMappings[id]);
    }
});

document.getElementById("btn-clear").onclick = () => clearDisplay();
document.getElementById("btn-calculate").onclick = () => calculate();

function appendToOperation(input) {
    if (clearFirst){
        operationText.textContent = "";
        operations = [];
        clearFirst = false;
    }

    if (input.length > 1) {
        for (let val of input) {
            operationText.textContent  += val;
            operations.push(val); 
        }
    }
    else if (input == "°"){
        operations.push("*");
        operations.push("π");
        operations.push("/");
        operations.push("180");
        operationText.textContent  += input;
    }
    else if (isNaN(input)){
        
        operationText.textContent  += input;
        operations.push(input);
    }
    else{
        if (operations.length && !isNaN(operations[operations.length-1])){
            operations[operations.length-1] = operations[operations.length-1] + input;
        }
        else{
            
            operations.push(input);   
        }
        operationText.textContent += input;
    }


    // document.getElementById("heading").textContent = operations;
}


function clearDisplay() {
    operationText.textContent = "";
    operations = [];
    output.textContent = '0';
    // document.getElementById("heading").textContent = operations;
}


function shuntingYard(operationsArray) {
    const precedence = { 
        "+": 1, 
        "-": 1, 
        "*": 2, 
        "/": 2, 
        "^": 3, 
        "exp": 4 
    };
    
    const isLeftAssociative = (op) => op !== "^";

    let outputQueue = [];
    let operatorStack = [];

    for (let token of operationsArray) {
        if (!isNaN(token) || token === "π" || token === "e") {
            outputQueue.push(token);
        } 
        else if (["sin", "cos", "tan", "log", "exp"].includes(token)) {
            operatorStack.push(token);
        } 
        else if (token in precedence) {
            while (
                operatorStack.length &&
                (precedence[operatorStack[operatorStack.length - 1]] > precedence[token] || 
                    (precedence[operatorStack[operatorStack.length - 1]] == precedence[token] &&
                        isLeftAssociative(token))))
            {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(token);
        } 
        else if (token == ".") {
            while (operatorStack.length && operatorStack[operatorStack.length-1] != "(") {
                outputQueue.push(operatorStack.pop());
            }
        }
        else if (token === "(") {
            operatorStack.push(token);
        } 
        else if (token === ")") {
            while (operatorStack.length && operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop();

            if (operatorStack.length && ["sin", "cos", "tan", "log", "exp"].includes(operatorStack[operatorStack.length - 1])) {
                outputQueue.push(operatorStack.pop());
            }
        }
    }

    while (operatorStack.length) {
        outputQueue.push(operatorStack.pop());
    }

    // document.getElementById("heading") = outputQueue;
    return outputQueue;
}


function evaluateRPN(rpnArray) {
    const stack = [];
    
    const constants = { "π": Math.PI, "e": Math.E };

    for (let token of rpnArray) {
        if (!isNaN(token)) {
            stack.push(parseFloat(token));
        } 
        else if (token in constants) {
            stack.push(constants[token]);
        } 
        else if (["+", "-", "*", "/", "^", "exp"].includes(token)) {
            let b = stack.pop();
            let a = stack.pop();

            switch (token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                case "/": stack.push(a / b); break;
                case "^": stack.push(Math.pow(a, b)); break;
                case "exp": stack.push(b*Math.pow(10,a)); break;
            }
        } 
        else if (["sin", "cos", "tan", "log"].includes(token)) {
            let a = stack.pop();
            
            switch (token) {
                case "sin": stack.push(Math.sin(a)); break;
                case "cos": stack.push(Math.cos(a)); break;
                case "tan": stack.push(Math.tan(a)); break;
                case "log": stack.push(Math.log10(a)); break;
            }
        }
    }

    return stack.pop();
}


function calculate() {
    try
    {
        let RPN = shuntingYard(operations);
        let result = evaluateRPN(RPN);
        
        output.textContent = result;
    }
    catch(error)
    {
        output.textContent = "Error";
    }

    clearFirst = true;
}