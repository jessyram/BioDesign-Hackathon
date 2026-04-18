let data = [];
let dates = [];

const profile = JSON.parse(localStorage.getItem("profile"));

const ctx = document.getElementById('chart')?.getContext('2d');

let chart;

if (ctx) {
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Grip Strength (kg)',
          data: [],
          borderWidth: 3,
          tension: 0.3,
          borderColor: '#7b2cbf',
          pointRadius: 5
        },
        {
          label: 'Baseline (kg)',
          data: [],
          borderDash: [6,6],
          borderColor: '#ff85c0'
        }
      ]
    },
    options: {
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.raw + " kg";
            }
          }
        }
      }
    }
  });
}

function generateData() {
  if (!profile) {
    alert("Please complete setup first.");
    return;
  }

  data = [];
  dates = [];

  let baseline = Number(profile.baseline);

  const today = new Date();

  // Generate last 7 days
  for (let i = 6; i >= 0; i--) {
    let d = new Date();
    d.setDate(today.getDate() - i);

    let value = baseline - (i * 1.5) + Math.random() * 3;

    data.push(Math.round(value));
    dates.push(formatDate(d));
  }

  updateDashboard(baseline);
}

function updateDashboard(baseline) {
  chart.data.labels = dates;
  chart.data.datasets[0].data = data;
  chart.data.datasets[1].data = dates.map(() => baseline);

  chart.update();

  updateSummary(baseline);
  updateInsight();
  updateTable();
}

function updateSummary(baseline) {
  const todayValue = data[data.length - 1];
  const percent = ((todayValue - baseline) / baseline) * 100;

  const summary = document.getElementById("summary");
  summary.className = "card";

  let status = "";

  if (percent >= -10) {
    status = "Normal";
    summary.classList.add("green");
  } else if (percent >= -25) {
    status = "Warning";
    summary.classList.add("yellow");
  } else {
    status = "Critical";
    summary.classList.add("red");
  }

  summary.innerHTML = `
    <h2>${todayValue} kg</h2>
    Baseline: ${baseline} kg<br>
    Change: ${percent.toFixed(1)}%<br>
    Status: ${status}
  `;
}

function updateInsight() {
  const today = data[data.length - 1];
  const yesterday = data[data.length - 2];

  const insight = document.getElementById("insight");

  insight.innerText =
    today < yesterday
      ? "Grip strength is declining this week. Consider rest or reduced strain."
      : "Grip strength is stable or improving this week.";
}

// 📅 TABLE VIEW (daily values)
function updateTable() {
  const table = document.getElementById("dataTable");

  let html = `<h3>Weekly Breakdown</h3><ul>`;

  for (let i = 0; i < data.length; i++) {
    html += `<li>${dates[i]}: ${data[i]} kg</li>`;
  }

  html += `</ul>`;

  table.innerHTML = html;
}

// 📅 Format date
function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}