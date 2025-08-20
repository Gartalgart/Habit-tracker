export default class NewHabit {
  constructor() {
    this.document = document;
    this.newHabitContainer = document.createElement("div");
    this.newHabitContainer.classList.add("newHabitContainer", "circle");

    this.newHabitTitle = document.createElement("h3");
    this.newHabitTitle.textContent = "Add new habits !";

    this.newHabitForm = document.createElement("form");
    this.newHabitForm.method = "POST";
    this.newHabitForm.action = "/";

    this.newHabitInput = document.createElement("input");
    this.newHabitInput.placeholder = "Add new habit";
    this.newHabitInput.name = "title";

    this.newHabitBtn = document.createElement("button");
    this.newHabitBtn.textContent = "Add";
    this.newHabitBtn.type = "submit";
  }

  displayNewHabit() {
    this.newHabitForm.append(this.newHabitInput, this.newHabitBtn);
    this.newHabitContainer.append(this.newHabitTitle, this.newHabitForm);
    this.document.body.appendChild(this.newHabitContainer);
  }

  closeNewHabit() {
    this.document.body.removeChild(this.newHabitContainer);
  }
}
