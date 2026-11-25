import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCategories, useMenuItems, useSettings } from "@/hooks/useSiteData";
import { MenuCard } from "@/components/MenuCard";
import { BLACK, GOLD, WHITE, glass } from "@/lib/theme";

export default function Menu() {
  const { data: settings } = useSettings();
  const { data: categories = [] } = useCategories();
  const { data: items = [], isLoading } = useMenuItems();
  const [params, setParams] = useSearchParams();
  const whatsapp = settings?.contact.whatsapp ?? "";

  const activeId = params.get("cat") ?? categories[0]?.id ?? "";
  const active = categories.find((c) => c.id === activeId) ?? categories[0];

  const visible = useMemo(
    () => items.filter((i) => i.category_id === active?.id),
    [items, active?.id],
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 16px" }}>
      <h1 style={{ fontFamily: "Georgia, serif", color: GOLD, textAlign: "center", fontSize: "clamp(28px, 4vw, 42px)", margin: "0 0 22px" }}>
        Our Menu
      </h1>

      <div
        role="tablist"
        style={{
          ...glass,
          borderRadius: 999,
          padding: 6,
          display: "flex",
          gap: 6,
          overflowX: "auto",
          maxWidth: "100%",
          marginBottom: 28,
          justifyContent: "center",
        }}
      >
        {categories.map((c) => {
          const selected = c.id === active?.id;
          return (
            <button
              key={c.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setParams({ cat: c.id })}
              style={{
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                borderRadius: 999,
                padding: "10px 18px",
                fontWeight: 600,
                background: selected ? `linear-gradient(135deg, #F3D774, ${GOLD})` : "transparent",
                color: selected ? BLACK : WHITE,
                transition: "all .25s ease",
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {isLoading && <p style={{ textAlign: "center", color: GOLD }}>Loading menu…</p>}

      {!isLoading && visible.length === 0 && (
        <p style={{ textAlign: "center", color: "#aaa" }}>No items in this category yet.</p>
      )}

      <div style={{ display: "grid", gap: 18, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {visible.map((item) => (
          <MenuCard key={item.id} item={item} whatsapp={whatsapp} />
        ))}
      </div>
    </div>
  );
}
