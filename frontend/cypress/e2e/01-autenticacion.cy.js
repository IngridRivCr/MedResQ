// MOD Autenticación del Plan de Pruebas MedResQ

describe("Módulo de Autenticación (MOD-02)", () => {
  const timestamp = Date.now();
  const testUser = {
    name: "Usuario de Prueba",
    email: `usuario.prueba.${timestamp}@correo.com`,
    password: "Prueba#2026",
  };

  it("CP-01: Registro de usuario con datos válidos", () => {
    cy.on("window:alert", (msg) => {
      expect(msg).to.eq("Usuario registrado correctamente");
    });

    cy.visit("/register");
    cy.get('input[name="name"]').type(testUser.name);
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get("#terms").check();
    cy.screenshot("CP-01-formulario-registro-lleno");

    cy.contains("button", "Sign Up").click();
    cy.url().should("include", "/login");
    cy.screenshot("CP-01-resultado-redirigido-a-login");
  });

  it("CP-02: Registro con correo ya existente", () => {
    cy.on("window:alert", (msg) => {
      expect(msg).to.eq("Error al registrar el usuario");
    });

    cy.visit("/register");
    cy.get('input[name="name"]').type("Otro Usuario");
    cy.get('input[name="email"]').type(testUser.email); // mismo correo del CP-01
    cy.get('input[name="password"]').type("OtraClave#123");
    cy.get("#terms").check();
    cy.screenshot("CP-02-formulario-correo-duplicado");

    cy.contains("button", "Sign Up").click();
    cy.screenshot("CP-02-alerta-correo-duplicado");
  });

  it("CP-03: Registro con campos obligatorios vacíos", () => {
    cy.visit("/register");
    cy.contains("button", "Sign Up").click();
    // El navegador bloquea el envío por los atributos "required" (validación HTML5)
    cy.get('input[name="name"]:invalid').should("exist");
    cy.url().should("include", "/register"); // no navegó, se quedó en el formulario
    cy.screenshot("CP-03-validacion-campos-obligatorios");
  });

  it("CP-04: Inicio de sesión con credenciales válidas", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.screenshot("CP-04-formulario-login-lleno");

    cy.contains("button", "Sign In").click();
    cy.url().should("include", "/dashboard");
    cy.screenshot("CP-04-dashboard-tras-login-exitoso");
  });

  it("CP-05: Inicio de sesión con contraseña incorrecta", () => {
    cy.on("window:alert", (msg) => {
      expect(msg).to.eq("Contraseña incorrecta.");
    });

    cy.visit("/login");
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type("ClaveIncorrecta999");
    cy.contains("button", "Sign In").click();
    cy.url().should("include", "/login"); // no navegó al dashboard
    cy.screenshot("CP-05-alerta-contrasena-incorrecta");
  });

  it("CP-06: Cierre de sesión", () => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(testUser.email);
    cy.get('input[name="password"]').type(testUser.password);
    cy.contains("button", "Sign In").click();
    cy.url().should("include", "/dashboard");

    cy.visit("/profile");
    cy.contains("Log Out").click();
    cy.url().should("include", "/login");
    cy.screenshot("CP-06-sesion-cerrada-correctamente");
  });

  it("CP-07: Acceso a rutas protegidas sin sesión activa", () => {
    cy.clearLocalStorage();
    cy.visit("/dashboard");
    cy.url().should("include", "/login");
    cy.screenshot("CP-07-redirigido-por-falta-de-sesion");
  });

  it("CP-15: El campo de contraseña oculta el texto que se escribe", () => {
    cy.visit("/login");
    cy.get('input[name="password"]').should("have.attr", "type", "password");
    cy.screenshot("CP-15-password-oculto-tipo-password");
  });

  it("CP-16: Login con campos vacíos no envía el formulario (validación HTML5)", () => {
    cy.visit("/login");
    cy.contains("button", "Sign In").click();
    cy.get('input[name="email"]:invalid').should("exist");
    cy.url().should("include", "/login");
    cy.screenshot("CP-16-login-campos-vacios-bloqueado");
  });
});