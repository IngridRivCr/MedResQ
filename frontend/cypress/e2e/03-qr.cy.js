// MOD Código QR del Plan de Pruebas MedResQ

describe("Módulo de Código QR (MOD-07)", () => {
  const BACKEND = "http://localhost:3001";
  const timestamp = Date.now();
  const testUser = {
    name: "Usuario QR",
    email: `usuario.qr.${timestamp}@correo.com`,
    password: "Prueba#2026",
  };
  let sessionUser;

  before(() => {
    cy.request("POST", `${BACKEND}/register`, testUser).then(() => {
      cy.request("POST", `${BACKEND}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password,
      }).then((res) => {
        sessionUser = res.body.user;
      });
    });
  });

  it("CP-12: Generación del código QR", () => {
    cy.visit("/my-qr-code", {
      onBeforeLoad(win) {
        win.localStorage.setItem("user", JSON.stringify(sessionUser));
      },
    });

    cy.get('img[alt="Código QR de tu perfil médico"]')
      .should("be.visible")
      .and(($img) => {
        expect($img.attr("src")).to.include("qrserver.com");
      });
    cy.screenshot("CP-12-qr-generado-en-pantalla");
  });

  it("CP-19: El QR codifica la URL correcta del perfil público del usuario", () => {
    cy.visit("/my-qr-code", {
      onBeforeLoad(win) {
        win.localStorage.setItem("user", JSON.stringify(sessionUser));
      },
    });

    cy.get('img[alt="Código QR de tu perfil médico"]').should(($img) => {
      const src = decodeURIComponent($img.attr("src"));
      expect(src).to.include(`/public-profile/${sessionUser.user_id}`);
    });
    cy.screenshot("CP-19-qr-url-correcta");
  });
});