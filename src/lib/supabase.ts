import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jflhrfuvbgkplmshurxm.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmbGhyZnV2YmdrcGxtc2h1cnhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTU1OTM3NzQsImV4cCI6MjExMTE2OTc3NH0.EbK1mhC6cc_v-0drkVMX4KtwKotuATx4AX3i9oqET8U";

export const ADMIN_EMAIL = "dileksomaliarestaurant@gmail.com";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export const MEDIA_BUCKET = "media";

export const publicImageUrl = (path: string) =>
  `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
