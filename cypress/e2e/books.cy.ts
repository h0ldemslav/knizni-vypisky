describe("books spec", () => {
  it("find-book-and-open-detail", () => {
    cy.visit(Cypress.env("env").localHost)

    cy.get(".search-field").type(Cypress.env("env").testBooks[0] + "{enter}")

    cy.wait(3000) // waiting for API data

    cy.get(".books a:first-child").click()

    cy.get(".intro-section h2").should("have.text", Cypress.env("env").testBooks[0])
  })

  it("create-collection-and-add-book", () => {
    const collectionEndpoint = "kolekce"
    const authEndPoint = "login"

    cy.logout(Cypress.env("env").localHost) // for clearing Firebase auth

    cy.login(Cypress.env("env").localHost + authEndPoint, Cypress.env("env").testEmail, Cypress.env("env").testPassword)

    cy.wait(3000) // waiting for user authentication

    cy.visit(Cypress.env("env").localHost + collectionEndpoint)

    cy.get("div .btn").click()

    cy.get("#title-textfield").type(Cypress.env("env").testCollectionName)

    cy.get("button[type='submit']").click()

    cy.wait(3000) // waiting for Firebase add operation

    cy.visit(Cypress.env("env").localHost)

    cy.get(".search-field").type(Cypress.env("env").testBooks[1] + "{enter}")

    cy.wait(3000) // waiting for API data

    cy.get(".books a:first-child").click()

    cy.get(".intro-section h2").should("have.text", Cypress.env("env").testBooks[1])

    cy.wait(3000) // waiting for Firebase data

    cy.get(".collections-select").click()
    cy.get('div.v-list-item-title').parent().parent(":first-child").click()
    cy.get(".collections-select").click()
    cy.get(".collections-select + .action-buttons button:last-child").click()

    cy.wait(3000) // waiting for Firebase add operation

    cy.reload()

    cy.wait(3000) // waiting for Firebase data

    cy.get(".collections-select").click()
    cy.get("div.v-list-item-title").parent().parent().should("contain", Cypress.env("env").testCollectionName)
  })

  it("edit-collection", () => {
    const updatedExtraTitle = "222"
    const collectionEndpoint = "kolekce"
    const authEndPoint = "login"

    cy.logout(Cypress.env("env").localHost) // for clearing Firebase auth

    cy.login(Cypress.env("env").localHost + authEndPoint, Cypress.env("env").testEmail, Cypress.env("env").testPassword)

    cy.wait(3000) // waiting for user authentication

    cy.visit(Cypress.env("env").localHost + collectionEndpoint)

    cy.wait(3000) // waiting for Firebase add operation

    cy.get(".collections a:first-child").click()

    cy.get("#editCollection").click()

    cy.get("#title-textfield").type(updatedExtraTitle)

    cy.get("button[type='submit']").click()

    cy.wait(2000)

    cy.get("h1:first-child").should("contain", Cypress.env("env").testCollectionName + updatedExtraTitle)
  })

  it("delete-collection", () => {
    const collectionEndpoint = "kolekce"
    const authEndPoint = "login"

    cy.logout(Cypress.env("env").localHost) // for clearing Firebase auth

    cy.login(Cypress.env("env").localHost + authEndPoint, Cypress.env("env").testEmail, Cypress.env("env").testPassword)

    cy.wait(3000) // waiting for user authentication

    cy.visit(Cypress.env("env").localHost + collectionEndpoint)

    cy.wait(3000) // waiting for Firebase add operation

    cy.get(".collections a:first-child").click()

    cy.wait(2000)

    cy.get("#deleteCollection").click()

    cy.wait(2000)

    cy.url().should("eq", Cypress.env("env").localHost + collectionEndpoint)
    cy.get("#noCollectionMessage").should("be.visible")
  })
})