// show queued operator? 

const maxDisplayDigits = 10;
let queuedValueA = null;
let queuedValueB = null;
let queuedOperator = null;
let newInput = false;

const calculatorDisplay = document.querySelector("#display")

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
changeSign.addEventListener("click", changeDisplaySign)

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
    return a / b
}

// rounds number to given length of digits
function truncateNumber (number, digits = 10) {

    // check that digits value is positive integer
    if(!Number.isInteger(digits) || digits <= 0) {
        console.error("Digits must be a positive integer.");
        return "Calculation Error"
    }

    // if not a number return and stop processing
    if (Number.isNaN(number)) { return "Non number entered" };

    // if number is not finite return as is as cannot process
    if (!Number.isFinite(number)) { return number }

    // convert number to positive to not include sign in length calculations
    const sign = number > 0 ? 1 : -1;
    number = sign * number;    

    // truncate number to number of digits and remove trailing zeros
    number = parseFloat(number.toPrecision(digits))

    // if number is greater than number of digits return in exponential notation
    const numberDigits = number.toString().replace(".", "").length
    if (numberDigits > digits) { return sign * number.toExponential(digits - 1) }
    else { return sign * number }
}

// called by pressing sign but to change number +/-
function changeDisplaySign () {
    let currentDisplay = calculatorDisplay.textContent
    if (!isNaN(currentDisplay) && currentDisplay != 0)
    {
        calculatorDisplay.textContent = -1 * currentDisplay;
    }
}

// called by pressing one of the digit buttons, including "."
function enterDigit (userInput) {
    //let userInput = event.currentTarget.textContent
    let currentDisplay = calculatorDisplay.textContent

    // if text on screen reset
    if (isNaN(currentDisplay) || newInput) {
        currentDisplay = 0;
        newInput = false;
    }

    if (userInput === '.' && currentDisplay.includes(".")) {
        console.error("Attempted to enter two decimal points");
    }
    else {
        calculatorDisplay.textContent = currentDisplay == 0 ? userInput : currentDisplay + userInput;
    }

    // determine if decimal point should be enabled or disabled
    controlKeys();
}

// called by pressing one of the Operators buttons
function enterOperator(operatorAction) {
    // const operatorAction = event.currentTarget.value;
    console.log(`start queuedValueA: ${queuedValueA}, queuedValueB: ${queuedValueB}, queuedOperator: ${queuedOperator}`)

    if (queuedValueA !== null) {
        queuedValueB = parseFloat(calculatorDisplay.textContent);
        let calculatedValue = operate(queuedValueA, queuedValueB, queuedOperator)
        calculatorDisplay.textContent = calculatedValue;
   
        queuedValueB = null;
        queuedOperator = operatorAction === "=" ? null : operatorAction;
        queuedValueA = queuedOperator != null ? calculatedValue : null;
        newInput = true;
    }
    else if (queuedValueA === null) {
        queuedValueA = parseFloat(calculatorDisplay.textContent);
        calculatorDisplay.textContent = "0";
        queuedOperator = operatorAction === "=" ? null : operatorAction;
    }

    // determine if decimal point should be enabled or disabled
    controlKeys();

    console.log(`end queuedValueA: ${queuedValueA}, queuedValueB: ${queuedValueB}, queuedOperator: ${queuedOperator}`)
}

function operate (valueA, valueB, valueOperator)
{
    switch(valueOperator) {
        case "+":
            return addNumbers(valueA, valueB);
            break;
        case "-":
            return subtractNumbers(valueA, valueB);
            break;
        case "*":
            return multiplyNumbers(valueA, valueB);
            break;
        case "/":
            return divideNumbers(valueA, valueB);
            break;
        case "=":
            return operate(valueA, valueB, queuedOperator)
            break;
        default:
            return "Error"
    }
}

// called from pressing AC button
function allClear () {
    calculatorDisplay.textContent = 0;
    queuedValueA = null;
    queuedValueB = null;
    queuedOperator = null;

    // determine if decimal point should be enabled or disabled
    controlKeys();
}


// called from pressing backspace button
function clearLastDigit () {
    let numberInput = calculatorDisplay.textContent

    numberInput = numberInput.slice(0, -1)
    // if last character is a "." remove also
    let last = numberInput.slice(numberInput.length - 1)
    if (last == ".") { numberInput = numberInput.slice(0, -1) }

    // if no characters remaining set to 0
    if (numberInput === '') {
        calculatorDisplay.textContent = 0;
    }
    else {
        calculatorDisplay.textContent = numberInput
    }

    // determine if decimal point should be enabled or disabled
    controlKeys();
}

// determine if decimal point should be enabled or disabled
function controlKeys () {
    if (calculatorDisplay.textContent.includes(".") || isNaN(calculatorDisplay.textContent) || !isFinite(calculatorDisplay.textContent)) {
        document.querySelector("#decimal").disabled = true;
    }
    else {
        document.querySelector("#decimal").disabled = false;
    }

    if (isNaN(calculatorDisplay.textContent) || !isFinite(calculatorDisplay.textContent)) {
        document.querySelector("#backspace").disabled = true;
    }
    else {
        document.querySelector("#backspace").disabled = false;
    }
}