describe('mysuite', () => {

    it('Capture screenshots and videos', () => {

        cy.visit('https://demo.opencart.com/');

        // Capture the home page screenshot
        cy.screenshot('homepage');

        // Wait for 5 seconds, as shown in the tutorial
        cy.wait(5000);

        // Capture a screenshot of the logo
        cy.get('img[title="Your Store"]')
            .screenshot('logo');

    });


    it('Automatically capture screenshot and video on failure', () => {

        cy.visit('https://demo.opencart.com/');

        // Click the category link shown in the tutorial
        cy.get('li:nth-child(7) a:nth-child(1)').click();

        // Intentionally incorrect expected heading
        // This test should fail if the heading is not Tablets
        cy.get("div[id='content'] h2")
            .should('have.text', 'Tablets');

    });

});