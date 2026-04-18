import type { VercelRequest, VercelResponse } from "@vercel/node";

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const formidable = await import("formidable");
    const form = formidable.default({ maxFileSize: 10 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);

    const name = fields.name?.[0];
    const email = fields.email?.[0];
    const phone = fields.phone?.[0];
    const company = fields.company?.[0];
    const serviceType = fields.serviceType?.[0];
    const message = fields.message?.[0] || "—";

    if (!name || !email || !phone || !company || !serviceType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Build email attachments from invoice file
    const attachments: { filename: string; content: string; type: string }[] = [];
    const invoiceFile = files.invoice?.[0];
    if (invoiceFile && invoiceFile.size > 0) {
      const fs = await import("fs");
      const fileBuffer = fs.readFileSync(invoiceFile.filepath);
      attachments.push({
        filename: invoiceFile.originalFilename || "invoice",
        content: fileBuffer.toString("base64"),
        type: invoiceFile.mimetype || "application/octet-stream",
      });
    }

    // Send email via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "TASA Submissions <onboarding@resend.dev>",
        to: ["haccpaudit@gmail.com"],
        subject: `New Discount Request — ${company}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #0F172A; padding: 24px; border-radius: 8px 8px 0 0;">
              <h1 style="color: #10B981; margin: 0; font-size: 24px; letter-spacing: 0.1em;">TASA</h1>
              <p style="color: #94A3B8; margin: 4px 0 0; font-size: 12px;">New Discount Request Received</p>
            </div>
            <div style="border: 1px solid #E2E8F0; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; color: #64748B; font-size: 13px; width: 140px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748B; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; color: #64748B; font-size: 13px;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748B; font-size: 13px;">Company</td><td style="padding: 8px 0; font-weight: 600;">${company}</td></tr>
                <tr><td style="padding: 8px 0; color: #64748B; font-size: 13px;">Service</td><td style="padding: 8px 0;"><span style="background: #ECFDF5; color: #059669; padding: 2px 10px; border-radius: 20px; font-size: 13px;">${serviceType}</span></td></tr>
                <tr><td style="padding: 8px 0; color: #64748B; font-size: 13px; vertical-align: top;">Message</td><td style="padding: 8px 0;">${message}</td></tr>
                ${attachments.length > 0 ? `<tr><td style="padding: 8px 0; color: #64748B; font-size: 13px;">Invoice</td><td style="padding: 8px 0;"><span style="color: #10B981;">📎 ${attachments[0].filename}</span></td></tr>` : ""}
              </table>
            </div>
            <p style="color: #94A3B8; font-size: 11px; text-align: center; margin-top: 16px;">Simplifying Testing. Amplifying Safety. — tasa.solutions</p>
          </div>
        `,
        attachments: attachments.map(a => ({
          filename: a.filename,
          content: a.content,
        })),
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
