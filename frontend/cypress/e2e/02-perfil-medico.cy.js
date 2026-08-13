// MOD Perfil Médico del Plan de Pruebas MedResQ
// Usa cy.request para crear e iniciar sesión con un usuario de prueba directo contra


describe("Información Personal, Médica y Contactos de Emergencia", () => {
  const BACKEND = "http://localhost:3001";
  const timestamp = Date.now();
  const testUser = {
    name: "Usuario Perfil",
    email: `usuario.perfil.${timestamp}@correo.com`,
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

  const visitLoggedIn = (path) => {
    cy.visit(path, {
      onBeforeLoad(win) {
        win.localStorage.setItem("user", JSON.stringify(sessionUser));
      },
    });
  };

  it("CP-08: Registro de información personal", () => {
    visitLoggedIn("/dashboard");
    cy.contains("label", "Phone number").next("input").clear().type("6181234567");
    cy.contains("label", "Address").next("input").clear().type("Calle Eucalipto #223, Durango");
    cy.contains("label", "Birth of date").next("input").type("2000-05-15");
    cy.screenshot("CP-08-formulario-personal-lleno");

    cy.contains("button", "Save all the information").click();
    cy.reload();
    cy.contains("label", "Phone number").next("input").should("have.value", "6181234567");
    cy.screenshot("CP-08-datos-persistidos-tras-recargar");
  });

  it("CP-09: Registro de información médica", () => {
    visitLoggedIn("/dashboard");
    cy.contains(".card", "Medical Information").click();
    cy.contains("label", "Blood Type").next("input").clear().type("O+");
    cy.contains("label", "Known Allergies").next("textarea").clear().type("Penicilina");
    cy.screenshot("CP-09-formulario-medico-lleno");

    cy.contains("button", "Save all the information").click();
    cy.reload();
    cy.contains(".card", "Medical Information").click();
    cy.contains("label", "Blood Type").next("input").should("have.value", "O+");
    cy.screenshot("CP-09-datos-medicos-persistidos");
  });

  it("CP-10: Registro de contacto de emergencia", () => {
    visitLoggedIn("/emergency-contacts");
    cy.get('input[placeholder="Contact Full Name"]').type("María Contacto");
    cy.get('input[placeholder="Phone Number"]').type("6181112233");
    cy.get('input[placeholder="Relationship"]').type("Madre");
    cy.contains("+ Add to List").click();
    cy.contains("María Contacto").should("exist");
    cy.screenshot("CP-10-contacto-agregado-a-la-lista");

    cy.contains("Save All Contacts").click();
    cy.screenshot("CP-10-contactos-guardados");
  });

  it("CP-11: Edición de perfil existente", () => {
    visitLoggedIn("/edit-profile");
    cy.contains("label", /^Address$/).next("input").clear().type("Nueva Dirección 456, Durango");
    cy.screenshot("CP-11-campo-de-perfil-modificado");

    cy.contains("button", "Save Changes").click();
    cy.screenshot("CP-11-perfil-actualizado");
  });

  it("CP-17: No agrega un contacto de emergencia si faltan Nombre o Teléfono", () => {
    cy.on("window:alert", (msg) => {
      expect(msg).to.eq("Please fill out Name and Phone Number.");
    });
    visitLoggedIn("/emergency-contacts");
    cy.contains("+ Add to List").click();
    cy.screenshot("CP-17-contacto-vacio-alerta");
  });

  it("CP-18: Eliminar un contacto de emergencia lo quita de la lista", () => {
    visitLoggedIn("/emergency-contacts");
    cy.get('input[placeholder="Contact Full Name"]').type("Contacto a Eliminar");
    cy.get('input[placeholder="Phone Number"]').type("6180009999");
    cy.contains("+ Add to List").click();
    cy.contains("Contacto a Eliminar").should("exist");
    cy.screenshot("CP-18-contacto-antes-de-eliminar");

    cy.contains("Contacto a Eliminar")
      .parents()
      .eq(2)
      .find("button")
      .click();
    cy.contains("Contacto a Eliminar").should("not.exist");
    cy.screenshot("CP-18-contacto-eliminado");
  });
});