const defaultApiUrl = import.meta.env.DEV
  ? "http://localhost:3000/api"
  : "/api";

const API_BASE_URL = (import.meta.env.VITE_API_URL || defaultApiUrl).replace(/\/$/, "");

export const HEALTHCHECK_URL = `${API_BASE_URL}/health`;
export default API_BASE_URL;
