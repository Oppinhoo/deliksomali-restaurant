import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { GOLD, glass, goldButton, inputStyle, labelStyle } from "@/lib/theme";
import { pageStyle } from "@/pages/AdminLogin";

export default function AdminReset() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError("Could not update password. Open the reset link again.");
    navigate("/admin", { replace: true });
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={onSubmit} style={{ ...glass, borderRadius: 26, padding: 28, width: "min(420px, 100%)", display: "grid", gap: 16 }}>
        <h1 style={{ fontFamily: "Georgia, serif", color: GOLD, margin: 0, textAlign: "center" }}>New Password</h1>
        <div>
          <label style={labelStyle} htmlFor="np">New password</label>
          <input id="np" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="cp">Confirm password</label>
          <input id="cp" type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} style={inputStyle} />
        </div>
        {error && <p style={{ margin: 0, color: "#ff8a8a", fontSize: 14 }}>{error}</p>}
        <button type="submit" disabled={busy} style={goldButton}>{busy ? "Saving…" : "SAVE PASSWORD"}</button>
      </form>
    </div>
  );
}
