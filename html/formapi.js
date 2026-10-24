const form = document.querySelector("#contact");
const status = document.querySelector("#status");
const button = form.querySelector("button");
let pending = false, previous = "", key = "";
const fields = ["email", "message"];
function errorFor(name) {
  const input = form.elements.namedItem(name);
  if (!input.value.trim()) return name === "email" ? "Enter your email." : "Write your message.";
  if (name === "email" && (input.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim()))) return "Enter a valid email, such as alex@example.com.";
  if (input.value.length > (name === "email" ? 254 : 5000)) return "Please shorten this field.";
  return "";
}
function validate(name) {
  const input = form.elements.namedItem(name), error = errorFor(name);
  input.setAttribute("aria-invalid", String(Boolean(error)));
  document.getElementById(name + "-error").textContent = error;
  return !error;
}
for (const name of fields) form.elements.namedItem(name).addEventListener("input", () => {
  if (form.elements.namedItem(name).getAttribute("aria-invalid") === "true") validate(name);
});
form.addEventListener("submit", async event => {
  event.preventDefault(); if (pending) return;
  status.textContent = "";
  const invalid = fields.filter(name => !validate(name));
  if (invalid.length) { form.elements.namedItem(invalid[0]).focus(); return; }
  if (form.action.includes("YOUR_FORM_ID")) { status.textContent = "Set your FormAPI endpoint before sending."; return; }
  const payload = JSON.stringify(Object.fromEntries(new FormData(form)));
  if (payload !== previous || !key) { key = crypto.randomUUID(); previous = payload; }
  pending = true; button.disabled = true; button.textContent = "Sending…"; status.textContent = "Sending your message…";
  try {
    const response = await fetch(form.action, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", "Idempotency-Key": key }, body: payload, signal: AbortSignal.timeout(20000) });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error(response.status === 429 ? "This form reached a usage limit. Please contact the owner another way." : response.status === 403 ? "This website is not allowed or a CAPTCHA check is required. Contact the owner." : "Could not send. Your message is preserved; try again.");
    form.reset(); key = ""; previous = ""; status.textContent = "Message received. Thank you.";
  } catch (error) { status.textContent = error instanceof Error && !["TypeError", "TimeoutError", "AbortError"].includes(error.name) ? error.message : "Connection failed. Your message is preserved; try again."; }
  finally { pending = false; button.disabled = false; button.textContent = "Send message"; }
});
