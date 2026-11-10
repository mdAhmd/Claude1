(function () {
  "use strict";

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Experience "show more" ---------- */
  document.querySelectorAll(".toggle").forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    var label = btn.querySelector("span");
    btn.addEventListener("click", function () {
      var open = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      if (label) label.textContent = open ? "Show less" : "Show more";
    });
  });

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Contact form ----------
     Works with no backend: opens the visitor's email app with the message
     pre-filled. To receive messages directly in your inbox instead, set
     FORM_ENDPOINT to a Formspree URL (https://formspree.io) — see README. */
  var FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/xxxxxxxx"
  var TO_EMAIL = "mohdahmedraza02@gmail.com";

  var form = document.getElementById("contact-form");
  if (form) {
    var note = document.getElementById("form-note");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        service: form.service.value,
        message: form.message.value.trim()
      };
      if (!data.name || !data.email || !data.message) {
        note.className = "form-note";
        note.textContent = "Please fill in your name, email and message.";
        return;
      }

      if (FORM_ENDPOINT) {
        note.className = "form-note";
        note.textContent = "Sending…";
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error("failed");
          form.reset();
          note.className = "form-note ok";
          note.textContent = "Thank you — your message has been sent.";
        }).catch(function () {
          note.className = "form-note";
          note.textContent = "Something went wrong. Please email me directly at " + TO_EMAIL + ".";
        });
        return;
      }

      var subject = "Project enquiry" + (data.service ? " — " + data.service : "") + " (" + data.name + ")";
      var body = data.message + "\n\n— " + data.name + "\n" + data.email;
      window.location.href = "mailto:" + TO_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      note.className = "form-note ok";
      note.textContent = "Opening your email app…";
    });
  }
})();
