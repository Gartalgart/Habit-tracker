export default class Connect {
  constructor() {
    this.document = document;
    this.connectContainer = document.createElement("div");
    this.connectContainer.classList.add("connectContainer", "circle");

    this.connectTitle = document.createElement("h1");
    this.connectTitle.classList.add("connectTitle");
    this.connectTitle.textContent = "Login";

    this.connectForm = document.createElement("form");
    this.connectForm.classList.add("connectForm");

    this.mailInput = document.createElement("input");
    this.mailInput.classList.add("mailInput");
    this.mailInput.placeholder = "Email";
    this.mailInput.type = "email";

    this.passwordInput = document.createElement("input");
    this.passwordInput.classList.add("passwordInput");
    this.passwordInput.placeholder = "Password";
    this.passwordInput.type = "password";

    this.confirmPasswordInput = document.createElement("input");
    this.confirmPasswordInput.classList.add("confirmPasswordInput");
    this.confirmPasswordInput.placeholder = "Confirm password";
    this.confirmPasswordInput.type = "password";

    this.toggleBtn = document.createElement("btn");
    this.toggleBtn.classList.add("toggleBtn");

    this.toggleBtn2 = document.createElement("btn");
    this.toggleBtn2.classList.add("toggleBtn");

    this.icon = document.createElement("i");
    this.icon.classList.add("fa-solid", "fa-eye");

    this.icon2 = document.createElement("i");
    this.icon2.classList.add("fa-solid", "fa-eye");

    this.account = this.document.createElement("button");
    this.account.classList.add("account");
    this.account.textContent = "Don't have account ?";

    this.submitBtn = document.createElement("button");
    this.submitBtn.classList.add("submitBtn");
    this.submitBtn.textContent = "Submit";
    this.submitBtn.type = "submit";
  }

  displayConnect() {
    this.connectContainer.append(
      this.connectTitle,
      this.connectForm,
      this.account
    );
    this.connectForm.append(
      this.mailInput,
      this.passwordInput,
      this.toggleBtn,
      this.submitBtn
    );
    this.toggleBtn.appendChild(this.icon);
    this.document.body.appendChild(this.connectContainer);
  }

  register() {
    let isRegister = false;

    this.account.addEventListener("click", () => {
      if (!isRegister) {
        this.connectTitle.textContent = "Register";
        this.connectForm.insertBefore(
          this.confirmPasswordInput,
          this.connectForm.children[2]
        );
        this.connectForm.insertBefore(
          this.toggleBtn2,
          this.connectForm.children[3]
        );
        this.toggleBtn2.appendChild(this.icon2);
        this.account.textContent = "Already have account ?";

        this.connectContainer.style.width = "350px";
        this.connectContainer.style.height = "350px";
        this.connectContainer.animate(
          [
            { width: "300px", height: "300px" }, // état initial
            { width: "350px", height: "350px" }, // état final
          ],
          {
            duration: 300, // en ms (équivalent à 0.3s)
            easing: "ease", // courbe d’animation
            fill: "forwards", // conserve l’état final
          }
        );

        this.connectForm.children[4].style.top = "41%";
        this.connectForm.children[4].style.right = "26%";

        this.connectForm.children[3].style.top = "56%";
        this.connectForm.children[3].style.right = "26%";

        isRegister = true;
      } else {
        this.connectTitle.textContent = "Login";
        this.connectForm.removeChild(this.confirmPasswordInput);
        this.connectForm.removeChild(this.toggleBtn2);
        this.account.textContent = "Don't have account ? ";
        this.connectContainer.animate(
          [
            { width: "350px", height: "350px" }, // état initial
            { width: "300px", height: "300px" }, // état final
          ],
          {
            duration: 300, // en ms (équivalent à 0.3s)
            easing: "ease", // courbe d’animation
            fill: "forwards", // conserve l’état final
          }
        );
        this.connectForm.children[2].style.top = "48%";
        this.connectForm.children[2].style.right = "22%";
        isRegister = false;
      }
    });
  }

  toggleEyePassWord() {
    this.toggleBtn.addEventListener("click", () => {
      const isPassword = this.passwordInput.type === "password";
      this.passwordInput.type = isPassword ? "text" : "password";

      this.icon.classList.toggle("fa-eye", !isPassword);
      this.icon.classList.toggle("fa-eye-slash", isPassword);
    });

    this.toggleBtn2.addEventListener("click", () => {
      const isPassword = this.confirmPasswordInput.type === "password";
      this.confirmPasswordInput.type = isPassword ? "text" : "password";

      this.icon2.classList.toggle("fa-eye", !isPassword);
      this.icon2.classList.toggle("fa-eye-slash", isPassword);
    });
  }

  disconned() {
    this.document.body.removeChild(this.connectContainer);
  }
}
