(function () {
  "use strict";

  var menuButton = document.querySelector(".menu-toggle");
  var navigation = document.querySelector(".primary-nav");

  function closeMenu() {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    navigation.setAttribute("data-open", "false");
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      navigation.setAttribute("data-open", String(!isOpen));
    });
    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeMenu();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 780) closeMenu();
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  document.querySelectorAll("[data-email-form]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      var recipient = form.getAttribute("data-recipient") || "icat19999@gmail.com";
      var fields = Array.from(form.querySelectorAll("input[name], select[name], textarea[name]"));
      var subject = form.getAttribute("data-subject") || "ICAT enquiry";
      var body = fields.map(function (field) {
        var label = form.querySelector('label[for="' + field.id + '"]');
        var value = field.value.trim();
        return value ? (label ? label.textContent.trim() : field.name) + ": " + value : "";
      }).filter(Boolean).join("\n");

      var status = form.querySelector("[data-form-status]");
      if (status) status.textContent = "Your email app should open with the request prepared. Please review it and press Send there.";

      window.location.href = "mailto:" + recipient +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  });
}());
