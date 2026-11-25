import { useState, ChangeEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useCategories, useMenuItems, useSettings } from "@/hooks/useSiteData";
import { supabase } from "@/lib/supabase";
import { uploadImage } from "@/lib/upload";
import type { Category, ContactSettings, HomeSettings, MenuItem } from "@/lib/types";
import { BLACK, GOLD, WHITE, glass, goldButton, inputStyle, labelStyle } from "@/lib/theme";

type Tab = "food" | "categories" | "home" | "contact";

export default function Admin() {
  const { session, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("food");

  if (loading) return <Center>Loading…</Center>;
  if (!session || !isAdmin) return <Navigate to="/admin/login" replace />;

  return (
    <div style={{ minHeight: "100vh", background: BLACK, color: WHITE, fontFamily: "system-ui, sans-serif" }}>
      <div style={{ ...glass, position: "sticky", top: 0, zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", margin: 10, borderRadius: 18, flexWrap: "wrap", gap: 10 }}>
        <strong style={{ fontFamily: "Georgia, serif", color: GOLD }}>Admin Dashboard</strong>
        <nav style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {(["food", "categories", "home", "contact"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={tabBtn(tab === t)}>
              {t === "food" ? "Food & Discounts" : t === "categories" ? "Categories" : t === "home" ? "Homepage" : "Contact"}
            </button>
          ))}
          <button onClick={() => navigate("/")} style={tabBtn(false)}>View Site</button>
          <button onClick={() => signOut()} style={tabBtn(false)}>Logout</button>
        </nav>
      </div>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "10px 16px 60px" }}>
        {tab === "food" && <FoodManager />}
        {tab === "categories" && <CategoryManager />}
        {tab === "home" && <HomeManager />}
        {tab === "contact" && <ContactManager />}
      </div>
    </div>
  );
}

const tabBtn = (active: boolean): React.CSSProperties => ({
  border: "none",
  cursor: "pointer",
  borderRadius: 999,
  padding: "8px 14px",
  fontWeight: 600,
  background: active ? `linear-gradient(135deg, #F3D774, ${GOLD})` : "rgba(255,255,255,0.06)",
  color: active ? BLACK : WHITE,
});

const card: React.CSSProperties = { ...glass, borderRadius: 20, padding: 18, marginBottom: 16 };
const row: React.CSSProperties = { display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" };
const btn = (variant: "gold" | "ghost" | "danger" = "gold"): React.CSSProperties =>
  variant === "gold"
    ? { ...goldButton, padding: "9px 16px", fontSize: 14 }
    : {
        ...glass,
        borderRadius: 999,
        padding: "9px 14px",
        fontSize: 14,
        cursor: "pointer",
        color: variant === "danger" ? "#ff8a8a" : WHITE,
      };

function Center({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100vh", background: BLACK, color: GOLD, display: "grid", placeItems: "center" }}>{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function useInvalidate() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
}

function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(null);
    try {
      onChange(await uploadImage(file));
    } catch {
      setErr("Upload failed. Check the image size and try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {value && <img src={value} alt="" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: 12 }} />}
      <input type="file" accept="image/*" onChange={onFile} style={{ color: WHITE, fontSize: 13 }} />
      {busy && <span style={{ color: GOLD, fontSize: 13 }}>Uploading…</span>}
      {err && <span style={{ color: "#ff8a8a", fontSize: 13 }}>{err}</span>}
      <input style={inputStyle} placeholder="or paste image URL" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/* ---------------- FOOD & DISCOUNTS ---------------- */

const emptyItem = (categoryId: string): Partial<MenuItem> => ({
  name: "",
  description: "",
  price: 0,
  discount_percent: 0,
  discount_active: false,
  image_url: "",
  available: true,
  featured: false,
  category_id: categoryId,
});

function FoodManager() {
  const { data: categories = [] } = useCategories();
  const { data: items = [] } = useMenuItems();
  const invalidate = useInvalidate();
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const shown = items.filter((i) => filter === "all" || i.category_id === filter);

  const save = async () => {
    if (!editing) return;
    if (!editing.name?.trim()) return setErr("Food name is required.");
    if (!editing.category_id) return setErr("Choose a category.");
    setSaving(true);
    setErr(null);
    const payload = {
      name: editing.name.trim(),
      description: editing.description ?? "",
      price: Number(editing.price) || 0,
      discount_percent: Math.min(100, Math.max(0, Math.round(Number(editing.discount_percent) || 0))),
      discount_active: !!editing.discount_active,
      image_url: editing.image_url || null,
      available: !!editing.available,
      featured: !!editing.featured,
      category_id: editing.category_id,
      sort_order: editing.sort_order ?? items.length + 1,
    };
    const res = editing.id
      ? await supabase.from("menu_items").update(payload).eq("id", editing.id)
      : await supabase.from("menu_items").insert(payload);
    setSaving(false);
    if (res.error) return setErr("Save failed: " + res.error.message);
    setEditing(null);
    invalidate();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this food item?")) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) alert(error.message);
    invalidate();
  };

  const toggle = async (item: MenuItem, field: "available" | "discount_active" | "featured") => {
    await supabase.from("menu_items").update({ [field]: !item[field] }).eq("id", item.id);
    invalidate();
  };

  return (
    <>
      <div style={{ ...card, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button style={btn()} onClick={() => setEditing(emptyItem(filter !== "all" ? filter : categories[0]?.id ?? ""))}>+ Add food</button>
      </div>

      {editing && (
        <div style={card}>
          <h3 style={{ color: GOLD, marginTop: 0 }}>{editing.id ? "Edit food" : "New food"}</h3>
          <div style={row}>
            <Field label="Food name"><input style={inputStyle} value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></Field>
            <Field label="Category">
              <select style={inputStyle} value={editing.category_id ?? ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value })}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Price ($)"><input type="number" step="0.01" min="0" style={inputStyle} value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></Field>
            <Field label="Discount %"><input type="number" min="0" max="100" style={inputStyle} value={editing.discount_percent ?? 0} onChange={(e) => setEditing({ ...editing, discount_percent: Number(e.target.value) })} /></Field>
          </div>
          <div style={{ marginTop: 12 }}>
            <Field label="Description"><textarea style={{ ...inputStyle, minHeight: 70 }} value={editing.description ?? ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></Field>
          </div>
          <div style={{ marginTop: 12 }}>
            <Field label="Image"><ImagePicker value={editing.image_url ?? ""} onChange={(url) => setEditing({ ...editing, image_url: url })} /></Field>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 14, fontSize: 14 }}>
            <Check label="Available" checked={!!editing.available} onChange={(v) => setEditing({ ...editing, available: v })} />
            <Check label="Discount active" checked={!!editing.discount_active} onChange={(v) => setEditing({ ...editing, discount_active: v })} />
            <Check label="Featured on home" checked={!!editing.featured} onChange={(v) => setEditing({ ...editing, featured: v })} />
          </div>
          {err && <p style={{ color: "#ff8a8a", fontSize: 14 }}>{err}</p>}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={btn()} disabled={saving} onClick={save}>{saving ? "Saving…" : "Save"}</button>
            <button style={btn("ghost")} onClick={() => { setEditing(null); setErr(null); }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {shown.map((item) => {
          const cat = categories.find((c) => c.id === item.category_id);
          return (
            <div key={item.id} style={{ ...glass, borderRadius: 16, padding: 12, display: "grid", gridTemplateColumns: "72px 1fr auto", gap: 12, alignItems: "center" }}>
              {item.image_url ? <img src={item.image_url} alt="" style={{ width: 72, height: 72, borderRadius: 12, objectFit: "cover" }} /> : <div style={{ width: 72, height: 72, borderRadius: 12, background: "#111" }} />}
              <div>
                <div style={{ fontWeight: 700 }}>{item.name} <span style={{ color: "#888", fontWeight: 400, fontSize: 12 }}>· {cat?.name}</span></div>
                <div style={{ color: GOLD, fontSize: 14 }}>
                  ${Number(item.price).toFixed(2)}
                  {item.discount_percent > 0 && <span style={{ color: item.discount_active ? "#ff8a8a" : "#888", marginLeft: 8 }}>-{item.discount_percent}% {item.discount_active ? "(active)" : "(off)"}</span>}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                  <Pill on={item.available} onClick={() => toggle(item, "available")}>{item.available ? "Available" : "Unavailable"}</Pill>
                  <Pill on={item.discount_active} onClick={() => toggle(item, "discount_active")}>Discount</Pill>
                  <Pill on={item.featured} onClick={() => toggle(item, "featured")}>Featured</Pill>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button style={btn("ghost")} onClick={() => setEditing(item)}>Edit</button>
                <button style={btn("danger")} onClick={() => remove(item.id)}>Delete</button>
              </div>
            </div>
          );
        })}
        {shown.length === 0 && <p style={{ color: "#888" }}>No food items here yet.</p>}
      </div>
    </>
  );
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /> {label}
    </label>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ ...tabBtn(on), padding: "4px 10px", fontSize: 12 }}>{children}</button>
  );
}

/* ---------------- CATEGORIES ---------------- */

function CategoryManager() {
  const { data: categories = [] } = useCategories();
  const invalidate = useInvalidate();
  const [newName, setNewName] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const add = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("categories").insert({ name: newName.trim(), sort_order: categories.length + 1 });
    if (error) return setErr(error.message);
    setNewName("");
    invalidate();
  };

  const rename = async (c: Category, name: string) => {
    await supabase.from("categories").update({ name }).eq("id", c.id);
    invalidate();
  };

  const setImage = async (c: Category, url: string) => {
    await supabase.from("categories").update({ image_url: url || null }).eq("id", c.id);
    invalidate();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const other = categories[index + dir];
    if (!other) return;
    const a = categories[index];
    await supabase.from("categories").update({ sort_order: other.sort_order }).eq("id", a.id);
    await supabase.from("categories").update({ sort_order: a.sort_order }).eq("id", other.id);
    invalidate();
  };

  const remove = async (c: Category) => {
    if (!confirm(`Delete category "${c.name}" and all its food items?`)) return;
    await supabase.from("categories").delete().eq("id", c.id);
    invalidate();
  };

  return (
    <>
      <div style={{ ...card, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input style={{ ...inputStyle, flex: 1, minWidth: 200 }} placeholder="New category name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button style={btn()} onClick={add}>+ Add category</button>
        {err && <p style={{ color: "#ff8a8a", width: "100%", margin: 0 }}>{err}</p>}
      </div>
      {categories.map((c, i) => (
        <div key={c.id} style={card}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 12 }}>
            <input
              style={{ ...inputStyle, flex: 1, minWidth: 200, fontFamily: "Georgia, serif", fontSize: 18 }}
              defaultValue={c.name}
              onBlur={(e) => e.target.value.trim() && e.target.value !== c.name && rename(c, e.target.value.trim())}
            />
            <button style={btn("ghost")} onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
            <button style={btn("ghost")} onClick={() => move(i, 1)} disabled={i === categories.length - 1}>↓</button>
            <button style={btn("danger")} onClick={() => remove(c)}>Delete</button>
          </div>
          <ImagePicker value={c.image_url ?? ""} onChange={(url) => setImage(c, url)} />
        </div>
      ))}
    </>
  );
}

/* ---------------- HOMEPAGE ---------------- */

function HomeManager() {
  const { data: settings } = useSettings();
  const [form, setForm] = useState<HomeSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const current = form ?? settings?.home;

  if (!current) return <p>Loading…</p>;

  const save = async () => {
    const { error } = await supabase.from("site_settings").upsert({ key: "home", value: current, updated_at: new Date().toISOString() });
    if (error) return alert(error.message);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    window.location.reload();
  };

  const set = (k: keyof HomeSettings) => (v: string) => setForm({ ...current, [k]: v });

  return (
    <div style={card}>
      <h3 style={{ color: GOLD, marginTop: 0 }}>Homepage content</h3>
      <div style={{ display: "grid", gap: 12 }}>
        <Field label="Welcome message (small line)"><input style={inputStyle} value={current.welcome} onChange={(e) => set("welcome")(e.target.value)} /></Field>
        <Field label="Main headline"><input style={inputStyle} value={current.hero_title} onChange={(e) => set("hero_title")(e.target.value)} /></Field>
        <Field label="Description"><textarea style={{ ...inputStyle, minHeight: 80 }} value={current.description} onChange={(e) => set("description")(e.target.value)} /></Field>
        <Field label="Hero banner image"><ImagePicker value={current.hero_image} onChange={set("hero_image")} /></Field>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16 }}>
        <button style={btn()} onClick={save}>Save homepage</button>
        {saved && <span style={{ color: GOLD, fontSize: 14 }}>Saved</span>}
      </div>
      <p style={{ color: "#888", fontSize: 12, marginTop: 12 }}>Featured foods and offers are managed in the Food tab (Featured / Discount toggles).</p>
    </div>
  );
}

/* ---------------- CONTACT ---------------- */

function ContactManager() {
  const { data: settings } = useSettings();
  const [form, setForm] = useState<ContactSettings | null>(null);
  const current = form ?? settings?.contact;
  if (!current) return <p>Loading…</p>;

  const set = (k: keyof ContactSettings) => (v: string) => setForm({ ...current, [k]: v });

  const save = async () => {
    const { error } = await supabase.from("site_settings").upsert({ key: "contact", value: current, updated_at: new Date().toISOString() });
    if (error) return alert(error.message);
    window.location.reload();
  };

  const fields: { k: keyof ContactSettings; label: string; multi?: boolean }[] = [
    { k: "whatsapp", label: "WhatsApp number (with country code, digits only)" },
    { k: "phone", label: "Phone number" },
    { k: "email", label: "Email address" },
    { k: "address", label: "Restaurant address", multi: true },
    { k: "hours", label: "Opening hours", multi: true },
    { k: "facebook", label: "Facebook link" },
    { k: "instagram", label: "Instagram link" },
    { k: "tiktok", label: "TikTok link" },
  ];

  return (
    <div style={card}>
      <h3 style={{ color: GOLD, marginTop: 0 }}>Contact information</h3>
      <div style={{ display: "grid", gap: 12 }}>
        {fields.map((f) => (
          <Field key={f.k} label={f.label}>
            {f.multi ? (
              <textarea style={{ ...inputStyle, minHeight: 60 }} value={current[f.k]} onChange={(e) => set(f.k)(e.target.value)} />
            ) : (
              <input style={inputStyle} value={current[f.k]} onChange={(e) => set(f.k)(e.target.value)} />
            )}
          </Field>
        ))}
      </div>
      <button style={{ ...btn(), marginTop: 16 }} onClick={save}>Save contact info</button>
    </div>
  );
}
