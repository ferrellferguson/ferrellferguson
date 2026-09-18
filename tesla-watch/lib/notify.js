// Notification fan-out. Both channels are optional and independently enabled
// by whichever env vars you set — leave a channel's vars blank to skip it.

async function sendTelegram(text) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  if (!res.ok) {
    console.error("Telegram notify failed:", res.status, await res.text());
  }
}

async function sendEmail(subject, text) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from = process.env.NOTIFY_EMAIL_FROM;
  if (!apiKey || !to || !from) return;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, text }),
  });
  if (!res.ok) {
    console.error("Resend notify failed:", res.status, await res.text());
  }
}

function fmtMoney(n) {
  return n == null ? "?" : `$${Number(n).toLocaleString()}`;
}
function fmtMiles(n) {
  return n == null ? "?" : `${Number(n).toLocaleString()} mi`;
}

function carLine(car) {
  const orderUrl = `https://www.tesla.com/m3/order/${encodeURIComponent(car.vin)}`;
  return `${car.year} ${car.trim} — ${fmtMoney(car.price)} — ${fmtMiles(car.miles)} — ${car.hwVersion || "HW?"} — ${car.city || ""}\n${orderUrl}`;
}

async function notifyNewMatch(car) {
  const text = `🚗 New Model 3 match\n\n${carLine(car)}`;
  await Promise.all([sendTelegram(text), sendEmail("New Tesla Model 3 match", text)]);
}

async function notifyPriceDrop(car, oldPrice) {
  const text = `📉 Price drop: ${fmtMoney(oldPrice)} → ${fmtMoney(car.price)}\n\n${carLine(car)}`;
  await Promise.all([sendTelegram(text), sendEmail("Tesla Model 3 price drop", text)]);
}

module.exports = { notifyNewMatch, notifyPriceDrop };
