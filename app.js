const lastValues = {
  percent: "",
  discount: "",
  tax: ""
};

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("amount").addEventListener("input", calculate);
  document.getElementById("percentage").addEventListener("input", calculate);

  document.querySelectorAll(".copy").forEach(card => {
    card.addEventListener("click", () => {
      const key = card.dataset.copy;
      copyText(lastValues[key], card);
    });
  });

  document.getElementById("historyBtn").addEventListener("click", toggleHistory);
  document.getElementById("clearHistory").addEventListener("click", clearHistory);
});

function format(num) {
  return Number.isInteger(num) ? num.toString() : num.toFixed(2);
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

/* COPY (GitHub Pages safe) */
function copyText(text, card) {
  if (!text) return;

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => showCopied(card));
  } else {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    document.body.removeChild(temp);
    showCopied(card);
  }
}

function showCopied(card) {
  card.classList.add("show");
  setTimeout(() => card.classList.remove("show"), 900);
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
