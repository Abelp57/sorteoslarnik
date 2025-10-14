export const ADMIN_BASE = process.env.NEXT_PUBLIC_ADMIN_BASE_PATH || "/panel";
export const adminPath = (p = "") => (ADMIN_BASE + (p.startsWith("/") ? p : `/${p}`)).replace(/\/+$/, "");
