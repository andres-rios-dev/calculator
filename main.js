// =================================================================
// 1. CONSTANTS & DOM ELEMENTS
// =================================================================

// Seleccionamos los elementos del DOM que necesitamos
const screenTopRow = document.querySelector(".screen-top-row");
const screenBottomRow = document.querySelector(".screen-bottom-row");
const buttonContainer = document.querySelector(".button-container");

// Mapa de operadores internos ("/", "*") a sus símbolos visuales ("÷", "×")
const SYMBOLS = { "/": "\u00F7", "*": "\u00D7", "-": "\u2212", "+": "\u002B" };

// =================================================================
// 2. STATE (Variables que guardan el estado de la calculadora)
// =================================================================

// digitBuffer: un arreglo temporal donde se acumulan los digitos
// que el usuario va presionando. Ej: ['1', '2', '.', '5'] → "12.5"
let digitBuffer = [];

// num1 y num2: los dos números de la operación (ej: 5 + 3)
let num1 = null;
let num2 = null;

// operator: el operador actual ("+", "-", "*", "/")
let operator = null;

// hasResult: indica si ya se calculó un resultado.
// Sirve para saber si al presionar un dígito nuevo se debe limpiar todo.
let hasResult = false;

// =================================================================
// 3. MATH ENGINE (Las operaciones matemáticas)
// =================================================================

// operate(): recibe dos números y un operador, devuelve el resultado
function operate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return a / b;
    default:  return null;
  }
}

// compute(): valida que tengamos todo lo necesario y calcula el resultado
function compute() {
  // Si falta algún dato, no hacemos nada
  if (num1 === null || num2 === null || operator === null) return null;

  // Caso especial: división entre cero
  if (operator === "/" && num2 === 0) {
    return { error: "DIV_BY_ZERO" };
  }

  // Calculamos y redondeamos a 3 decimales para evitar errores de punto flotante
  let result = operate(num1, num2, operator);
  return Math.round(result * 1000) / 1000;
}

// parseCurrentInput(): convierte el digitBuffer a un número
// Ej: ['1', '2', '.', '5'] → 12.5
function parseCurrentInput() {
  if (digitBuffer.length > 0) {
    return parseFloat(digitBuffer.join(""));
  }
  return null;
}

// =================================================================
// 4. DISPLAY (Funciones que actualizan la pantalla)
// =================================================================

// renderDisplay(): actualiza la pantalla inferior (el número grande)
function renderDisplay() {
  if (digitBuffer.length === 0) {
    // Si no hay nada en el buffer...
    if (num1 !== null && hasResult) {
      // ...y hay un resultado previo, mostramos ese resultado
      screenBottomRow.textContent = num1;
    } else {
      // ...si no, mostramos "0"
      screenBottomRow.textContent = "0";
    }
  } else {
    // Si hay algo en el buffer, mostramos lo que el usuario está escribiendo
    screenBottomRow.textContent = digitBuffer.join("");
  }

  updateDecimalState();
}

// renderExpression(): actualiza la pantalla superior (la expresión: "5 + 3")
function renderExpression(showFullExpression) {
  let display = "";

  // Modo especial: mostrar la expresión completa (cuando se presiona "=")
  // Ej: "5 + 3" antes de mostrar el resultado
  if (showFullExpression && num1 !== null && num2 !== null && operator !== null) {
    display = num1 + " " + SYMBOLS[operator] + " " + num2;
    screenTopRow.textContent = display;
    return;
  }

  // Construcción normal de la expresión, paso a paso
  if (num1 !== null) {
    display += num1;
  }

  if (operator !== null) {
    display += " " + SYMBOLS[operator] + " ";
  }

  // Mostramos num2 solo si estamos en medio de una operación (no un resultado)
  if (operator !== null && !hasResult) {
    if (digitBuffer.length > 0) {
      display += digitBuffer.join("");
    } else if (num2 !== null) {
      display += num2;
    }
  }

  screenTopRow.textContent = display;
}

// updateDecimalState(): desactiva el botón "." si ya hay un punto decimal
function updateDecimalState() {
  const pointButton = document.querySelector('[data-value="point"]');
  if (pointButton) {
    const hasDecimal = digitBuffer.includes(".") || screenBottomRow.textContent.includes(".");
    pointButton.disabled = hasDecimal;
  }
}

// =================================================================
// 5. STATE MUTATIONS (Funciones que modifican el estado)
// =================================================================

// reset(): limpia todo y vuelve al estado inicial
function reset() {
  digitBuffer = [];
  num1 = null;
  num2 = null;
  operator = null;
  hasResult = false;
  renderDisplay();
  renderExpression();
}

// backspace(): borra el último digito del buffer
function backspace() {
  if (digitBuffer.length > 0) {
    digitBuffer.pop();
    renderDisplay();
    renderExpression();
  }
}

// toggleSign(): cambia el signo (+/-) del número actual
function toggleSign() {
  // Caso 1: Si estamos editando el buffer actual
  if (digitBuffer.length > 0) {
    if (digitBuffer[0] === "-") {
      digitBuffer.shift(); // quita el "-" del inicio
    } else {
      digitBuffer.unshift("-"); // agrega "-" al inicio
    }
    renderDisplay();
    renderExpression();
    return;
  }

  // Caso 2: Si ya hay un resultado calculado, invertimos su signo
  if (hasResult && num1 !== null) {
    num1 = num1 * -1;
    screenBottomRow.textContent = num1;
    renderExpression();
  }
}

// handleDecimal(): maneja cuando el usuario presiona el botón "."
function handleDecimal() {
  if (hasResult) reset();

  // Solo agregamos un punto si no hay ya uno
  if (!digitBuffer.includes(".")) {
    if (digitBuffer.length === 0) {
      digitBuffer.push("0", "."); // "." solo → "0."
    } else {
      digitBuffer.push(".");
    }

    renderDisplay();
    renderExpression();
  }
}

// handleDigit(): maneja cuando el usuario presiona un dígito (0-9)
function handleDigit(value) {
  // Si ya hay un resultado previo, limpiamos todo para empezar de nuevo
  if (hasResult) reset();

  // Prevenir ceros iniciales innecesarios ("007" → "7")
  if (digitBuffer.length === 1 && digitBuffer[0] === 0) {
    if (value === 0) return; // No permitir "00"
    digitBuffer.pop();       // Quitar el primer "0"
  }

  digitBuffer.push(value);
  renderDisplay();
  renderExpression();
}

// captureOperand(): toma lo que hay en el digitBuffer y lo guarda como num1 o num2
function captureOperand() {
  const parsed = parseCurrentInput();
  if (parsed !== null) {
    if (num1 === null) {
      num1 = parsed; // Es el primer número
    } else if (operator !== null && !hasResult) {
      num2 = parsed; // Es el segundo número
    }
  }
}

// executeCalculation(): ejecuta la operación y muestra el resultado
function executeCalculation() {
  if (num1 === null || num2 === null || operator === null) return;

  const result = compute();

  // Manejar error de división entre cero
  if (result && result.error === "DIV_BY_ZERO") {
    reset();
    screenTopRow.textContent = "DIV BY ZERO 🌌";
    screenBottomRow.textContent = "INFINITY";
    return;
  }

  // Mostramos la expresión completa arriba ANTES de sobrescribir num1
  renderExpression(true);

  // El resultado se convierte en el nuevo num1 (para encadenar operaciones)
  num1 = result;
  hasResult = true;
  digitBuffer = [];

  // Mostramos el resultado en la pantalla inferior
  screenBottomRow.textContent = result;

  // Limpiamos operador y num2 porque ya se usaron
  operator = null;
  num2 = null;
}

// handleOperator(): maneja cuando el usuario presiona +, -, ×, ÷
function handleOperator(action) {
  // CASO ESPECIAL: Encadenamiento de operaciones (ej: 5 + 5 + ...)
  // Si ya tenemos num1, un operador, y el usuario escribió más dígitos
  if (num1 !== null && operator !== null && digitBuffer.length > 0 && !hasResult) {
    num2 = parseCurrentInput();

    // Calculamos el resultado intermedio
    const result = compute();

    if (result && result.error === "DIV_BY_ZERO") {
      reset();
      screenTopRow.textContent = "DIV BY ZERO 🌌";
      screenBottomRow.textContent = "INFINITY";
      return;
    }

    // El resultado intermedio se convierte en el nuevo num1
    num1 = result;
    num2 = null;
    screenBottomRow.textContent = result;
  } else {
    // CASO NORMAL: guardamos el número actual como num1
    captureOperand();
  }

  // Convertimos el nombre del botón al símbolo del operador
  switch (action) {
    case "divide":   operator = "/"; break;
    case "multiply": operator = "*"; break;
    case "subtract": operator = "-"; break;
    case "add":      operator = "+"; break;
  }

  hasResult = false;
  digitBuffer = [];
  renderExpression();
}

// handleEquals(): maneja cuando el usuario presiona "="
function handleEquals() {
  // Necesitamos al menos num1 y un operador para calcular
  if (num1 === null || operator === null) return;

  if (digitBuffer.length > 0) {
    // Si hay dígitos en el buffer, ese es nuestro num2
    num2 = parseCurrentInput();
  } else if (num2 === null) {
    // Si no hay buffer ni num2 previo, no hay nada que calcular
    return;
  }

  executeCalculation();
}

// =================================================================
// 6. EVENT LISTENER & INIT (Escuchamos los clicks y arrancamos)
// =================================================================

// Un solo event listener en el contenedor de botones (delegación de eventos)
// En vez de poner un listener en CADA botón, ponemos UNO en el contenedor padre.
// Cuando se hace click en cualquier botón hijo, el evento "sube" hasta aquí.
buttonContainer.addEventListener("click", function (event) {
  // closest() busca el elemento con clase ".button" más cercano
  // (funciona incluso si se hizo click en el SVG dentro del botón de backspace)
  const target = event.target.closest(".button");

  // Si el click no fue en un botón, ignoramos
  if (!target) return;

  // Leemos los data attributes del botón clickeado
  const type = target.dataset.type;     // "digit", "operator", o "command"
  const action = target.dataset.action;  // "clear", "add", "divide", etc.
  const value = target.dataset.value;    // "0"-"9" o "point"

  // Según el tipo de botón, llamamos la función correspondiente
  switch (type) {
    case "digit":
      if (value === "point") {
        handleDecimal();
      } else {
        handleDigit(Number(value));
      }
      break;

    case "operator":
      handleOperator(action);
      break;

    case "command":
      switch (action) {
        case "clear":     reset();       break;
        case "backspace": backspace();   break;
        case "equals":    handleEquals(); break;
        case "negate":    toggleSign();   break;
      }
      break;
  }
});

// Inicializamos la pantalla al cargar la página
renderDisplay();
renderExpression();