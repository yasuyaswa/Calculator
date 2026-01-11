let mode = "both";

const amountInput = document.getElementById("amount");
const percentageInput = document.getElementById("percentage");

amountInput.addEventListener("input", calculate);
percentageInput.addEventListener("input", calculate);

function setMode(selected, btn) {
  mode = selected;

  document
    .querySelectorAll(".toggle button")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");
  calculate();
}

function calculate() {
  const amount = Number(amountInput.value);
  const percentage = Number(percentageInput.value);

  if (!amount || !percentage) return;

  const percent = (amount * percentage) / 100;
  const discount = amount - percent;
  const tax = amount + percent;

  document.getElementById("percentValue").innerText = `₹${percent.toFixed(2)}`;
  document.getElementById("discountValue").innerText = `₹${discount.toFixed(2)}`;
  document.getElementById("taxValue").innerText = `₹${tax.toFixed(2)}`;

  document.getElementById("discountCard").style.display =
    mode === "tax" ? "none" : "block";

  document.getElementById("taxCard").style.display =
    mode === "discount" ? "none" : "block";

  saveHistory(amount, percentage, percent);
}

function saveHistory(amount, percentage, percent) {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.unshift(`₹${amount} @ ${percentage}% → ₹${percent.toFixed(2)}`);
  history = history.slice(0, 10);
  localStorage.setItem("calcHistory", JSON.stringify(history));
}

function toggleHistory() {
  document.getElementById("historyBox").classList.toggle("hidden");
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.forEach(h => {
    const li = document.createElement("li");
    li.innerText = h;
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("calcHistory");
  renderHistory();
}
