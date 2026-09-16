const maxDisplayDigits = 12;
let queuedValueA = null;
let queuedValueB = null;
let queuedOperator = null;
let inputNumberArray = []

const calculatorDisplay = document.querySelector("#display")
const calculatorHistory = document.querySelector("#history")

// event listener for entering digits and "."
const digitsInput = document.querySelectorAll(".digit")
digitsInput.forEach((item) => {
    item.addEventListener('click', event => {enterDigit(event.currentTarget.textContent)})
})

// event listener for operator buttons +/-///*/=
const operatorsInput = document.querySelectorAll(".operator")
operatorsInput.forEach((item) => {
    item.addEventListener('click', event => {enterOperator(event.currentTarget.value)})
})

// add clearing all operations and resetting display to 0
const clearScreen = document.querySelector("#clear")
clearScreen.addEventListener('click', allClear);

// add clearing last digit
const clearLast = document.querySelector("#backspace")
clearLast.addEventListener("click", clearLastDigit)

// add changing number to positive/negative
const changeSign = document.querySelector("#sign")
changeSign.addEventListener("click", changeNumberSign)

// add keyboard input
const documentBody = document.querySelector("body")
documentBody.addEventListener("keydown", event => { keyboardInput(event.key) })

function keyboardInput(keyPressed) {
    switch (true) {
        case (Number.isInteger(+keyPressed) || keyPressed === "."):
            enterDigit(keyPressed);
            break;
        case ["+", "-", "/", "*", "="].includes(keyPressed):
            enterOperator(keyPressed);
            break;        
        case (keyPressed === "Enter"):
            enterOperator("=");
            break;
        case (keyPressed === "Backspace" || keyPressed === "Delete"):
            clearLastDigit();
            break
        case (keyPressed === "Escape"):
            allClear();
            break            
    }
}

function addNumbers(a, b) {
    return a + b
}

function subtractNumbers(a, b) {
    return a - b
}

function multiplyNumbers(a, b) {
    return a * b
}

function divideNumbers(a, b) {

    if (b == 0) {
        return "Hm. Don't Know That One."
    }
    return a / b
}

// rounds number to given length of digits
function truncateNumber (number, limit = 10) {

    // check that digits value is positive integer
    if(!Number.isInteger(limit) || limit <= 0) {
        console.error("Limit must be a positive integer.");
        return "Calculation Error"
    }

    // if not a number return and stop processing
    if (Number.isNaN(number)) { return number };

    // if number is not finite return as is as cannot process
    if (!Number.isFinite(number)) { return number }

    // convert number to positive to not include sign in length calculations
    const sign = number > 0 ? 1 : -1;
    number = sign * number;    

    // truncate number to number of digits and remove trailing zeros
    number = parseFloat(number.toPrecision(limit))

    // if number is greater than number of digits return in exponential notation
    const numberDigits = number.toString().replace(".", "").length

    if (numberDigits > limit) { return (sign * number).toExponential(limit - 1) }
    else { return sign * number }
}

// called by pressing sign but to change number +/-
function changeNumberSign () {
    if (!isNaN(inputNumberArray.join("")) && inputNumberArray.length != 0)
    {
        if (inputNumberArray[0] === "-") { inputNumberArray.shift(); } else { inputNumberArray.unshift("-"); }
        updateDisplay();
    }
}

// called by pressing one of the digit buttons, including "."
function enterDigit (userInput) {

    if (userInput === '.') {

        // attempt to enter two "." for same number
        if (inputNumberArray.includes(".")) {
            console.log("Attempted to enter two decimal points!");
        }
        else {
            if (inputNumberArray.length === 0) {
                inputNumberArray = ["0", userInput]
            }
            else {
                inputNumberArray.push(userInput)
            }
        }
    }
    else if (inputNumberArray.length === 1 && inputNumberArray[0] === '0')
    {
        inputNumberArray = [userInput];
    }
    else if (inputNumberArray.length <= maxDisplayDigits) {
        inputNumberArray.push(userInput)   
    }

    updateDisplay();

    // determine if decimal point should be enabled or disabled
    controlKeys();
}

// called by pressing one of the Operators buttons
function enterOperator(operatorAction) {
    //console.log(`start queuedValueA: ${queuedValueA}, queuedValueB: ${queuedValueB}, queuedOperator: ${queuedOperator}`)

    // do nothing if user enters = with no queued value
    if (operatorAction === "=" && queuedValueA === null) {
        return;
    }
    else if (queuedValueA === null && inputNumberArray.length > 0) {
        queuedValueA = parseFloat(inputNumberArray.join(""));
        inputNumberArray = []
        queuedOperator = operatorAction === "=" ? null : operatorAction;
    }
    else if (queuedValueA !== null) {
        if (inputNumberArray.length === 0) {
            queuedOperator = operatorAction === "=" ? null : operatorAction;
        }
        else {
            queuedValueB = parseFloat(inputNumberArray.join(""));
            //console.log(`operate queuedValueA: ${queuedValueA}, queuedValueB: ${queuedValueB}, queuedOperator: ${queuedOperator}`)        
            let calculatedValue = operate(queuedValueA, queuedValueB, queuedOperator)

            updateHistory(queuedValueA, queuedValueB, queuedOperator);
            calculatorDisplay.textContent = calculatedValue;

            inputNumberArray = [];
            queuedValueB = null;
            queuedOperator = operatorAction === "=" ? null : operatorAction;
            if (!isNaN(calculatedValue)) {  ; //  queuedOperator != null ? calculatedValue : null;
                queuedValueA = calculatedValue;
                queuedOperator = operatorAction === "=" ? null : operatorAction;
            }
            else {
                queuedValueA = null;
                queuedOperator = null;
            }
        }
    }


    // determine if decimal point should be enabled or disabled
    controlKeys();

    //console.log(`end queuedValueA: ${queuedValueA}, queuedValueB: ${queuedValueB}, queuedOperator: ${queuedOperator}`)
}

function updateHistory (a, b, operator) {

    switch(operator) {
        case "/":
            operator = "\u00F7";
            break;
        case "*":
            operator = "\u00d7";
            break;
        default:
            operator = operator
    }
   
    calculatorHistory.textContent = `${a} ${operator} ${b} = `
}

function operate (valueA, valueB, valueOperator)
{
    switch(valueOperator) {
        case "+":
            return truncateNumber(addNumbers(valueA, valueB), maxDisplayDigits) ;
            break;
        case "-":
            return truncateNumber(subtractNumbers(valueA, valueB), maxDisplayDigits);
            break;
        case "*":
            return truncateNumber(multiplyNumbers(valueA, valueB), maxDisplayDigits);
            break;
        case "/":
            return truncateNumber(divideNumbers(valueA, valueB), maxDisplayDigits);
            break;
        case "=":
            return truncateNumber(operate(valueA, valueB, queuedOperator));
            break;
        default:
            return "Error"
    }
}

// called from pressing AC button
function allClear () {
    // adds white space - &nbsp; without using innerHTML
    calculatorHistory.textContent = "\u00A0";
    queuedValueA = null;
    queuedValueB = null;
    queuedOperator = null;
    inputNumberArray = [];
    
    updateDisplay();
    // determine if decimal point should be enabled or disabled
    controlKeys();
}


// called from pressing backspace button
function clearLastDigit () {

    inputNumberArray.pop()
    // if last character is a "." or "-" remove also
    if (inputNumberArray.at(-1) === "." || inputNumberArray.at(-1) === "-") {
        inputNumberArray.pop()
    }

    updateDisplay();
    controlKeys();
}

function updateDisplay () {
    calculatorDisplay.textContent = inputNumberArray.length === 0 ? '0' : inputNumberArray.join("")
}

// determine if decimal point should be enabled or disabled
function controlKeys () {
    const inputNumber = inputNumberArray.join("")

    if (inputNumber.includes(".") || isNaN(inputNumber) || !isFinite(inputNumber)) {
        document.querySelector("#decimal").disabled = true;
    }
    else {
        document.querySelector("#decimal").disabled = false;
    }

    if (isNaN(inputNumber) || !isFinite(inputNumber)) {
        document.querySelector("#backspace").disabled = true;
    }
    else {
        document.querySelector("#backspace").disabled = false;
    }
}