describe('Custom commands', () => {

    it('handling links', () => {

        cy.visit('https://demo.nopcommerce.com/');

        // Using the custom clickLink command
        cy.clickLink('Apple MacBook Pro 13-inch');

        cy.get("div[class='product-name'] h1")
            .should('have.text', 'Apple MacBook Pro 13-inch');

    });


    it('overwriting existing command', () => {

        cy.visit('https://demo.nopcommerce.com/');

        // Text matching is case-insensitive
        cy.clickLink('APPLE MACBOOK PRO 13-inch');

        cy.get("div[class='product-name'] h1")
            .should('have.text', 'Apple MacBook Pro 13-inch');

    });


    it.only('Login command', () => {

        cy.visit('https://demo.nopcommerce.com/');

        cy.clickLink('Log in');

        cy.loginapp('your-test-email@example.com', 'your-test-password');

        cy.get('.ico-account')
            .should('have.text', 'My account');

    });

});