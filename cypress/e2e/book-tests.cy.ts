describe("book-tests spec", () => {    
    it("create-test", () => {
        const authEndPoint = "login"
        const testEndPoint = "testy"
        const collectionEndPoint = "kolekce"

        cy.logout(Cypress.env("env").localHost) // for clearing Firebase auth
        cy.login(Cypress.env("env").localHost + authEndPoint, Cypress.env("env").testEmail, Cypress.env("env").testPassword)
        
        cy.wait(3000)

        cy.visit(Cypress.env("env").localHost + collectionEndPoint)

        cy.wait(1000)

        cy.get("div .btn").click()
    
        cy.get("#title-textfield").type(Cypress.env("env").testCollectionName)
    
        cy.get("button[type='submit']").click()

        cy.wait(3000)

        cy.visit(Cypress.env("env").localHost + testEndPoint)
        cy.get("#new-test button").click()

        cy.wait(1000) // need for fetching collections

        cy.get(".collections-select").click()
        cy.get("div.v-list-item-title").parent().parent(":first-child").click()
        cy.get(".collections-select").click()

        cy.get(".new-question-textfield").type("Otazka 1")
        cy.get("#add-answer-icon").click()
        cy.get(".new-answer-textfield").type("Odpoved 1")
        cy.get(".save-answer-button").click()
        cy.get(".is-correct-answer-radio input[type='radio']").click()
        cy.get("#add-answer-icon").click()
        cy.get(".new-answer-textfield").type("Odpoved 2")
        cy.get(".save-answer-button").click()
        cy.get("#save-question-button").click()

        cy.get(".new-question-textfield").type("Otazka 2")
        cy.get("#add-answer-icon").click()
        cy.get(".new-answer-textfield").type("Odpoved 3")
        cy.get(".save-answer-button").click()
        cy.get(".is-correct-answer-radio input[type='radio']").click()

        cy.get("#add-answer-icon").click()
        cy.get(".new-answer-textfield").type("Odpoved 4")
        cy.get(".save-answer-button").click()

        cy.get("#save-question-button").click()

        cy.get("#save-test-button").click()
        cy.get("#new-test-name").type(Cypress.env("env").nameOfTest)
        cy.get("#save-new-test").click()

        cy.visit(Cypress.env("env").localHost + testEndPoint + "/vyber")

        cy.get('.passed_tests').click()
        cy.get("td:first-of-type").should("contain", Cypress.env("env").nameOfTest)
    })
})