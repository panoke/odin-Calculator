let digitA = 0;
let digitB = null;

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
        throw new Error("Digits must be a positive integer.");
    }

    // if not a number return and stop processing
    if (Number.isNaN(number)) { return NaN };

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

const display = document.querySelector("#display")
const digitsInput = document.querySelectorAll(".digit")

digitsInput.forEach((item) => {
    item.addEventListener('click', (event) => {enterDigit(event)})
})

const clearScreen = document.querySelector("#clear")
clearScreen.addEventListener('click', allClear);

const clearLast = document.querySelector("#backspace")
clearLast.addEventListener("click", clearLastDigit)


function enterDigit (event) {
    display.textContent = display.textContent == 0 ? event.currentTarget.textContent : display.textContent + event.currentTarget.textContent
}

function allClear () {
    display.textContent = 0;
}

function clearLastDigit () {

    let numberInput = display.textContent
    // if already 0 do nothing 


    numberInput = numberInput.slice(0, -1)
    // if last character is a "." remove also
    let last = numberInput.slice(numberInput.length - 1)
    if (last == ".") { numberInput = numberInput.slice(0, -1) }

    if (numberInput === '') {
        display.textContent = 0;
    }
    else {
        display.textContent = numberInput
    }
}
