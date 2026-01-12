const lastValues = {
  percent: "",
  discount: "",
  tax: ""
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("calcBtn").addEventListener("click", calculate);
  document.getElementById("historyBtn").addEventListener("click", toggleHistory);
  document.getElementById("clearHistory").addEventListener("click", clearHistory);

  document.querySelectorAll(".copy").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.copy;
      copyText(lastValues[key], card);
    });
  });
});

function format(num) {
  return Number.isInteger(num) ? num : num.toFixed(2);
}

function calculate() {
  const amount = Number(document.getElementById("amount").value);
  const percentage = Number(document.getElementById("percentage").value);
  if (!amount || !percentage) return;

  const percent = (amount * percentage) / 100;
  const discount = amount - percent;
  const tax = amount + percent;

  lastValues.percent = format(percent);
  lastValues.discount = format(discount);
  lastValues.tax = format(tax);

  document.getElementById("percentValue").innerText = `₹${lastValues.percent}`;
  document.getElementById("discountValue").innerText = `₹${lastValues.discount}`;
  document.getElementById("taxValue").innerText = `₹${lastValues.tax}`;

  saveHistory(amount, percentage, lastValues.percent);
}

/* HISTORY */
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
  (JSON.parse(localStorage.getItem("calcHistory")) || []).forEach(h => {
    const li = document.createElement("li");
    li.innerText = h;
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("calcHistory");
  renderHistory();
}

/* COPY */
function copyText(text, card) {
  if (!text) return;
  navigator.clipboard.writeText(text);
  card.classList.add("show");
  setTimeout(() => card.classList.remove("show"), 800);
}
