(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    revealContent();
    bindNewsletterForm();
  }

  function revealContent() {
    var container = document.querySelector(".coming-container");
    if (!container) return;

    requestAnimationFrame(function () {
      container.classList.add("is-visible");
    });
  }

  function bindNewsletterForm() {
    var form = document.querySelector(".coming-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var input = form.querySelector(".coming-form__input");
      var feedback = form.querySelector(".coming-form__feedback");
      var btn = form.querySelector(".coming-form__btn");
      var email = input ? input.value.trim() : "";

      if (!feedback) return;

      feedback.classList.remove("is-success", "is-error");

      if (!isValidEmail(email)) {
        feedback.textContent = "Veuillez entrer une adresse e-mail valide.";
        feedback.classList.add("is-error");
        return;
      }

      if (btn) btn.disabled = true;

      feedback.textContent = "Merci — nous vous contacterons bientôt.";
      feedback.classList.add("is-success");

      if (input) input.value = "";
      if (btn) btn.disabled = false;
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
})();
