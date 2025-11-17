// CALCULADORA REFACTORIZADA - VERSION OPTIMIZADA
// Archivo: calculator-v2.js
// Refactorizado aplicando principios SOLID y DRY

const MAX_HISTORY_ITEMS = 5;

const OPERATIONS = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b
};

// Estado de la calculadora
let buffer = "0";
let memoria = 0;
let ultimo_operador = null;
const historial = [];

// Gestión de números
function handleNumber(numStr) {
    buffer = buffer === "0" ? numStr : buffer + numStr;
    updateScreen();
}

// Gestión de símbolos - SIMPLIFICADA
function handleSymbol(symbol) {
    const symbolHandlers = {
        'C': resetCalculator,
        '=': executeEquals,
        '+': handleMath, 
        '-': handleMath,
        '*': handleMath,
        '/': handleMath,
        'sin': handleScientific,
        'cos': handleScientific,
        'tan': handleScientific
    };
    
    const handler = symbolHandlers[symbol];
    if (handler) {
        handler(symbol);
        updateScreen();
    }
}

// Operaciones específicas
function resetCalculator() {
    buffer = "0";
    memoria = 0;
    ultimo_operador = null;
}

function executeEquals() {
    if (ultimo_operador === null) return;
    
    const intBuffer = parseInt(buffer);
    const memoriaPrevia = memoria;
    
    flushOperation(intBuffer);
    logHistory(`${memoriaPrevia} ${ultimo_operador} ${intBuffer} = ${memoria}`);
    
    ultimo_operador = null;
    buffer = "" + memoria;
    memoria = 0;
}

function handleMath(symbol) {
    if (buffer === '0' && memoria === 0) return;
    
    const intBuffer = parseInt(buffer);
    
    if (memoria === 0) {
        memoria = intBuffer;
    } else {
        const memoriaPrevia = memoria;
        flushOperation(intBuffer);
        logHistory(`${memoriaPrevia} ${ultimo_operador} ${intBuffer} = ${memoria}`);
    }
    
    ultimo_operador = symbol;
    buffer = "0";
}

function handleScientific(symbol) {
    if (buffer === "0") return;
    
    const val = parseFloat(buffer);
    const resultado = calculateScientific(symbol, val);
    
    buffer = "" + resultado;
    logHistory(`${symbol}(${val}) = ${resultado}`);
}

function calculateScientific(operation, value) {
    const scientificOperations = {
        'sin': Math.sin,
        'cos': Math.cos, 
        'tan': Math.tan
    };
    
    const operationFunction = scientificOperations[operation];
    return operationFunction ? operationFunction(value) : value;
}

// Operaciones core
function flushOperation(intBuffer) {
    const operation = OPERATIONS[ultimo_operador];
    if (operation) {
        memoria = operation(memoria, intBuffer);
    }
}

// Gestión de historial
function logHistory(logEntry) {
    historial.push(logEntry);
    if (historial.length > MAX_HISTORY_ITEMS) {
        historial.shift();
    }
    console.log(historial);
}

// UI
function updateScreen() {
    const display = document.getElementById("display");
    if (display) {
        display.innerText = buffer;
    }
}

function init() {
    const buttons = document.querySelector('.buttons');
    if (buttons) {
        buttons.addEventListener('click', function(event) {
            const value = event.target.innerText;
            if (isNaN(parseInt(value))) {
                handleSymbol(value);
            } else {
                handleNumber(value);
            }
        });
    }
}

// Inicializar calculadora cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}