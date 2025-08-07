document.addEventListener("DOMContentLoaded", () => {
  const habitBtn = document.querySelectorAll(".habit-btn");
  const addHabitBtn = document.querySelector(".add-btn");

  habitBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const response = await fetch("/api/ping");
      const data = await response.json();
      console.log(data.message);
      btn.classList.toggle("green");
    });
  });

  addHabitBtn.addEventListener("click", () => {
    console.log("click");
    newHabit();
  });
});

const newHabit = () => {
  const newHabitContainer = document.createElement("div");
  newHabitContainer.classList.add("newHabitContainer");

  const newHabitTitle = document.createElement("h3");
  newHabitTitle.textContent = "Add new habits !";

  const newHabitForm = document.createElement("form");

  const newHabitInput = document.createElement("input");
  newHabitInput.placeholder = "Add new habit";

  const newHabitBtn = document.createElement("button");
  newHabitBtn.textContent = "Add";

  newHabitForm.append(newHabitInput, newHabitBtn);
  newHabitContainer.append(newHabitTitle, newHabitForm);
  document.body.appendChild(newHabitContainer);
};
