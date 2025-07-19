let time = 60;
let tabs = 0;

const timer = document.getElementById("timer");
const form = document.getElementById("examForm");

const countdown = setInterval(() => {
  time--;
  timer.textContent = `Time Left: ${time}s`;
  if (time <= 0) {
    clearInterval(countdown);
    alert("Time's up! Submitting exam.");
    form.submit();
  }
}, 1000);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    tabs++;
    if (tabs >= 2) {
      alert("Tab switch detected. Submitting exam.");
      form.submit();
    }
  }
});
