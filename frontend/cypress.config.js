import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // El frontend debe estar corriendo (npm run dev) antes de ejecutar las pruebas
    baseUrl: "http://localhost:5173",
    viewportWidth: 1280,
    viewportHeight: 800,
    video: false,
    screenshotOnRunFail: true,
    setupNodeEvents(on, config) {
      return config;
    },
  },
});