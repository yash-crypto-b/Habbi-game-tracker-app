let habits = JSON.parse(localStorage.getItem("habits")) || [];

// Initialize Chart.js chart variable
let chart;

function addHabit() {
    const habitName = document.getElementById("habitName").value.trim();
    if (habitName === "") return alert("Please enter a habit name");

    habits.push({
        name: habitName,
        progress: 0,
        weeklyProgress: Array(7).fill(0) // store 7 days data
    });
    document.getElementById("habitName").value = "";
    saveHabits();
    renderHabits();
    updateChart(true);
}

function markProgress(index) {
    if (habits[index].progress < 100) {
        habits[index].progress += 10;
        if (habits[index].progress > 100) habits[index].progress = 100;
    }

    // Update today's weekly progress
    const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
    habits[index].weeklyProgress[today] += 10;
    if (habits[index].weeklyProgress[today] > 100) {
        habits[index].weeklyProgress[today] = 100;
    }

    saveHabits();
    renderHabits();
    updateChart(false); // false = animate update
}

function saveHabits() {
    localStorage.setItem("habits", JSON.stringify(habits));
}

function renderHabits() {
    const list = document.getElementById("habitList");
    list.innerHTML = "";
    habits.forEach((habit, index) => {
        const weekBars = habit.weeklyProgress
            .map((val, dayIndex) => {
                return `<div class="week-bar" style="height:${val}%; background-color:#3b82f6" title="Day ${dayIndex}: ${val}%"></div>`;
            })
            .join("");

        list.innerHTML += `
            <div class="habit">
                <span>${habit.name} - ${habit.progress}%</span>
                <div class="weekly-progress">${weekBars}</div>
                <button onclick="markProgress(${index})">+10%</button>
            </div>
        `;
    });
}

function updateChart(initial) {
    const ctx = document.getElementById("progressChart").getContext("2d");
    const data = {
        labels: habits.map(h => h.name),
        datasets: [{
            data: habits.map(h => h.progress),
            backgroundColor: ["#22c55e", "#3b82f6", "#f97316", "#ef4444", "#a855f7"]
        }]
    };

    if (initial || !chart) {
        // First time or after adding habit
        chart = new Chart(ctx, {
            type: "pie",
            data: data,
            options: {
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 800
                }
            }
        });
    } else {
        // Update chart smoothly
        chart.data = data;
        chart.update({
            duration: 800,
            easing: 'easeOutBounce'
        });
    }
}

// Initial load
renderHabits();
updateChart(true);
