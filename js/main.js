/* ===================================================================
   PRINT MAN COMMUNICATION — main.js
   Vanilla JS. No dependencies. Handles: loader, navbar scroll state,
   mobile menu, scroll-reveal, animated counters, FAQ accordion,
   back-to-top, current-year stamp.
=================================================================== */
(function () {
  "use strict";

  /* ---------- Loading screen ---------- */
  window.addEventListener("load", function () {
    var loader = document.querySelector(".loader");
    if (loader) {
      setTimeout(function () { loader.classList.add("hide"); }, 300);
    }
  });

  /* ---------- Navbar scrolled state ---------- */
  var navbar = document.querySelector(".navbar");
  function onScroll() {
    if (!navbar) return;
    if (window.scrollY > 12) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    toggleBackToTop();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var hamburger = document.querySelector(".hamburger");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
  if ("IntersectionObserver" in window && revealEls.length) {
    revealEls.forEach(function (el, i) {
      el.style.setProperty("--d", (i % 6) * 80 + "ms");
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1400;
    var start = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window && counters.length) {
    var counterIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach(function (el) { counterIO.observe(el); });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq-item.open").forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove("open");
          openItem.querySelector(".faq-a").style.maxHeight = null;
          openItem.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        a.style.maxHeight = null;
        q.setAttribute("aria-expanded", "false");
      } else {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector(".fab-top");
  function toggleBackToTop() {
    if (!backToTop) return;
    if (window.scrollY > 480) backToTop.classList.add("show");
    else backToTop.classList.remove("show");
  }
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Smooth scroll for in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var offset = 84;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: "smooth" });
      }
    });
  });
})();
