let lastValues = {
  percent: 0,
  discount: 0,
  tax: 0
};

document.addEventListener("DOMContentLoaded", () => {
  const amountInput = document.getElementById("amount");
  const percentageInput = document.getElementById("percentage");

  amountInput.addEventListener("input", calculate);
  percentageInput.addEventListener("input", calculate);

  document.querySelectorAll(".copy").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.copy;
      copyToClipboard(lastValues[key], card);
    });
  });

  document.getElementById("historyBtn").addEventListener("click", toggleHistory);
  document.getElementById("clearHistory").addEventListener("click", clearHistory);
});

function formatNumber(num) {
  return Number.isInteger(num) ? num : parseFloat(num.toFixed(2));
}

function calculate() {
  const amount = Number(document.getElementById("amount").value);
  const percentage = Number(document.getElementById("percentage").value);

  if (!amount || !percentage) return;

  const percent = (amount * percentage) / 100;
  const discount = amount - percent;
  const tax = amount + percent;

  lastValues.percent = formatNumber(percent);
  lastValues.discount = formatNumber(discount);
  lastValues.tax = formatNumber(tax);

  document.getElementById("percentValue").innerText = `₹${lastValues.percent}`;
  document.getElementById("discountValue").innerText = `₹${lastValues.discount}`;
  document.getElementById("taxValue").innerText = `₹${lastValues.tax}`;

  saveHistory(amount, percentage, lastValues.percent);
}

function copyToClipboard(value, card) {
  navigator.clipboard.writeText(value.toString());
  card.classList.add("show");
  setTimeout(() => card.classList.remove("show"), 800);
}

function saveHistory(amount, percentage, percent) {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.unshift(`₹${amount} @ ${percentage}% → ₹${percent}`);
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
