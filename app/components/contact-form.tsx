"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "../actions";

const initialState: ContactState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, initialState);

  if (state.status === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center py-12 text-center">
        <span className="mb-4 text-4xl">✅</span>
        <p className="mb-1 text-lg font-semibold text-foreground">
          Message sent
        </p>
        <p className="text-sm text-muted">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className={inputClass}
          placeholder="Your name"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-foreground"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className={`${inputClass} resize-none`}
          placeholder="What's on your mind?"
        />
      </div>
      {/* Honeypot for bots; hidden from people and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label htmlFor="company">Company</label>
        <input type="text" id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>
      {state.status === "error" && (
        <p className="text-sm text-red-500">
          {state.message} You can also email me at{" "}
          <a
            href="mailto:ferrellferguson@gmail.com"
            className="font-medium underline"
          >
            ferrellferguson@gmail.com
          </a>
          .
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="btn-glow w-full rounded-xl px-7 py-3.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
