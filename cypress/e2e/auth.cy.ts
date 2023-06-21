describe("auth spec", () => {
  it("register", () => {
    cy.visit(Cypress.env("env").localHost)

    cy.logout(Cypress.env("env").localHost) // for clearing Firebase auth

    cy.get(".links a[href^='/login'").click()

    cy.get(".submit-wrapper .default-link.supporting-text").click()

    cy.get("#email").type(Cypress.env("env").testEmail)

    cy.get("#password").type(Cypress.env("env").testPassword)

    cy.get("#repeatPassword").type(Cypress.env("env").testPassword)

    cy.get(".submit-wrapper button[type='submit']").click()
  })

  it("login", () => {
    cy.logout(Cypress.env("env").localHost) // for clearing Firebase auth
    cy.login(Cypress.env("env").localHost + "login", Cypress.env("env").testEmail, Cypress.env("env").testPassword)
  })
})