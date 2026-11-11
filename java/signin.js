function showForm(form) {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const tabs = document.querySelectorAll(".tab");
  
    if (form === "login") {
      loginForm.classList.remove("hidden");
      registerForm.classList.add("hidden");
      tabs[0].classList.add("active");
      tabs[1].classList.remove("active");
    } else {
      loginForm.classList.add("hidden");
      registerForm.classList.remove("hidden");
      tabs[0].classList.remove("active");
      tabs[1].classList.add("active");
    }
  }
  