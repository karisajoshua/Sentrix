import { defineConfig, loadEnv } from "vite";
// Only public Supabase credentials are exposed to the browser.
export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, ".", "");
 return { server: { host: "0.0.0.0" }, define: {
  "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_DB_SUPABASE_URL || ""),
  "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_DB_SUPABASE_PUBLISHABLE_KEY || ""),
  "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(env.VITE_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_DB_SUPABASE_ANON_KEY || ""),
 } };
});
