// MOD-01/02/03 — CP-14 del Plan de Pruebas MedResQ
// Este archivo se corre DOS VECES por separado (una por navegador):
//   npx cypress run --browser chrome --spec "cypress/e2e/05-compatibilidad.cy.js"
//   npx cypress run --browser edge   --spec "cypress/e2e/05-compatibilidad.cy.js"
// Compara las capturas resultantes de ambas corridas para el CP-14.

describe("CP-14: Compatibilidad entre navegadores", () => {
  it("La pantalla de inicio de sesión se ve correctamente", () => {
    cy.visit("/login");
    cy.contains("Sign In").should("be.visible");
    cy.screenshot(`CP-14-login-${Cypress.browser.name}`);
  });

  it("La pantalla de registro se ve correctamente", () => {
    cy.visit("/register");
    cy.contains("Sign Up").should("be.visible");
    cy.screenshot(`CP-14-registro-${Cypress.browser.name}`);
  });

  it("CP-20: La pantalla de inicio (landing) se ve correctamente", () => {
    cy.visit("/");
    cy.contains("not only an application").should("be.visible");
    cy.screenshot(`CP-20-landing-${Cypress.browser.name}`);
  });
});