describe("books-spec", { env: { 
  testEmail: "i.am.the.best.20@gmail.com", 
  testPassword: "secret_password",
  testCollectionName: "Moje Kolekce",
  localHost: "http://localhost:3000/"
} }, () => {

  it("register", () => {
    cy.visit(Cypress.env("localHost"))

    cy.logout(Cypress.env("localHost")) // for clearing Firebase auth

    cy.get(".links a[href^='/login'").click()

    cy.get(".submit-wrapper .default-link.supporting-text").click()

    cy.get("#email").type(Cypress.env("testEmail"))

    cy.get("#password").type(Cypress.env("testPassword"))

    cy.get("#repeatPassword").type(Cypress.env("testPassword"))

    cy.get(".submit-wrapper button[type='submit']").click()
  })

  it("login", () => {
    cy.logout(Cypress.env("localHost")) // for clearing Firebase auth
    cy.login(Cypress.env("localHost") + "login", Cypress.env("testEmail"), Cypress.env("testPassword"))
  })

  it("find-book-and-open-detail", () => {
    const bookName = "Ekonomie, 5. vydání"

    cy.visit(Cypress.env("localHost"))

    cy.get(".search-field").type(bookName + "{enter}")

    cy.wait(5000) // waiting for API data

    cy.get(".books a:first-child").click()

    cy.get(".intro-section h2").should("have.text", bookName)
  })

  it("create-collection-and-add-book", () => {
    const bookName = "Moby Dick"
    const collectionEndpoint = "kolekce"

    cy.logout(Cypress.env("localHost")) // for clearing Firebase auth

    cy.login(Cypress.env("localHost") + "login", Cypress.env("testEmail"), Cypress.env("testPassword"))

    cy.wait(3000) // waiting for user authentication

    cy.visit(Cypress.env("localHost") + collectionEndpoint)

    cy.get("div .btn").click()

    cy.get("#title-textfield").type(Cypress.env("testCollectionName"))

    cy.get("button[type='submit']").click()

    cy.wait(5000) // waiting for Firebase add operation

    cy.visit(Cypress.env("localHost"))

    cy.get(".search-field").type(bookName + "{enter}")

    cy.wait(5000) // waiting for API data

    cy.get(".books a:first-child").click()

    cy.get(".intro-section h2").should("have.text", bookName)

    cy.wait(5000) // waiting for Firebase data

    cy.get(".collections-select").click()
    cy.get('div.v-list-item-title').parent().parent(":first-child").click()
    cy.get(".collections-select").click()
    cy.get(".collections-select + .action-buttons button:last-child").click()

    cy.wait(5000) // waiting for Firebase add operation

    cy.reload()

    cy.wait(5000) // waiting for Firebase data

    cy.get(".collections-select").click()
    cy.get("div.v-list-item-title").parent().parent().should("contain", Cypress.env("testCollectionName"))
  })

    it("edit-collection", () => {
        const updatedExtraTitle = "222"

        cy.logout(Cypress.env("localHost")) // for clearing Firebase auth

        cy.login(Cypress.env("localHost") + "login", Cypress.env("testEmail"), Cypress.env("testPassword"))

        cy.wait(3000) // waiting for user authentication

        cy.visit(Cypress.env("localHost") + "kolekce")

        cy.wait(5000) // waiting for Firebase add operation

        cy.get(".collections a:first-child").click()

        cy.get("#editCollection").click()

        cy.get("#title-textfield").type(updatedExtraTitle)

        cy.get("button[type='submit']").click()

        cy.wait(2000)

        cy.get("h1:first-child").should("contain", Cypress.env("testCollectionName") + updatedExtraTitle)
    })

    it("delete-collection", () => {
        cy.logout(Cypress.env("localHost")) // for clearing Firebase auth

        cy.login(Cypress.env("localHost") + "login", Cypress.env("testEmail"), Cypress.env("testPassword"))

        cy.wait(3000) // waiting for user authentication

        cy.visit(Cypress.env("localHost") + "kolekce")

        cy.wait(5000) // waiting for Firebase add operation

        cy.get(".collections a:first-child").click()

        cy.wait(2000)

        cy.get("#deleteCollection").click()

        cy.wait(2000)

        cy.url().should("eq", Cypress.env("localHost") + "kolekce")
        cy.get("#noCollectionMessage").should("be.visible")
    })
})