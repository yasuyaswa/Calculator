"use strict";

const fmt = new Intl.NumberFormat("en-IN");
const lastValues = { percent: 0, discount: 0, tax: 0 };

/* Theme */
function initTheme() {
  const saved = localStorage.getItem("sc-theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
}

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("sc-theme", next);
}

/* Amount formatting */
function formatAmountInput(input) {
  const selStart = input.selectionStart;
  const raw = input.value.replace(/[^0-9]/g, "");
  const formatted = raw ? fmt.format(Number(raw)) : "";
  const diff = formatted.length - input.value.length;
  input.value = formatted;
  try { input.setSelectionRange(selStart + diff, selStart + diff); } catch (_) {}
}

/* Count-up animation */
function countUp(el, from, to, duration) {
  if (duration === undefined) duration = 480;
  const start = performance.now();
  function step(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = "\u20B9" + fmt.format(Math.round(from + (to - from) * ease));
    if (t < 1) requestAnimationFrame(step);
    else el.textContent = "\u20B9" + fmt.format(to);
  }
  requestAnimationFrame(step);
}

/* Shake invalid input */
function shake(el) {
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "shake 0.35s ease";
  el.addEventListener("animationend", function() { el.style.animation = ""; }, { once: true });
}

/* Helpers */
function getRaw() {
  return Number(document.getElementById("amount").value.replace(/[^0-9]/g, ""));
}

function round(n) {
  return Number.isInteger(n) ? n : Number(n.toFixed(2));
}

/* Calculate */
function calculate() {
  const amount = getRaw();
  const pct = Number(document.getElementById("percentage").value);

  var invalid = false;
  if (!amount) { shake(document.getElementById("amount").closest(".input-wrap")); invalid = true; }
  if (!pct)    { shake(document.getElementById("percentage").closest(".input-wrap")); invalid = true; }
  if (invalid) return;

  const percent  = round((amount * pct) / 100);
  const discount = round(amount - percent);
  const tax      = round(amount + percent);

  const prev = Object.assign({}, lastValues);
  lastValues.percent  = percent;
  lastValues.discount = discount;
  lastValues.tax      = tax;

  countUp(document.getElementById("percentValue"),  prev.percent,  percent);
  countUp(document.getElementById("discountValue"), prev.discount, discount);
  countUp(document.getElementById("taxValue"),      prev.tax,      tax);

  document.querySelectorAll(".main-card, .sub-card").forEach(function(c) {
    c.classList.remove("pop");
    void c.offsetWidth;
    c.classList.add("pop");
  });

  saveHistory(amount, pct, percent);
  updateBadge();
}

/* History */
function getHistory() {
  try { return JSON.parse(localStorage.getItem("sc-history")) || []; }
  catch (_) { return []; }
}

function saveHistory(amount, pct, percent) {
  var hist = getHistory();
  hist.unshift({ amount: amount, pct: pct, percent: percent });
  localStorage.setItem("sc-history", JSON.stringify(hist.slice(0, 20)));
}

function updateBadge() {
  document.getElementById("historyCount").textContent = getHistory().length;
}

function toggleHistory() {
  document.getElementById("historyBox").classList.toggle("hidden");
  renderHistory();
}

function renderHistory() {
  var list = document.getElementById("historyList");
  list.innerHTML = "";
  getHistory().forEach(function(h) {
    var li = document.createElement("li");
    if (h && typeof h === "object" && h.amount != null) {
      li.textContent = "\u20B9" + fmt.format(h.amount) + " @ " + h.pct + "% \u2192 \u20B9" + fmt.format(h.percent);
    } else {
      li.textContent = String(h);
    }
    list.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("sc-history");
  localStorage.removeItem("calcHistory");
  renderHistory();
  updateBadge();
}

/* Init */
document.addEventListener("DOMContentLoaded", function() {
  initTheme();
  updateBadge();

  var amountEl     = document.getElementById("amount");
  var percentageEl = document.getElementById("percentage");

  amountEl.addEventListener("input", function() { formatAmountInput(amountEl); });

  document.getElementById("calcBtn").addEventListener("click", calculate);
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);
  document.getElementById("historyBtn").addEventListener("click", toggleHistory);
  document.getElementById("clearHistory").addEventListener("click", clearHistory);

  [amountEl, percentageEl].forEach(function(el) {
    el.addEventListener("keydown", function(e) { if (e.key === "Enter") calculate(); });
  });

  document.querySelectorAll(".copy").forEach(function(card) {
    card.addEventListener("click", function() {
      var val = fmt.format(lastValues[card.dataset.copy]);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(val).catch(function() {});
      }
      card.classList.add("copied");
      setTimeout(function() { card.classList.remove("copied"); }, 1600);
    });
  });
});
