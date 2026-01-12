const indianFormat = new Intl.NumberFormat("en-IN");

const lastValues = {
  percent: 0,
  discount: 0,
  tax: 0
};

document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");

  amountInput.addEventListener("input", () => {
    const cursor = amountInput.selectionStart;
    const raw = amountInput.value.replace(/,/g, "").replace(/\D/g, "");
    amountInput.value = indianFormat.format(raw || 0);
    amountInput.setSelectionRange(cursor, cursor);
  });

  document.getElementById("calcBtn").addEventListener("click", calculate);
  document.getElementById("historyBtn").addEventListener("click", toggleHistory);
  document.getElementById("clearHistory").addEventListener("click", clearHistory);

  document.querySelectorAll(".copy").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.copy;
      navigator.clipboard.writeText(indianFormat.format(lastValues[key]));
      card.classList.add("show");
      setTimeout(() => card.classList.remove("show"), 800);
    });
  });
});

function getRawAmount() {
  return Number(document.getElementById("amount").value.replace(/,/g, ""));
}

function round(n) {
  return Number.isInteger(n) ? n : Number(n.toFixed(2));
}

function calculate() {
  const amount = getRawAmount();
  const percentage = Number(document.getElementById("percentage").value);
  if (!amount || !percentage) return;

  const percent = (amount * percentage) / 100;
  const discount = amount - percent;
  const tax = amount + percent;

  lastValues.percent = round(percent);
  lastValues.discount = round(discount);
  lastValues.tax = round(tax);

  document.getElementById("percentValue").innerText =
    `₹${indianFormat.format(lastValues.percent)}`;
  document.getElementById("discountValue").innerText =
    `₹${indianFormat.format(lastValues.discount)}`;
  document.getElementById("taxValue").innerText =
    `₹${indianFormat.format(lastValues.tax)}`;

  saveHistory(amount, percentage, lastValues.percent);
}

/* HISTORY */
function saveHistory(amount, percentage, percent) {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.unshift(
    `₹${indianFormat.format(amount)} @ ${percentage}% → ₹${indianFormat.format(percent)}`
  );
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
  (JSON.parse(localStorage.getItem("calcHistory")) || []).forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("calcHistory");
  renderHistory();
}
