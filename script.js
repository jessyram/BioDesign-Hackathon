let chart;

async function loadData() {
  const response = await fetch("session_data.csv");
  const text = await response.text();

  return text.trim().split("\n").map(row => {
    const [timestamp, avg, duration] = row.split(",");

    return {
      date: timestamp.split(" ")[0],
      avg: parseFloat(avg),
      duration: parseFloat(duration)
    };
  });
}

// WEEKLY VIEW
async function loadWeekly() {
  const data = await loadData();

  let grouped = {};

  data.forEach(d => {
    if (!grouped[d.date]) {
      grouped[d.date] = { total: 0, count: 0, duration: 0 };
    }

    grouped[d.date].total += d.avg;
    grouped[d.date].count++;
    grouped[d.date].duration += d.duration;
  });

  const labels = Object.keys(grouped);
  const values = labels.map(d => grouped[d].total / grouped[d].count);

  renderChart(labels, values, "Weekly Avg Grip (kg)");

  document.getElementById("summary").innerHTML =
    "✨ Weekly performance trend";
}

// DAILY VIEW
async function loadDaily() {
  const data = await loadData();

  const today = new Date().toISOString().split("T")[0];

  const todayData = data.filter(d => d.date === today);

  const labels = todayData.map((_, i) => `Session ${i+1}`);
  const values = todayData.map(d => d.avg);

  const totalTime = todayData.reduce((sum, d) => sum + d.duration, 0);

  renderChart(labels, values, "Today's Sessions");

  document.getElementById("summary").innerHTML =
    `⏱ Time: ${Math.round(totalTime/60)} min`;
}

// GRAPH
function renderChart(labels, data, label) {
  const ctx = document.getElementById("chart").getContext("2d");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: label,
        data: data,
        borderColor: "#7b2cbf",
        backgroundColor: "#e0aaff",
        tension: 0.3
      }]
    }
  });
}

loadWeekly();