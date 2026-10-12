/// <reference types="cypress" />

describe("Check UI Elements", () => {

    it("Checking Radio Buttons", () => {

        cy.visit("https://qaplayground.com/practice/radio-checkbox?utm_source=chatgpt.com")

        // Visibility of radio buttons
       /* cy.get("input#radio-plan-pro").should('be.visible')
        cy.get("input#radio-plan-business").should('be.visible') */

        // Selecting radio buttons
       /* cy.get("input#radio-plan-pro").check().should('be.checked')
        cy.get("input#radio-plan-business").should('not.be.checked') */

        // Selecting business radio button
        cy.get("input#radio-plan-business").check().should('be.checked')
        cy.get("input#radio-plan-pro").should('not.be.checked')

    })

})