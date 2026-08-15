
// TEMPERATURE CONVERTER - VANILLA JAVASCRIPT


const form = document.getElementById("converter-form");
const temperatureInput = document.getElementById("temperature-input");
const unitSelect = document.getElementById("unit-select");
const errorMessage = document.getElementById("input-error");
const resultsSection = document.getElementById("results");

const resultCelsius = document.getElementById("result-celsius");
const resultFahrenheit = document.getElementById("result-fahrenheit");
const resultKelvin = document.getElementById("result-kelvin");

// Absolute zero limits for each input unit
const ABSOLUTE_ZERO_LIMITS = {
    celsius: -273.15,
    fahrenheit: -459.67,
    kelvin: 0
};


// VALIDATION FUNCTIONS


/**
  Checks if the entered value is a valid number.
  Accepts values like: 25, -10, +37.5, .5, 98.
 Rejects letters, symbols, and empty values.
 */
function isValidNumber(value) {
    const normalizedValue = value.trim().replace(",", ".");

    if (!normalizedValue) {
        return false;
    }

    const numberPattern = /^[+-]?(\d+(\.\d*)?|\.\d+)$/;
    return numberPattern.test(normalizedValue);
}

/**
 Validates the current input field.
 Returns an object:
  { valid: true, value: number, unit: string }
  or
  { valid: false, error: string }
 */
function validateTemperatureInput() {
    const rawValue = temperatureInput.value;
    const selectedUnit = unitSelect.value;

    // Empty input validation
    if (rawValue.trim() === "") {
        return {
            valid: false,
            error: "Please enter a temperature value."
        };
    }

    // Non-numeric input validation
    if (!isValidNumber(rawValue)) {
        return {
            valid: false,
            error: "Please enter a valid numeric temperature. Example: 25, -10, 37.5"
        };
    }

    const numericValue = Number(rawValue.trim().replace(",", "."));

    if (!Number.isFinite(numericValue)) {
        return {
            valid: false,
            error: "Please enter a valid numeric temperature."
        };
    }

    // Absolute zero validation
    const minimumAllowed = ABSOLUTE_ZERO_LIMITS[selectedUnit];

    // Small tolerance avoids floating-point rounding issues
    if (numericValue < minimumAllowed - 0.0000001) {
        let absoluteZeroError = "";

        if (selectedUnit === "celsius") {
            absoluteZeroError = "Temperature cannot be below absolute zero (-273.15 °C).";
        } else if (selectedUnit === "fahrenheit") {
            absoluteZeroError = "Temperature cannot be below absolute zero (-459.67 °F).";
        } else {
            absoluteZeroError = "Temperature cannot be below absolute zero (0 K).";
        }

        return {
            valid: false,
            error: absoluteZeroError
        };
    }

    return {
        valid: true,
        value: numericValue,
        unit: selectedUnit
    };
}


// CONVERSION FUNCTIONS


/**
 * Converts the input temperature into Celsius, Fahrenheit, and Kelvin.
 */
function convertTemperature(value, unit) {
    let celsius;

    if (unit === "celsius") {
        celsius = value;
    } else if (unit === "fahrenheit") {
        celsius = (value - 32) * (5 / 9);
    } else {
        // unit === "kelvin"
        celsius = value - 273.15;
    }

    return {
        celsius: celsius,
        fahrenheit: (celsius * 9 / 5) + 32,
        kelvin: celsius + 273.15
    };
}

/**
 * Formats the result to 2 decimal places.
 * Also prevents showing -0.00.
 */
function formatTemperature(value) {
    const safeValue = Math.abs(value) < 0.005 ? 0 : value;
    return safeValue.toFixed(2);
}


// UI FUNCTIONS


/**
 * Shows error message and hides results.
 */
function showError(message) {
    errorMessage.textContent = message;
    resultsSection.hidden = true;
}

/**
 * Clears error message.
 */
function clearError() {
    errorMessage.textContent = "";
}

/**
 * Displays all converted temperature values.
 */
function displayResults(results) {
    resultCelsius.textContent = `${formatTemperature(results.celsius)} °C`;
    resultFahrenheit.textContent = `${formatTemperature(results.fahrenheit)} °F`;
    resultKelvin.textContent = `${formatTemperature(results.kelvin)} K`;

    resultsSection.hidden = false;
}

/**
 * Main conversion function.
 * Validates input first, then converts and displays results.
 */
function runConversion() {
    const validation = validateTemperatureInput();

    if (!validation.valid) {
        showError(validation.error);
        return;
    }

    clearError();

    const results = convertTemperature(validation.value, validation.unit);
    displayResults(results);
}


// EVENT LISTENERS


// Convert button click / form submit
form.addEventListener("submit", function (event) {
    event.preventDefault();
    runConversion();
});

temperatureInput.addEventListener("input", function () {
    const currentValue = temperatureInput.value;

    if (currentValue.trim() === "") {
        clearError();
        resultsSection.hidden = true;
        return;
    }

    const validation = validateTemperatureInput();

    if (!validation.valid) {
        showError(validation.error);
    } else {
        clearError();
        runConversion();
    }
});

unitSelect.addEventListener("change", function () {
    const currentValue = temperatureInput.value;

    if (currentValue.trim() === "") {
        clearError();
        resultsSection.hidden = true;
        return;
    }

    const validation = validateTemperatureInput();

    if (!validation.valid) {
        showError(validation.error);
    } else {
        clearError();
        runConversion();
    }
});