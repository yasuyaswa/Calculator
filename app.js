const percentValue = document.getElementById("percentValue");
const discountValue = document.getElementById("discountValue");
const taxValue = document.getElementById("taxValue");
const historyList = document.getElementById("historyList");
const historyBox = document.getElementById("historyBox");

document.getElementById("calcBtn").addEventListener("click", calculate);

function calculate() {
  const amount = Number(document.getElementById("amount").value);
  const percentage = Number(document.getElementById("percentage").value);

  if (!amount || !percentage) {
    alert("Please enter valid amount and percentage");
    return;
  }

  const percent = (amount * percentage) / 100;
  const discount = amount - percent;
  const tax = amount + percent;

  percentValue.innerText = `₹${percent.toFixed(2)}`;
  discountValue.innerText = `₹${discount.toFixed(2)}`;
  taxValue.innerText = `₹${tax.toFixed(2)}`;

  saveHistory(amount, percentage, percent, discount, tax);
}

function toggleHistory() {
  historyBox.classList.toggle("hidden");
  renderHistory();
}

function saveHistory(amount, percentage, percent, discount, tax) {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

  history.unshift({
    amount,
    percentage,
    percent,
    discount,
    tax
  });

  history = history.slice(0, 10);
  localStorage.setItem("calcHistory", JSON.stringify(history));
}

function renderHistory() {
  historyList.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("calcHistory")) || [];

  history.forEach(h => {
    const li = document.createElement("li");
    li.innerText = `₹${h.amount} @ ${h.percentage}% → ${h.percent.toFixed(2)}`;
    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("calcHistory");
  renderHistory();
}
