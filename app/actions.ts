"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function sendContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field
  if (formData.get("company")) return { status: "success" };

  const name = String(formData.get("name") ?? "").trim().slice(0, 200);
  const email = String(formData.get("email") ?? "").trim().slice(0, 200);
  const message = String(formData.get("message") ?? "").trim().slice(0, 5000);

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill out every field." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "That email address doesn't look right." };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM ?? "Website Contact <onboarding@resend.dev>";
  if (!apiKey || !to) {
    console.error("Contact form not configured: set RESEND_API_KEY and CONTACT_EMAIL_TO");
    return { status: "error", message: "The form isn't working right now." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: email,
      subject: `ferrellferguson.com: message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });
  if (!res.ok) {
    console.error("Contact form send failed:", res.status, await res.text());
    return { status: "error", message: "The form isn't working right now." };
  }

  return { status: "success" };
}
