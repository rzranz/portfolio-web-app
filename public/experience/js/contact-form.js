(function () {
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = (form.elements.name && form.elements.name.value || "").trim();
    var email = (form.elements.email && form.elements.email.value || "").trim();
    var msg = (form.elements.message && form.elements.message.value || "").trim();

    if (!name || !email || !msg) return;

    var subject = encodeURIComponent("Portfolio Inquiry from " + name);
    var body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + msg);
    window.location.href = "mailto:randizakariaputra22@gmail.com?subject=" + subject + "&body=" + body;

    if (status) {
      status.textContent = "Opening mail client...";
    }
    form.reset();
  });
})();
