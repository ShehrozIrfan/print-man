/* ==========================================================
   Print Man - site behaviour
   Edit CONFIG below to change the WhatsApp number site-wide.
   (Number in international format, digits only, no + or spaces.)
   ========================================================== */

const CONFIG = {
  whatsappNumber: "923111151411",
  defaultMessage: "Hi Print Man, I'd like a printing quote.",
};

function waLink(message) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/* ---------- 1. WhatsApp links with pre-filled messages ---------- */
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.href = waLink(el.dataset.wa || CONFIG.defaultMessage);
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});

/* ---------- 2. Mobile menu ---------- */
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
const iconOpen = document.getElementById("menu-open");
const iconClose = document.getElementById("menu-close");

function setMenu(open) {
  mobileMenu.classList.toggle("hidden", !open);
  iconOpen.classList.toggle("hidden", open);
  iconClose.classList.toggle("hidden", !open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", () => {
  setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
});
mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});
window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

/* ---------- 3. Header shadow on scroll ---------- */
const header = document.getElementById("site-header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- 4. Quote form -> WhatsApp ---------- */
const form = document.getElementById("quote-form");
const errorEl = document.getElementById("form-error");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = form.elements.name.value.trim();
  const product = form.elements.product.value.trim();
  const qty = form.elements.qty.value.trim();
  const details = form.elements.details.value.trim();

  form.elements.name.classList.toggle("is-invalid", !name);
  form.elements.product.classList.toggle("is-invalid", !product);

  if (!name || !product) {
    errorEl.classList.remove("hidden");
    (name ? form.elements.product : form.elements.name).focus();
    return;
  }
  errorEl.classList.add("hidden");

  const lines = [
    "Hi Print Man, I'd like a quote.",
    "",
    `Name: ${name}`,
    `Product: ${product}`,
  ];
  if (qty) lines.push(`Quantity / size: ${qty}`);
  if (details) lines.push(`Details: ${details}`);

  window.open(waLink(lines.join("\n")), "_blank", "noopener");
});

/* ---------- 5. Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
