describe('mysuite', () => {

    it('NavigationTest', () => {

        // Open the home page
        cy.visit('https://demo.opencart.com/');

        cy.title().should('eq', 'Your Store');

        // Click the Cameras category
        cy.get('li:nth-child(7) a:nth-child(1)').click();

        cy.get("div[id='content'] h2")
            .should('have.text', 'Cameras');

        // Navigate back to the home page
        cy.go('back');

        cy.title().should('eq', 'Your Store');

        // Navigate forward to Cameras
        cy.go('forward');

        cy.get("div[id='content'] h2")
            .should('have.text', 'Cameras');

        // Go back using a numerical value
        cy.go(-1);

        cy.title().should('eq', 'Your Store');

        // Go forward using a numerical value
        cy.go(1);

        cy.get("div[id='content'] h2")
            .should('have.text', 'Cameras');

        // Reload the current page
        cy.reload();

    });

});