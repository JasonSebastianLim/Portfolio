// the infrared lens on the hero.
// mouse: follows you. touch: tap to drop it, doesnt fight the scroll. button: whole painting.

const hero = document.querySelector<HTMLElement>("[data-hero]");
const canvas = hero?.querySelector<HTMLElement>("[data-canvas]");
const layer = hero?.querySelector<HTMLElement>("[data-infrared]");
const toggle = hero?.querySelector<HTMLButtonElement>("[data-infrared-toggle]");

if (hero && canvas && layer && toggle) {
  let hideTimer = 0;
  const pinned = () => toggle.getAttribute("aria-pressed") === "true";

  const moveTo = (e: PointerEvent) => {
    const box = canvas.getBoundingClientRect();
    layer.style.setProperty("--lx", `${e.clientX - box.left}px`);
    layer.style.setProperty("--ly", `${e.clientY - box.top}px`);
    layer.dataset.state = pinned() ? "full" : "lens";
  };

  const close = () => {
    if (!pinned()) layer.dataset.state = "off";
  };

  hero.addEventListener("pointermove", (e) => {
    if (e.pointerType === "mouse") moveTo(e);
  });
  // lifting a finger counts as leaving too, only a mouse should close it here
  hero.addEventListener("pointerleave", (e) => {
    if (e.pointerType === "mouse") close();
  });

  // canvas sits behind the text so touches land on the hero, not on it
  hero.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "mouse" || (e.target as Element).closest("a, button")) return;
    moveTo(e);
    clearTimeout(hideTimer);
    hideTimer = window.setTimeout(close, 2600);
  });

  toggle.addEventListener("click", () => {
    const on = !pinned();
    toggle.setAttribute("aria-pressed", String(on));
    layer.dataset.state = on ? "full" : "off";
  });
}
