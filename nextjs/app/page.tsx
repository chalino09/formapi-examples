"use client";
import { useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const endpoint = process.env.NEXT_PUBLIC_FORMAPI_ENDPOINT || "https://getformapi.com/f/YOUR_FORM_ID";
export default function Contact() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false), retry = useRef({ payload: "", key: "" });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (lock.current) return;
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const next: Record<string, string> = {};
    if (!payload.email.trim()) next.email = "Enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim()) || payload.email.length > 254) next.email = "Enter a valid email, such as alex@example.com.";
    if (!payload.message.trim()) next.message = "Write your message.";
    else if (payload.message.length > 5000) next.message = "Use no more than 5,000 characters.";
    setErrors(next); setStatus("");
    if (Object.keys(next).length) { (form.elements.namedItem(Object.keys(next)[0]) as HTMLElement).focus(); return; }
    if (endpoint.includes("YOUR_FORM_ID")) { setStatus("Set your FormAPI endpoint before sending."); return; }
    const body = JSON.stringify(payload);
    if (retry.current.payload !== body || !retry.current.key) retry.current = { payload: body, key: crypto.randomUUID() };
    lock.current = true; setBusy(true); setStatus("Sending your message…");
    try {
      const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json", "Idempotency-Key": retry.current.key }, body, signal: AbortSignal.timeout(20000) });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(response.status === 429 ? "This form reached a usage limit. Contact the owner another way." : response.status === 403 ? "This website is not allowed or a CAPTCHA check is required. Contact the owner." : "Could not send. Your message is preserved; try again.");
      form.reset(); retry.current = { payload: "", key: "" }; setStatus("Message received. Thank you.");
    } catch (error) { setStatus(error instanceof Error && !["TypeError", "TimeoutError", "AbortError"].includes(error.name) ? error.message : "Connection failed. Your message is preserved; try again."); }
    finally { lock.current = false; setBusy(false); }
  }
  return <main><h1>Let’s talk about your project.</h1><p>Send a message. We’ll get back to you by email.</p>
    <form onSubmit={submit} noValidate onInput={event => { const name = (event.target as HTMLInputElement).name; if (errors[name]) setErrors(current => ({ ...current, [name]: "" })); }}>
      <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(errors.email)} aria-describedby="email-error" /><p id="email-error" className="field-error">{errors.email}</p></div>
      <div><Label htmlFor="message">Message</Label><Textarea id="message" name="message" required maxLength={5000} aria-invalid={Boolean(errors.message)} aria-describedby="message-error" /><p id="message-error" className="field-error">{errors.message}</p></div>
      <input name="website" hidden tabIndex={-1} autoComplete="off" />
      <Button disabled={busy} type="submit">{busy ? "Sending…" : "Send message"}</Button><p role="status" aria-live="polite">{status}</p>
    </form>
  </main>;
}
