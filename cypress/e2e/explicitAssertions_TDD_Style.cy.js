describe("Assertions demo", () => {

    it("Explicit assertions", () => {

        cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")

        cy.get("input[placeholder='Username']")
            .type("Admin")

        cy.get("input[placeholder='Password']")
            .type("admin123")

        cy.get("button[type='submit']")
            .click()

        let expName = "Automation QE"

        cy.get(".oxd-userdropdown-name").then((x) => {

            let actName = x.text()

            // TDD Style
            assert.equal(actName, expName)
           // assert.notEqual(actName, expName)

        })

    })

})