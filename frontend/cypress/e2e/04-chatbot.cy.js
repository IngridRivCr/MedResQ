// MOD Chatbot IA del Plan de Pruebas MedResQ
// Requiere que GEMINI_API_KEY ya esté configurada en backend/.env

describe("Módulo de Chatbot IA (MOD-08)", () => {
  const BACKEND = "http://localhost:3001";
  const timestamp = Date.now();
  const testUser = {
    name: "Usuario Chatbot",
    email: `usuario.chatbot.${timestamp}@correo.com`,
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

  it("CP-13: Interacción básica con el chatbot", () => {
    cy.visit("/dashboard", {
      onBeforeLoad(win) {
        win.localStorage.setItem("user", JSON.stringify(sessionUser));
      },
    });

    cy.get('input[placeholder="Send a message..."]').type(
      "¿Para qué sirve esta plataforma?"
    );
    cy.screenshot("CP-13-pregunta-escrita-en-el-chatbot");

    cy.contains("button", "Send").click();
    // Espera a que deje de decir "Pensando..." (la IA responde)
    cy.get("#ai-response", { timeout: 20000 }).should(
      "not.contain.text",
      "Pensando..."
    );
    cy.get("#ai-response").should("not.be.empty");
    cy.screenshot("CP-13-respuesta-del-chatbot");
  });
});