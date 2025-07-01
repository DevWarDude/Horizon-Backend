import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://pphzxxakslzzjaqfyhqm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwaHp4eGFrc2x6emphcWZ5aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAyNDg3MTQsImV4cCI6MjA2NTgyNDcxNH0.svBSpIWEhhKRLLCUJVHKPZvQnAD7x-LrWHGLdwtT-L0"
);

export default async function handler(req, res) {
  const { email, code } = req.body;

  const { data, error } = await supabase
    .from("verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .single();

  if (error || !data) {
    return res.status(401).json({ error: "Invalid code" });
  }

  await supabase.from("profiles").update({ verified: true }).eq("email", email);

  return res.status(200).json({ message: "Verified successfully" });
}
