const root = document.documentElement;
const button = document.querySelector<HTMLButtonElement>("[data-theme-switch]");
const hint = button?.querySelector("[data-theme-hint]");

function label() {
  if (hint) hint.textContent = `, switch to ${root.dataset.theme === "night" ? "day" : "night"}`;
}

function flip() {
  const next = root.dataset.theme === "night" ? "day" : "night";
  root.dataset.theme = next;
  label();
  try {
    localStorage.setItem("theme", next);
  } catch {
    // private mode, it just wont remember
  }
}

button?.addEventListener("click", () => {
  if (document.startViewTransition) document.startViewTransition(flip);
  else flip();
});

label();
