import { Resend } from "resend";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Missing RESEND_API_KEY" });

  const {
    to: realTo,
    subject,
    htmlContent,
  } = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

  if (!realTo || !subject || !htmlContent) {
    return res.status(400).json({
      error: "Missing data",
      received: { to: realTo, subject, htmlContent },
    });
  }

  // --- MODO TEST --------------------------------------------------
  // Si RESEND_TEST_EMAIL está definido, forzamos el envío a esa dirección
  // y ponemos el destinatario real dentro del subject para pruebas.
  const testEmail = process.env.RESEND_TEST_EMAIL;
  const to =
    testEmail && process.env.VERCEL_ENV !== "production" ? testEmail : realTo;
  const finalSubject =
    testEmail && process.env.VERCEL_ENV !== "production"
      ? `[TEST → ${realTo}] ${subject}`
      : subject;
  //----------------------------------------------------------------

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: "JRaffle Company <onboarding@resend.dev>",
      to,
      subject: finalSubject,
      html: htmlContent,
    });
    if (result.error)
      return res.status(400).json({ error: result.error.message });
    res.status(200).json({ success: true, id: result.data?.id });
  } catch (err) {
    console.error("Resend fail", err);
    res.status(500).json({ error: "Server error", message: err?.message });
  }
}
