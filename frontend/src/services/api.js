// URL del backend
const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;

export const API_URL = rawApiUrl.replace(/\/+$/, "");