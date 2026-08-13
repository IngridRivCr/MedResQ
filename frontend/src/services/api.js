// URL del backend. Si defines VITE_API_URL (por ejemplo en producción, en Vercel),
// se usa esa. Si no está definida, se arma automáticamente a partir de cómo se abrió
// la página (localhost o la IP de red), igual que ya funciona en PublicProfile.jsx.
export const API_URL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:3001`;