const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const form = document.getElementById("transactionForm");
const list = document.getElementById("transactionList");

const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");

const themeToggle = document.getElementById("themeToggle");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

/* CHART */
const ctx = document.getElementById("expenseChart").getContext("2d");

let chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ["#6c63ff","#16c784","#ff6384","#36a2eb","#ffce56","#ff9f40"]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  }
});

/* ADD */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  transactions.push({
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: category.value,
    type: document.querySelector('input[name="type"]:checked').value
  });

  update();
  form.reset();
});

/* DELETE */
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  update();
}

/* UPDATE */
function update() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
  summary();
  chartUpdate();
}

/* RENDER */
function render() {
  list.innerHTML = "";

  transactions.forEach(t => {
    const li = document.createElement("li");
    li.className = `transaction ${t.type}`;

    li.innerHTML = `
      <div>
        <strong>${t.text}</strong><br>
        <small>${t.category}</small>
      </div>

      <div>
        ₹${t.amount}
        <button class="delete-btn" onclick="deleteTransaction(${t.id})">X</button>
      </div>
    `;

    list.appendChild(li);
  });
}

/* SUMMARY */
function summary() {
  let inc = 0, exp = 0;

  transactions.forEach(t => {
    if (t.type === "income") inc += t.amount;
    else exp += t.amount;
  });

  income.innerText = `₹${inc}`;
  expense.innerText = `₹${exp}`;
  balance.innerText = `₹${inc - exp}`;
}

/* CHART */
function chartUpdate() {
  const grouped = {};

  transactions
    .filter(t => t.type === "expense")
    .forEach(t => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

  chart.data.labels = Object.keys(grouped);
  chart.data.datasets[0].data = Object.values(grouped);

  chart.update();
}

/* THEME */
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
};

/* INIT */
update();