import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import Cors from "cors";

const cors = Cors({
  origin: ["http://localhost:5173"],
  methods: ["POST", "OPTIONS"],
  credentials: true,
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

const resend = new Resend("re_GcQkKSpb_AwdsDqYNGU5v5W7QjLVLZ5bX");
const supabase = createClient(
  "https://pphzxxakslzzjaqfyhqm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwaHp4eGFrc2x6emphcWZ5aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDg3MTQsImV4cCI6MjA2NTgyNDcxNH0.svBSpIWEhhKRLLCUJVHKPZvQnAD7x-LrWHGLdwtT-L0"
);

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await supabase.from("verification_codes").insert([{ email, code }]);

  await resend.emails.send({
    from: "Horizon <noreply@horizon.com>",
    to: email,
    subject: "Your Verification Code",
    html: `<p>Your Horizon code is: <strong>${code}</strong></p>`,
  });

  console.log("Email:", email);
  console.log("Code:", code);

  res.status(200).json({ message: `Code sent ${code} ${email}` });
}
