let data = [];

const ctx = document.getElementById('chart').getContext('2d');

const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Grip Strength',
        data: [],
        borderWidth: 3,
        tension: 0.3
      },
      {
        label: 'Baseline',
        data: [],
        borderDash: [6,6]
      }
    ]
  },
  options: {
    plugins: {
      legend: { display: true }
    }
  }
});

function generateData() {
  data = [];

  let baseline = Math.floor(Math.random() * 20) + 80;

  for (let i = 0; i < 10; i++) {
    let value = baseline - (i * 2) + Math.random() * 5;
    data.push(Math.round(value));
  }

  updateDashboard();
}

function updateDashboard() {
  const labels = data.map((_, i) => "Day " + (i + 1));
  const baseline = avg(data.slice(0, 3));

  chart.data.labels = labels;
  chart.data.datasets[0].data = data;
  chart.data.datasets[1].data = labels.map(() => baseline);

  chart.update();

  updateSummary(baseline);
  updateInsight(baseline);
}

function updateSummary(baseline) {
  const today = data[data.length - 1];
  const percent = ((today - baseline) / baseline) * 100;

  const summary = document.getElementById("summary");
  summary.className = "card";

  let status = "";
  let emoji = "";

  if (percent >= -10) {
    status = "Normal";
    emoji = "🟢";
    summary.classList.add("green");
  } else if (percent >= -25) {
    status = "Warning";
    emoji = "🟡";
    summary.classList.add("yellow");
  } else {
    status = "Critical";
    emoji = "🔴";
    summary.classList.add("red");
  }

  summary.innerHTML = `
    <h2>${emoji} ${today}</h2>
    <p><strong>Baseline:</strong> ${baseline.toFixed(1)}</p>
    <p><strong>Change:</strong> ${percent.toFixed(1)}%</p>
    <p><strong>Status:</strong> ${status}</p>
  `;
}

function updateInsight(baseline) {
  const today = data[data.length - 1];
  const yesterday = data[data.length - 2];

  let message = "";

  if (today < yesterday) {
    message = "Your grip strength is decreasing. Consider rest or reduced strain.";
  } else {
    message = "Your grip strength is stable or improving.";
  }

  document.getElementById("insight").innerText = message;
}

function avg(arr) {
  return arr.reduce((a,b) => a + b, 0) / arr.length;
}

// Load initial data
generateData();