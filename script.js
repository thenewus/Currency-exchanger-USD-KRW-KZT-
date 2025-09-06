const apiKey = "5bd1231ac5d9a20f6894300f"; // Replace with your ExchangeRate-API key
const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
let rates = { USD: 1, KRW: null, KZT: null };

const usdInput = document.getElementById("usd");
const krwInput = document.getElementById("krw");
const kztInput = document.getElementById("kzt");
const errorDiv = document.getElementById("error");

// Load saved values from localStorage on page load
function loadSavedValues() {
  const savedUSD = localStorage.getItem("usd");
  const savedKRW = localStorage.getItem("krw");
  const savedKZT = localStorage.getItem("kzt");
  if (savedUSD) usdInput.value = savedUSD;
  if (savedKRW) krwInput.value = savedKRW;
  if (savedKZT) kztInput.value = savedKZT;
}

// Save input values to localStorage
function saveValues() {
  localStorage.setItem("usd", usdInput.value);
  localStorage.setItem("krw", krwInput.value);
  localStorage.setItem("kzt", kztInput.value);
}

// Fetch exchange rates from API
async function fetchRates() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch rates");
    const data = await response.json();
    if (data.result !== "success")
      throw new Error(data["error-type"] || "API error");
    rates.KRW = data.conversion_rates.KRW;
    rates.KZT = data.conversion_rates.KZT;
    errorDiv.textContent = "";
    // Update inputs if there's a saved USD value
    if (usdInput.value) updateFromUSD();
    else if (krwInput.value) updateFromKRW();
    else if (kztInput.value) updateFromKZT();
  } catch (error) {
    errorDiv.textContent = "Error fetching rates. Please try again later.";
    console.error(error);
  }
}

// Update inputs based on USD input
function updateFromUSD() {
  const usd = parseFloat(usdInput.value);
  if (isNaN(usd) || !rates.KRW || !rates.KZT) return;
  krwInput.value = (usd * rates.KRW).toFixed(2);
  kztInput.value = (usd * rates.KZT).toFixed(2);
  saveValues();
}

// Update inputs based on KRW input
function updateFromKRW() {
  const krw = parseFloat(krwInput.value);
  if (isNaN(krw) || !rates.KRW || !rates.KZT) return;
  const usd = krw / rates.KRW;
  usdInput.value = usd.toFixed(2);
  kztInput.value = (usd * rates.KZT).toFixed(2);
  saveValues();
}

// Update inputs based on KZT input
function updateFromKZT() {
  const kzt = parseFloat(kztInput.value);
  if (isNaN(kzt) || !rates.KRW || !rates.KZT) return;
  const usd = kzt / rates.KZT;
  usdInput.value = usd.toFixed(2);
  krwInput.value = (usd * rates.KRW).toFixed(2);
  saveValues();
}

// Add event listeners
usdInput.addEventListener("input", updateFromUSD);
krwInput.addEventListener("input", updateFromKRW);
kztInput.addEventListener("input", updateFromKZT);

// Initialize: Load saved values and fetch rates
loadSavedValues();
fetchRates();
