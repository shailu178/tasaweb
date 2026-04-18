import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { put } from "@vercel/blob";

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
    const message = fields.message?.[0] || null;

    if (!name || !email || !phone || !company || !serviceType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let invoiceFileName: string | null = null;
    let invoiceFileUrl: string | null = null;

    const invoiceFile = files.invoice?.[0];
    if (invoiceFile && invoiceFile.size > 0) {
      const fs = await import("fs");
      const fileBuffer = fs.readFileSync(invoiceFile.filepath);
      const ext = invoiceFile.originalFilename?.split(".").pop() || "pdf";
      const blobKey = `invoices/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const blob = await put(blobKey, fileBuffer, {
        access: "public",
        contentType: invoiceFile.mimetype || "application/octet-stream",
      });

      invoiceFileName = invoiceFile.originalFilename || blobKey;
      invoiceFileUrl = blob.url;
    }

    const sql = neon(process.env.DATABASE_URL!);

    await sql`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        company TEXT NOT NULL,
        service_type TEXT NOT NULL,
        message TEXT,
        invoice_file_name TEXT,
        invoice_file_url TEXT,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const result = await sql`
      INSERT INTO submissions (name, email, phone, company, service_type, message, invoice_file_name, invoice_file_url, status)
      VALUES (${name}, ${email}, ${phone}, ${company}, ${serviceType}, ${message}, ${invoiceFileName}, ${invoiceFileUrl}, 'pending')
      RETURNING id
    `;

    return res.status(200).json({ success: true, id: result[0].id });
  } catch (err) {
    console.error("Submit error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
