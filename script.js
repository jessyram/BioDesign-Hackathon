let data = [];

const user = JSON.parse(localStorage.getItem("userData"));

const ctx = document.getElementById('chart')?.getContext('2d');

let chart;

if (ctx) {
  chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Grip Strength',
          data: [],
          borderWidth: 3,
          tension: 0.3,
          borderColor: '#7b2cbf'
        },
        {
          label: 'Baseline',
          data: [],
          borderDash: [6,6],
          borderColor: '#ff85c0'
        }
      ]
    }
  });
}

function generateData() {
  if (!user) {
    alert("Please complete setup first.");
    return;
  }

  data = [];

  let baseline = user.baseline;

  for (let i = 0; i < 10; i++) {
    let value = baseline - (i * 2) + Math.random() * 5;
    data.push(Math.round(value));
  }

  updateDashboard(baseline);
}

function updateDashboard(baseline) {
  const labels = data.map((_, i) => "Day " + (i + 1));

  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.data.datasets[1].data = labels.map(() => baseline);

  chart.update();

  updateSummary(baseline);
  updateInsight();
  showUserInfo();
}

function showUserInfo() {
  if (!user) return;

  const div = document.getElementById("userInfo");

  div.innerHTML = `
    <strong>${user.username}</strong><br>
    Age: ${user.age} | ${user.gender}<br>
    Condition: ${user.condition}<br>
    Dominant Hand: ${user.hand}<br>
    Baseline: ${user.baseline}
  `;
}

function updateSummary(baseline) {
  const today = data[data.length - 1];
  const percent = ((today - baseline) / baseline) * 100;

  const summary = document.getElementById("summary");
  summary.className = "card";

  let status = "";
  let color = "";

  if (percent >= -10) {
    status = "Normal";
    color = "green";
  } else if (percent >= -25) {
    status = "Warning";
    color = "yellow";
  } else {
    status = "Critical";
    color = "red";
  }

  summary.classList.add(color);

  summary.innerHTML = `
    <h2>${today}</h2>
    Baseline: ${baseline}<br>
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
      ? "Grip strength is declining. Consider reducing strain."
      : "Grip strength is stable or improving.";
}