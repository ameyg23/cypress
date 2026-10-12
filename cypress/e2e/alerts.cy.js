describe('Alerts', () => {

    // 1. JavaScript Alert
    // Alert contains text and an OK button

    it.only('JS alert', () => {

        cy.visit('https://the-internet.herokuapp.com/javascript_alerts');

        // Listen for the alert before triggering it
        cy.on('window:alert', (text) => {
            expect(text).to.contain('I am a JS Alert');
        });

        // Trigger the alert
        cy.get("button[onclick='jsAlert()']").click();

        // Cypress automatically accepts the alert
        cy.get('#result')
            .should('have.text', 'You successfully clicked an alert');

    });


    // 2. JavaScript Confirm Alert
    // Confirm contains text with OK and Cancel buttons
    // By default, Cypress selects OK

    it('JS confirm alert - OK', () => {

        cy.visit('https://the-internet.herokuapp.com/javascript_alerts');

        cy.on('window:confirm', (text) => {
            expect(text).to.contain('I am a JS Confirm');

            // Returning true means OK
            return true;
        });

        cy.get("button[onclick='jsConfirm()']").click();

        cy.get('#result')
            .should('have.text', 'You clicked: Ok');

    });


    // 3. JavaScript Confirm Alert
    // Selecting Cancel

    it('JS confirm alert - Cancel', () => {

        cy.visit('https://the-internet.herokuapp.com/javascript_alerts');

        cy.on('window:confirm', (text) => {
            expect(text).to.contain('I am a JS Confirm');

            // Returning false means Cancel
            return false;
        });

        cy.get("button[onclick='jsConfirm()']").click();

        cy.get('#result')
            .should('have.text', 'You clicked: Cancel');

    });


    // 4. JavaScript Prompt Alert
    // Prompt contains a text box for user input

    it('JS prompt alert', () => {

        cy.visit('https://the-internet.herokuapp.com/javascript_alerts');

        cy.window().then((win) => {

            cy.stub(win, 'prompt')
                .returns('welcome');

        });

        cy.get("button[onclick='jsPrompt()']").click();

        cy.get('#result')
            .should('have.text', 'You entered: welcome');

    });


    // 5. Basic Authentication

    it('Authenticated alert', () => {

        cy.visit('https://the-internet.herokuapp.com/basic_auth', {
            auth: {
                username: 'admin',
                password: 'admin'
            }
        });

        cy.get("div[class='example'] p")
            .should('contain', 'Congratulations');

    });

});