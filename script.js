/**
 * Calculator Engine
 * COMSATS University Islamabad, Wah Campus
 * Software Engineering - Assignment 01
 * Student: Muhammad Affaf Abdullah (FA25-BCS-003)
 */

// Core arithmetic operations
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

/**
 * Rounds decimal results to avoid IEEE 754 floating point artifacts
 */
function roundResult(value, decimals = 10) {
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return value;
  }
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Dispatches an operation based on operator symbol
 */
function compute(prev, current, operator) {
  const num1 = parseFloat(prev);
  const num2 = parseFloat(current);

  if (isNaN(num1) || isNaN(num2)) {
    return current;
  }

  let result;
  switch (operator) {
    case '+':
      result = add(num1, num2);
      break;
    case '−':
    case '-':
      result = subtract(num1, num2);
      break;
    case '×':
    case '*':
      result = multiply(num1, num2);
      break;
    case '÷':
    case '/':
      result = divide(num1, num2);
      break;
    default:
      return num2;
  }

  return roundResult(result);
}

// Controller and state management
class Calculator {
  constructor(historyElement, currentElement) {
    this.historyElement = historyElement;
    this.currentElement = currentElement;
    this.allClear();
  }

  allClear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.isErrorState = false;
    this.shouldResetScreen = false;
    this.updateDisplay();
  }

  clearEntry() {
    if (this.isErrorState) {
      this.allClear();
      return;
    }
    this.currentOperand = '0';
    this.updateDisplay();
  }

  delete() {
    if (this.isErrorState || this.shouldResetScreen) {
      this.allClear();
      return;
    }
    if (this.currentOperand === '0') return;

    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
    this.updateDisplay();
  }

  toggleSign() {
    if (this.isErrorState || this.currentOperand === '0') return;

    if (this.currentOperand.startsWith('-')) {
      this.currentOperand = this.currentOperand.substring(1);
    } else {
      this.currentOperand = '-' + this.currentOperand;
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    if (this.isErrorState) {
      this.allClear();
    }

    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }

    if (number === '.') {
      if (this.currentOperand.includes('.')) return;
      if (this.currentOperand === '') this.currentOperand = '0';
    }

    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand += number.toString();
    }

    this.updateDisplay();
  }

  chooseOperation(operator) {
    if (this.isErrorState) return;

    let normalizedOp = operator;
    if (operator === '/') normalizedOp = '÷';
    if (operator === '*') normalizedOp = '×';
    if (operator === '-') normalizedOp = '−';

    if (this.previousOperand !== '' && !this.shouldResetScreen) {
      this.calculate(false);
    }

    if (this.isErrorState) return;

    this.operation = normalizedOp;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  calculate(isEquals = true) {
    if (this.isErrorState) return;
    if (!this.operation || this.previousOperand === '') return;

    try {
      const prevNum = this.previousOperand;
      const currentNum = this.currentOperand;
      const result = compute(prevNum, currentNum, this.operation);

      if (isEquals) {
        this.historyElement.innerText = `${prevNum} ${this.operation} ${currentNum} =`;
        this.currentOperand = result.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.currentElement.innerText = this.formatDisplayNumber(this.currentOperand);
      } else {
        this.currentOperand = result.toString();
        this.previousOperand = result.toString();
        this.updateDisplay();
      }
    } catch (err) {
      this.isErrorState = true;
      this.currentOperand = err.message || 'Error';
      this.previousOperand = '';
      this.operation = undefined;
      this.updateDisplay();
    }
  }

  formatDisplayNumber(numberStr) {
    if (this.isErrorState || numberStr === 'Error' || numberStr === 'Cannot divide by zero') {
      return numberStr;
    }
    const [integerPart, decimalPart] = numberStr.split('.');
    const integerNumber = parseFloat(integerPart);

    let integerDisplay;
    if (isNaN(integerNumber)) {
      integerDisplay = '0';
    } else {
      integerDisplay = integerNumber.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    if (decimalPart != null) {
      return `${integerDisplay}.${decimalPart}`;
    }
    return integerDisplay;
  }

  updateDisplay() {
    this.currentElement.innerText = this.formatDisplayNumber(this.currentOperand);

    if (this.isErrorState) {
      this.historyElement.innerText = '';
      return;
    }

    if (this.operation != null && this.previousOperand !== '') {
      this.historyElement.innerText = `${this.previousOperand} ${this.operation}`;
    }
  }
}

// DOM Binding
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const historyElement = document.getElementById('display-history');
    const currentElement = document.getElementById('display-current');
    const calculator = new Calculator(historyElement, currentElement);

    // Number keys
    document.querySelectorAll('[data-number]').forEach(button => {
      button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
      });
    });

    // Operator keys
    document.querySelectorAll('[data-operator]').forEach(button => {
      button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operator'));
      });
    });

    // Action keys
    document.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', () => {
        const action = button.getAttribute('data-action');
        switch (action) {
          case 'all-clear':
            calculator.allClear();
            break;
          case 'clear-entry':
            calculator.clearEntry();
            break;
          case 'backspace':
            calculator.delete();
            break;
          case 'toggle-sign':
            calculator.toggleSign();
            break;
          case 'decimal':
            calculator.appendNumber('.');
            break;
          case 'calculate':
            calculator.calculate(true);
            break;
        }
      });
    });

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      const key = e.key;

      if ((key >= '0' && key <= '9') || key === '.') {
        e.preventDefault();
        calculator.appendNumber(key);
        flashKey(`[data-number="${key}"], [data-action="decimal"]`);
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        calculator.chooseOperation(key);
        let opSelector = key;
        if (key === '/') opSelector = '÷';
        if (key === '*') opSelector = '×';
        if (key === '-') opSelector = '-';
        flashKey(`[data-operator="${opSelector}"]`);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculator.calculate(true);
        flashKey('[data-action="calculate"]');
      } else if (key === 'Backspace') {
        e.preventDefault();
        calculator.delete();
        flashKey('[data-action="backspace"]');
      } else if (key === 'Escape') {
        e.preventDefault();
        calculator.allClear();
        flashKey('[data-action="all-clear"]');
      } else if (key === 'Delete') {
        e.preventDefault();
        calculator.clearEntry();
        flashKey('[data-action="clear-entry"]');
      }
    });

    function flashKey(selector) {
      const btn = document.querySelector(selector);
      if (btn) {
        btn.classList.add('active-key');
        setTimeout(() => btn.classList.remove('active-key'), 100);
      }
    }
  });
}

// Module export for CI unit testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    add,
    subtract,
    multiply,
    divide,
    roundResult,
    compute,
    Calculator
  };
}
