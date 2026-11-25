import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ADMIN_EMAIL, supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { BLACK, GOLD, WHITE, glass, goldButton, inputStyle, labelStyle } from "@/lib/theme";

export default function AdminLogin() {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  if (!loading && session && isAdmin) return <Navigate to="/admin" replace />;

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setMsg({ type: "err", text: "This Gmail is not an administrator account." });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password });
    setBusy(false);
    if (error) {
      setMsg({ type: "err", text: "Email or password is incorrect." });
      return;
    }
    navigate("/admin", { replace: true });
  };

  const onForgot = async () => {
    setMsg(null);
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
      redirectTo: `${window.location.origin}/admin/reset`,
    });
    setBusy(false);
    setMsg(
      error
        ? { type: "err", text: "Could not send reset email. Try again later." }
        : { type: "ok", text: `A password reset link was sent to ${ADMIN_EMAIL}.` },
    );
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={onLogin} style={{ ...glass, borderRadius: 26, padding: 28, width: "min(420px, 100%)", display: "grid", gap: 16 }}>
        <h1 style={{ fontFamily: "Georgia, serif", color: GOLD, margin: 0, textAlign: "center" }}>Admin Login</h1>

        <div>
          <label style={labelStyle} htmlFor="email">Gmail address</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" style={inputStyle} autoComplete="username" />
        </div>
        <div>
          <label style={labelStyle} htmlFor="password">Password</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} autoComplete="current-password" />
        </div>

        {msg && (
          <p style={{ margin: 0, fontSize: 14, color: msg.type === "ok" ? GOLD : "#ff8a8a" }}>{msg.text}</p>
        )}

        <button type="submit" disabled={busy} style={{ ...goldButton, opacity: busy ? 0.7 : 1 }}>
          {busy ? "Please wait…" : "SIGN IN"}
        </button>
        <button type="button" onClick={onForgot} disabled={busy} style={{ background: "none", border: "none", color: GOLD, cursor: "pointer", textDecoration: "underline" }}>
          Forgot password?
        </button>
      </form>
    </div>
  );
}

export const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: BLACK,
  color: WHITE,
  display: "grid",
  placeItems: "center",
  padding: 16,
  fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
};
