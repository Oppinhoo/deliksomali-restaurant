import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { MoreVertical, MessageCircle, Phone, MapPin, Clock, Mail } from "lucide-react";
import { useSettings } from "@/hooks/useSiteData";
import { useAuth } from "@/hooks/useAuth";
import { BLACK, GOLD, WHITE, glass, goldButton } from "@/lib/theme";

const waLink = (num: string) => `https://wa.me/${num.replace(/\D/g, "")}`;

export default function SiteLayout() {
  const { data } = useSettings();
  const { isAdmin, session, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const contact = data?.contact;

  const linkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? GOLD : WHITE,
    textDecoration: "none",
    fontWeight: 600,
    letterSpacing: "0.05em",
    padding: "8px 14px",
    borderRadius: 999,
    transition: "color .2s ease, background .2s ease",
    background: isActive ? "rgba(212,175,55,0.12)" : "transparent",
  });

  return (
    <div style={{ minHeight: "100vh", background: BLACK, color: WHITE, fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif" }}>
      <header
        style={{
          ...glass,
          position: "sticky",
          top: 0,
          zIndex: 50,
          margin: "10px auto 0",
          width: "min(1200px, calc(100% - 24px))",
          borderRadius: 22,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: GOLD }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: `1px solid ${GOLD}`,
              display: "grid",
              placeItems: "center",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
            }}
          >
            D
          </span>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 20, letterSpacing: "0.08em" }}>DILEK SOMALIA® </span>
        </Link>

        <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <NavLink to="/" end style={linkStyle}>Home</NavLink>
          <NavLink to="/menu" style={linkStyle}>Menu</NavLink>
        </nav>

        <div style={{ position: "relative" }}>
          <button
            aria-label="Admin menu"
            onClick={() => setMenuOpen((v) => !v)}
            style={{
              ...glass,
              width: 42,
              height: 42,
              borderRadius: "50%",
              color: GOLD,
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
            }}
          >
            <MoreVertical size={20} />
          </button>
          {menuOpen && (
            <div
              style={{
                ...glass,
                position: "absolute",
                right: 0,
                top: 50,
                minWidth: 200,
                borderRadius: 16,
                padding: 8,
                background: "rgba(8,8,8,0.9)",
              }}
            >
              {isAdmin ? (
                <>
                  <button style={menuItemStyle} onClick={() => { setMenuOpen(false); navigate("/admin"); }}>
                    Admin Dashboard
                  </button>
                  <button style={menuItemStyle} onClick={async () => { setMenuOpen(false); await signOut(); }}>
                    Logout
                  </button>
                </>
              ) : (
                <button style={menuItemStyle} onClick={() => { setMenuOpen(false); navigate("/admin/login"); }}>
                  Admin Login
                </button>
              )}
              {session && !isAdmin && (
                <div style={{ fontSize: 12, color: "#aaa", padding: "6px 12px" }}>Not an admin account</div>
              )}
            </div>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer style={{ marginTop: 60, borderTop: "1px solid rgba(212,175,55,0.2)", background: "#050505" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 20px",
            display: "grid",
            gap: 24,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div>
            <h3 style={{ fontFamily: "Georgia, serif", color: GOLD, letterSpacing: "0.08em" }}>DILEK RESTAURANT </h3>
            <p style={{ color: "#bbb", lineHeight: 1.6 }}>Refined cuisine, handcrafted cakes and artisan drinks.</p>
          </div>
          <div style={{ display: "grid", gap: 10, color: "#ddd" }}>
            {contact?.address && <div style={rowStyle}><MapPin size={16} color={GOLD} /> {contact.address}</div>}
            {contact?.phone && <div style={rowStyle}><Phone size={16} color={GOLD} /> {contact.phone}</div>}
            {contact?.email && <div style={rowStyle}><Mail size={16} color={GOLD} /> {contact.email}</div>}
            {contact?.hours && <div style={rowStyle}><Clock size={16} color={GOLD} /> {contact.hours}</div>}
          </div>
          <div style={{ display: "grid", gap: 10, alignContent: "start" }}>
            {contact?.whatsapp && (
              <a href={waLink(contact.whatsapp)} target="_blank" rel="noreferrer" style={{ ...goldButton, textDecoration: "none", textAlign: "center" }}>
                <MessageCircle size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />
                Order on WhatsApp
              </a>
            )}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", color: GOLD }}>
              {contact?.facebook && <a href={contact.facebook} target="_blank" rel="noreferrer" style={{ color: GOLD }}>Facebook</a>}
              {contact?.instagram && <a href={contact.instagram} target="_blank" rel="noreferrer" style={{ color: GOLD }}>Instagram</a>}
              {contact?.tiktok && <a href={contact.tiktok} target="_blank" rel="noreferrer" style={{ color: GOLD }}>TikTok</a>}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "14px", color: "#777", fontSize: 13, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          © {new Date().getFullYear()} Golden Table. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const menuItemStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "left",
  background: "transparent",
  border: "none",
  color: WHITE,
  padding: "10px 12px",
  borderRadius: 10,
  cursor: "pointer",
  fontSize: 15,
};

const rowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, fontSize: 14 };
