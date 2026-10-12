

describe('handle dropdowns', () => {

    it.skip('Dropdown with select', () => {

        cy.visit('https://example.cypress.io/commands/actions')

        cy.get('.action-select')
            .select('oranges')
            .should('have.value', 'fr-oranges')

    })


    it.skip('Dropdown without select', () => {

        cy.visit('https://www.dummyticket.com/dummy-ticket-for-visa-application/')

        cy.get('#select2-billing_country-container').click()

        cy.get('.select2-search__field')
            .type('Japan')
            .type('{enter}')

        cy.get('#select2-billing_country-container')
            .should('have.text', 'Japan')

    })


    it.skip('Auto suggest dropdown', () => {

        cy.visit('https://www.wikipedia.org/')

        cy.get('#searchInput')
            .type('Delhi')

        cy.get('.suggestion-title')
            .contains('Delhi Metro')
            .click()

    })


    it('Dynamic dropdown', () => {

        cy.visit('https://www.google.com/')

        cy.get('#ti6dpd')
            .type('cypress automation')

        cy.wait(3000)

        cy.get('div.wM6W7d>span')
            .should('have.length', 12)

        cy.get('div.wM6W7d>span').each(($el, index, $list) => {

            if ($el.text() === 'cypress automation tutorial') {

                cy.wrap($el).click()

            }

        })

        cy.get('#ti6dpd')
            .should('have.value', 'cypress automation tutorial')

    })

})