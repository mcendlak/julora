(function () {
  "use strict";

  var header = document.getElementById("header");
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");

  // header: solid background after scrolling
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // mobile menu
  function setMenu(open) {
    document.body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Zamknij menu" : "Otwórz menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  burger.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("nav-open"));
  });
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  // reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // active menu link
  var links = nav.querySelectorAll(".nav__list a");
  var sections = Array.prototype.map.call(links, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });
  function markActive() {
    var pos = window.scrollY + window.innerHeight * 0.35;
    var current = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= pos) current = i; });
    links.forEach(function (a, i) { a.classList.toggle("is-active", i === current); });
  }
  markActive();
  window.addEventListener("scroll", markActive, { passive: true });

  // counters
  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var end = parseInt(el.getAttribute("data-count"), 10);
        var start = performance.now();
        var dur = 1400;
        (function tick(t) {
          var p = Math.min((t - start) / dur, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(tick);
        })(start);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = "0"; co.observe(el); });
  }

  // lightbox
  var lb = document.getElementById("lightbox");
  var lbImg = lb.querySelector("img");
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery__item"));
  var idx = 0;
  function show(i) {
    idx = (i + items.length) % items.length;
    lbImg.src = items[idx].getAttribute("data-full");
    lbImg.alt = items[idx].querySelector("img").alt;
  }
  function openLb(i) {
    show(i);
    lb.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  items.forEach(function (item, i) {
    item.addEventListener("click", function () { openLb(i); });
  });
  lb.querySelector(".lightbox__close").addEventListener("click", closeLb);
  lb.querySelector(".lightbox__prev").addEventListener("click", function () { show(idx - 1); });
  lb.querySelector(".lightbox__next").addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  // contact form
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form__status";

    var required = form.querySelectorAll("[required]");
    for (var i = 0; i < required.length; i++) {
      var f = required[i];
      var empty = f.type === "checkbox" ? !f.checked : !f.value.trim();
      if (empty) {
        status.textContent = f.type === "checkbox"
          ? "Zaznacz zgodę na przetwarzanie danych."
          : "Uzupełnij wymagane pola oznaczone gwiazdką.";
        status.classList.add("err");
        f.focus();
        return;
      }
    }

    // honeypot – bots tick the hidden checkbox
    if (form.elements.botcheck && form.elements.botcheck.checked) return;

    var btn = form.querySelector("button[type=submit]");
    btn.disabled = true;
    status.textContent = "Wysyłanie…";

    var data = new FormData(form);
    data.set("consent", data.get("consent") ? "tak" : "nie");

    fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        status.textContent = "Dziękujemy! Wiadomość została wysłana – odezwiemy się wkrótce.";
        status.classList.add("ok");
        form.reset();
      })
      .catch(function () {
        status.textContent = "Nie udało się wysłać wiadomości. Zadzwoń lub napisz: biuro@julora.pl";
        status.classList.add("err");
      })
      .finally(function () { btn.disabled = false; });
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
