# Simple Calculator

Software Engineering (BCS 3A) &mdash; Assignment 01  
COMSATS University Islamabad, Wah Campus  
Student: Muhammad Affaf Abdullah (FA25-BCS-003)  

---

## Overview

A browser-based calculator implementing standard arithmetic operations, keyboard input support, error handling for division by zero, and floating-point precision rounding. The project incorporates a Git workflow with GitHub Actions Continuous Integration (CI) and deployment via GitHub Pages.

## Features

- Basic arithmetic operations: addition (`+`), subtraction (`−`), multiplication (`×`), and division (`÷`).
- Dual display: upper expression history and primary input/result display.
- Guard against division by zero with user-facing error message.
- Decimal precision rounding using `Number.EPSILON` to avoid IEEE 754 precision issues (e.g. `0.1 + 0.2 = 0.3`).
- Keyboard navigation mapping for numeric keys, operators, Enter (`=`), Backspace, and Escape (`AC`).
- High-contrast, tactile interface styled with CSS custom properties and tabular numbers.

## Project Structure

```
Project/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow configuration
├── test/
│   └── calculator.test.js     # Unit test suite for arithmetic operations
├── index.html                 # Application markup
├── style.css                  # UI styles
├── script.js                  # Arithmetic engine and UI controller
└── README.md                  # Project documentation
```

## Running Tests

Tests run automatically on every push to the `main` branch via GitHub Actions.

To execute tests locally using Node.js:

```bash
node test/calculator.test.js
```
