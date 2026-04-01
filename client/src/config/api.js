const API_BASE_URL = import.meta.env.VITE_API_URL || "https://drriftaire.vercel.app/api";
const API_ROOT_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

export const HEALTHCHECK_URL = `${API_ROOT_URL}/health`;
export default API_BASE_URL;
