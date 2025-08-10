export const newHabit = () => {
  const newHabitContainer = document.createElement("div");
  newHabitContainer.classList.add("newHabitContainer");

  const closeSpan = document.createElement("span");
  closeSpan.classList.add("fa-solid", "fa-xmark");

  const newHabitTitle = document.createElement("h3");
  newHabitTitle.textContent = "Add new habits !";

  const newHabitForm = document.createElement("form");
  newHabitForm.method = "POST";
  newHabitForm.action = "/";

  const newHabitInput = document.createElement("input");
  newHabitInput.placeholder = "Add new habit";
  newHabitInput.name = "title";

  const newHabitBtn = document.createElement("button");
  newHabitBtn.textContent = "Add";
  newHabitBtn.type = "submit";

  newHabitForm.append(newHabitInput, newHabitBtn);
  newHabitContainer.append(newHabitTitle, closeSpan, newHabitForm);
  document.body.appendChild(newHabitContainer);

  closeSpan.addEventListener("click", () => {
    document.body.removeChild(newHabitContainer);
  });
};
