import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false, // We handle multipart manually
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parse multipart form data using the Web Streams API
    const contentType = req.headers["content-type"] || "";
    if (!contentType.includes("multipart/form-data")) {
      return res.status(400).json({ error: "Expected multipart/form-data" });
    }

    // Use formidable for multipart parsing
    const formidable = await import("formidable");
    const form = formidable.default({ maxFileSize: 10 * 1024 * 1024 }); // 10MB limit

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

    // Upload invoice to Vercel Blob if provided
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

    // Ensure table exists
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

    // Insert submission
    const result = await sql`
      INSERT INTO submissions (name, email, phone, company, service_type, message, invoice_file_name, invoice_file_url, status)
      VALUES (${name}, ${email}, ${phone}, ${company}, ${serviceType}, ${message}, ${invoiceFileName}, ${invoiceFileUrl}, 'pending')
      RETURNING id
    `;

    return res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Submit error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
