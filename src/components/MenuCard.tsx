import { memo } from "react";
import { MessageCircle } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { finalPrice, isDiscounted, orderUrl } from "@/lib/types";
import { BLACK, GOLD, WHITE, glass } from "@/lib/theme";

type Props = { item: MenuItem; whatsapp: string };

function MenuCardBase({ item, whatsapp }: Props) {
  const discounted = isDiscounted(item);
  const price = finalPrice(item);

  return (
    <article
      className="menu-card"
      style={{
        ...glass,
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform .3s ease, box-shadow .3s ease",
        opacity: item.available ? 1 : 0.6,
      }}
    >
      <div style={{ position: "relative", aspectRatio: "4 / 3", background: "#111" }}>
        {item.image_url && (
          <img
            src={item.image_url}
            alt={item.name}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s ease" }}
          />
        )}
        {discounted && (
          <span
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: `linear-gradient(135deg, #F3D774, ${GOLD})`,
              color: BLACK,
              fontWeight: 800,
              fontSize: 13,
              padding: "5px 10px",
              borderRadius: 999,
              boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
            }}
          >
            -{item.discount_percent}%
          </span>
        )}
        {!item.available && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "rgba(0,0,0,0.55)",
              color: WHITE,
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            UNAVAILABLE
          </span>
        )}
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 17, fontFamily: "Georgia, serif", color: WHITE }}>{item.name}</h3>
        <p style={{ margin: 0, fontSize: 13, color: "#b5b5b5", lineHeight: 1.5, flex: 1 }}>{item.description}</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <strong style={{ color: GOLD, fontSize: 18 }}>${price.toFixed(2)}</strong>
          {discounted && (
            <span style={{ color: "#888", textDecoration: "line-through", fontSize: 13 }}>${item.price.toFixed(2)}</span>
          )}
        </div>
        {item.available ? (
          <a
            href={orderUrl(whatsapp, item)}
            target="_blank"
            rel="noreferrer"
            className="order-btn"
            style={{
              background: `linear-gradient(135deg, #F3D774, ${GOLD} 60%, #A8852A)`,
              color: BLACK,
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: "0.06em",
              textDecoration: "none",
              textAlign: "center",
              borderRadius: 999,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "transform .2s ease, box-shadow .2s ease",
            }}
          >
            <MessageCircle size={16} /> ADD ORDER
          </a>
        ) : (
          <span style={{ textAlign: "center", color: "#888", fontSize: 14, padding: "10px 12px" }}>Currently unavailable</span>
        )}
      </div>
    </article>
  );
}

export const MenuCard = memo(MenuCardBase);
