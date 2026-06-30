/* ===================================================================
   PRINT MAN COMMUNICATION — slider.js
   Lightweight testimonial slider. No dependencies.
=================================================================== */
(function () {
  "use strict";

  var slider = document.querySelector("[data-slider]");
  if (!slider) return;

  var track = slider.querySelector(".slider-track");
  var slides = slider.querySelectorAll(".slide");
  var navWrap = slider.querySelector(".slider-nav");
  var prevBtn = slider.querySelector(".slider-arrow.prev");
  var nextBtn = slider.querySelector(".slider-arrow.next");
  var index = 0;
  var total = slides.length;
  var timer = null;
  var AUTOPLAY_MS = 5500;

  if (!total) return;

  /* build dots */
  if (navWrap) {
    for (var i = 0; i < total; i++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      if (i === 0) dot.classList.add("active");
      (function (idx) {
        dot.addEventListener("click", function () { goTo(idx); restart(); });
      })(i);
      navWrap.appendChild(dot);
    }
  }
  var dots = navWrap ? navWrap.querySelectorAll("button") : [];

  function render() {
    track.style.transform = "translateX(-" + index * 100 + "%)";
    dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
  }

  function goTo(i) {
    index = (i + total) % total;
    render();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
  if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

  function autoplay() {
    timer = setInterval(next, AUTOPLAY_MS);
  }
  function restart() {
    clearInterval(timer);
    autoplay();
  }

  /* pause on hover/focus */
  slider.addEventListener("mouseenter", function () { clearInterval(timer); });
  slider.addEventListener("mouseleave", autoplay);

  /* basic touch swipe */
  var startX = null;
  slider.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx > 0 ? prev() : next(); restart(); }
    startX = null;
  }, { passive: true });

  render();
  autoplay();
})();
