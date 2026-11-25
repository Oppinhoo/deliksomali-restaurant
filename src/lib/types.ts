export type Category = {
  id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
};

export type MenuItem = {
  id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  discount_percent: number;
  discount_active: boolean;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  sort_order: number;
};

export type ContactSettings = {
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};

export type HomeSettings = {
  hero_title: string;
  welcome: string;
  description: string;
  hero_image: string;
};

export const DEFAULT_CONTACT: ContactSettings = {
  whatsapp: "",
  phone: "",
  email: "",
  address: "",
  hours: "",
  facebook: "",
  instagram: "",
  tiktok: "",
};

export const DEFAULT_HOME: HomeSettings = {
  hero_title: "",
  welcome: "",
  description: "",
  hero_image: "",
};

export const finalPrice = (item: MenuItem) =>
  item.discount_active && item.discount_percent > 0
    ? item.price * (1 - item.discount_percent / 100)
    : item.price;

export const isDiscounted = (item: MenuItem) =>
  item.discount_active && item.discount_percent > 0;

export const orderUrl = (whatsapp: string, item: MenuItem) => {
  const msg = `Hello, I would like to order one ${item.name}. Price: $${finalPrice(item).toFixed(2)}. Is it available?`;
  return `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
};
