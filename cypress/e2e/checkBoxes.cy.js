/// <reference types="cypress" />

describe("Check UI Elements", () => {

    it("Checking Check boxes", () => {

        // The site throws an unrelated React hydration error on load;
        // ignore it so it doesn't fail this test.
        cy.on('uncaught:exception', () => false)

        cy.visit("https://qaplayground.com/practice/radio-checkbox?utm_source=chatgpt.com")

        // Visibility of the element
        cy.get("input#skill-playwright").should('be.visible')

        // Selecting single check box
        //cy.get("input#skill-playwright").check().should('be.checked')

        // Unselecting checkbox
       // cy.get("input#skill-playwright").uncheck().should('not.be.checked')

        // Selecting all the check boxes
       cy.get("input[name='skills']") .check() .should('be.checked')

        // Select first checkbox
       /*cy.get("input[name='skills']")
            .first()
            .check() */

        // Select last checkbox
     /* cy.get("input[name='skills']")
            .last()
            .check() */

    })

})