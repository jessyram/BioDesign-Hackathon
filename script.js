let chart;
let lastLength = 0;

async function loadData() {
  const res = await fetch("session_data.csv?t=" + new Date().getTime());
  const text = await res.text();

  return text.trim().split("\n").map(row => {
    const [timestamp, avg, duration] = row.split(",");

    return {
      time: new Date(timestamp),
      date: timestamp.split(" ")[0],
      avg: parseFloat(avg),
      duration: parseFloat(duration)
    };
  });
}

// 🔥 DAILY VIEW
async function loadDaily() {
  const data = await loadData();

  const today = new Date().toISOString().split("T")[0];
  const todayData = data.filter(d => d.date === today);

  todayData.sort((a, b) => a.time - b.time);

  const labels = todayData.map(d =>
    d.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  const values = todayData.map(d => d.avg);

  updateChart(labels, values, "Grip (kg) Today");

  const totalTime = todayData.reduce((sum, d) => sum + d.duration, 0);

  document.getElementById("summary").innerHTML =
    `⏱ ${Math.round(totalTime/60)} min today`;

  updateLiveStatus(todayData.length);
}

// 🔥 WEEKLY VIEW
async function loadWeekly() {
  const data = await loadData();

  let grouped = {};

  data.forEach(d => {
    if (!grouped[d.date]) {
      grouped[d.date] = { total: 0, count: 0 };
    }
    grouped[d.date].total += d.avg;
    grouped[d.date].count++;
  });

  const labels = Object.keys(grouped);
  const values = labels.map(d => grouped[d].total / grouped[d].count);

  updateChart(labels, values, "Daily Avg Grip (kg)");

  document.getElementById("summary").innerHTML = "📅 Weekly Trend";
}

// 🔥 LIVE STATUS
function updateLiveStatus(currentLength) {
  const status = document.getElementById("liveStatus");

  if (currentLength > lastLength) {
    status.innerText = "🔴 LIVE RECORDING...";
    status.classList.add("live");

    setTimeout(() => {
      status.innerText = "✅ Session saved";
      status.classList.remove("live");
    }, 1500);
  } else {
    status.innerText = "⚪ Idle";
    status.classList.remove("live");
  }

  lastLength = currentLength;
}

// 🔥 GRAPH UPDATE
function updateChart(labels, data, label) {
  const ctx = document.getElementById("chart").getContext("2d");

  if (!chart) {
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          borderColor: "#7b2cbf",
          backgroundColor: "#e0aaff",
          tension: 0.4
        }]
      },
      options: {
        animation: {
          duration: 800
        }
      }
    });
  } else {
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
  }
}

// AUTO REFRESH
setInterval(loadDaily, 2000);

// INITIAL LOAD
loadDaily();