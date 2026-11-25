import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Category,
  ContactSettings,
  DEFAULT_CONTACT,
  DEFAULT_HOME,
  HomeSettings,
  MenuItem,
} from "@/lib/types";

export const useCategories = () =>
  useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, image_url, sort_order")
        .order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

export const useMenuItems = () =>
  useQuery({
    queryKey: ["menu_items"],
    queryFn: async (): Promise<MenuItem[]> => {
      const { data, error } = await supabase
        .from("menu_items")
        .select(
          "id, category_id, name, description, price, discount_percent, discount_active, image_url, available, featured, sort_order",
        )
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as MenuItem[];
    },
  });

export const useSettings = () =>
  useQuery({
    queryKey: ["site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value");
      if (error) throw error;
      const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
      return {
        contact: { ...DEFAULT_CONTACT, ...(map.contact ?? {}) } as ContactSettings,
        home: { ...DEFAULT_HOME, ...(map.home ?? {}) } as HomeSettings,
      };
    },
  });

export const useInvalidateSite = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries();
};
