describe('Handling Frames', () => {

    // ============================================================
    // APPROACH 1
    // Directly handling iframe using contentDocument
    // ============================================================

    it('Approach 1 - Using contentDocument', () => {

        cy.visit('https://the-internet.herokuapp.com/iframe');

        const iframe = cy.get('#mce_0_ifr')
            .its('0.contentDocument.body')
            .should('be.visible')
            .then(cy.wrap);

        iframe
            .clear()
            .type('Welcome {cmd+a}');

        cy.get('[aria-label="Bold"]').click();

    });


    // ============================================================
    // APPROACH 2
    // Handling iframe using custom Cypress command
    // ============================================================

    it('Approach 2 - Using Custom Command', () => {

        cy.visit('https://the-internet.herokuapp.com/iframe');

        cy.getIframe('#mce_0_ifr')
            .clear()
            .type('Welcome {cmd+a}');

        cy.get('[aria-label="Bold"]').click();

    });


    // ============================================================
    // APPROACH 3
    // Handling iframe using cypress-iframe plugin
    // ============================================================

    it('Approach 3 - Using cypress-iframe Plugin', () => {

        cy.visit('https://the-internet.herokuapp.com/iframe');

        cy.frameLoaded('#mce_0_ifr');

        cy.iframe('#mce_0_ifr')
            .clear()
            .type('Welcome {cmd+a}');

        cy.get('[aria-label="Bold"]').click();

    });

});