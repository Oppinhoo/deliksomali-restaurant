import { Link } from "react-router-dom";
import { MessageCircle, Sparkles } from "lucide-react";
import { useCategories, useMenuItems, useSettings } from "@/hooks/useSiteData";
import { MenuCard } from "@/components/MenuCard";
import { isDiscounted } from "@/lib/types";
import { BLACK, GOLD, WHITE, glass, goldButton } from "@/lib/theme";

export default function Home() {
  const { data: settings } = useSettings();
  const { data: items = [] } = useMenuItems();
  const { data: categories = [] } = useCategories();

  const home = settings?.home;
  const contact = settings?.contact;
  const whatsapp = contact?.whatsapp ?? "";

  const featured = items.filter((i) => i.featured && i.available).slice(0, 8);
  const offers = items.filter((i) => isDiscounted(i) && i.available).slice(0, 4);

  const waHref = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : undefined;

  return (
    <div>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "78vh",
          display: "grid",
          placeItems: "center",
          textAlign: "center",
          padding: "60px 20px",
          overflow: "hidden",
        }}
      >
        {home?.hero_image && (
          <img
            src={home.hero_image}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.45 }}
          />
        )}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(8,8,8,0.2), ${BLACK})` }} />
        <div style={{ position: "relative", maxWidth: 760, ...glass, borderRadius: 28, padding: "40px 28px" }}>
          <p style={{ color: GOLD, letterSpacing: "0.3em", fontSize: 13, margin: 0 }}>
            <Sparkles size={14} style={{ verticalAlign: "middle", marginRight: 6 }} />
            {home?.welcome}
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 6vw, 64px)", margin: "14px 0", color: WHITE, lineHeight: 1.1 }}>
            {home?.hero_title}
          </h1>
          <p style={{ color: "#cfcfcf", fontSize: 17, lineHeight: 1.6, margin: "0 0 26px" }}>{home?.description}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/menu" style={{ ...goldButton, textDecoration: "none", display: "inline-block" }}>VIEW MENU</Link>
            {waHref && (
              <a href={waHref} target="_blank" rel="noreferrer" style={{ ...glass, color: WHITE, textDecoration: "none", borderRadius: 999, padding: "12px 22px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <MessageCircle size={16} color={GOLD} /> WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Category shortcuts */}
      <section style={sectionWrap}>
        <h2 style={sectionTitle}>Explore Our Menu</h2>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {categories.map((c) => (
            <Link key={c.id} to={`/menu?cat=${c.id}`} style={{ ...glass, borderRadius: 20, overflow: "hidden", textDecoration: "none", color: WHITE }}>
              {c.image_url && <img src={c.image_url} alt={c.name} loading="lazy" style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }} />}
              <div style={{ padding: 16, fontFamily: "Georgia, serif", fontSize: 18, color: GOLD }}>{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section style={sectionWrap}>
          <h2 style={sectionTitle}>Featured & Popular</h2>
          <div style={grid}>
            {featured.map((item) => <MenuCard key={item.id} item={item} whatsapp={whatsapp} />)}
          </div>
        </section>
      )}

      {/* Offers */}
      {offers.length > 0 && (
        <section style={sectionWrap}>
          <h2 style={sectionTitle}>Special Offers</h2>
          <div style={grid}>
            {offers.map((item) => <MenuCard key={item.id} item={item} whatsapp={whatsapp} />)}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section style={{ ...sectionWrap, textAlign: "center" }}>
        <div style={{ ...glass, borderRadius: 28, padding: "36px 24px" }}>
          <h2 style={{ ...sectionTitle, marginBottom: 10 }}>Order in one message</h2>
          <p style={{ color: "#cfcfcf", margin: "0 0 20px" }}>
            Pick a dish, tap ADD ORDER and confirm your order directly on WhatsApp.
          </p>
          {waHref && (
            <a href={waHref} target="_blank" rel="noreferrer" style={{ ...goldButton, textDecoration: "none", display: "inline-block" }}>
              Order on WhatsApp
            </a>
          )}
          {contact?.address && <p style={{ color: "#aaa", marginTop: 18, fontSize: 14 }}>{contact.address}</p>}
        </div>
      </section>
    </div>
  );
}

const sectionWrap: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "48px 16px" };
const sectionTitle: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "clamp(24px, 3.5vw, 34px)",
  color: GOLD,
  margin: "0 0 22px",
  textAlign: "center",
};
const grid: React.CSSProperties = {
  display: "grid",
  gap: 18,
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
};
