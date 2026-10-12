//import 'cypress-iframe';
require('@4tw/cypress-drag-drop');

describe("Mouse Operations", () => {

    it.skip('MouseHover', () => {

        cy.visit("http://localhost:8080/");

       /* cy.get(".open > .dropdown-menu > .dropdown-inner > .list-unstyled > :nth-child(2) > a")
            .should('not.be.visible');*/

        cy.get('.nav > :nth-child(1) > .dropdown-toggle').trigger('mouseover').click();

        cy.get(".open > .dropdown-menu > .dropdown-inner > .list-unstyled > :nth-child(2) > a")
            .should('be.visible');

    });

    it.skip('Right click', () => {

        cy.visit("http://swisnl.github.io/jQuery-contextMenu/demo.html");

        // Approach 1
        /*
        cy.get('.context-menu-one.btn.btn-neutral').trigger('contextmenu');
        cy.get('.context-menu-icon-copy > span').should('be.visible');
        */

        // Approach 2
        cy.get('.context-menu-one.btn.btn-neutral').rightclick();

        cy.get('.context-menu-list').should('be.visible');

    });

    it.skip('Double click', () => {

        cy.visit("https://www.w3schools.com/tags/tryit.asp?filename=tryhtml5_ev_ondblclick");

        cy.frameLoaded('#iframeResult'); // Load the frame

        // Approach 1 - trigger()
        /*
        cy.iframe('#iframeResult').find("button[ondblclick='myFunction()']").trigger('dblclick');
        cy.iframe('#iframeResult').find('#field2').should('have.value', 'Hello World!');
        */

        // Approach 2 - dblclick()
        cy.iframe('#iframeResult').find("button[ondblclick='myFunction()']").dblclick();

        //cy.iframe('#iframeResult').find('#demo').should('have.value', 'Hello World');

    });

    it.skip('Drag and Drop using plugin', () => {

        cy.visit("http://www.dhtmlgoodies.com/scripts/drag-drop-custom/demo-drag-drop-3.html");

        cy.get('#box6').should('be.visible');

        cy.get('#box106').should('be.visible');

        cy.wait(3000);

        cy.get('#box6').drag('#box106', { force: true });

    });

    it.only('Scrolling Page', () => {

        cy.visit('https://www.countries-ofthe-world.com/flags-of-the-world.html');

        cy.get(':nth-child(1) > tbody > :nth-child(86) > :nth-child(1) > img')
            .scrollIntoView({ duration: 2000 });

        cy.get(':nth-child(1) > tbody > :nth-child(86) > :nth-child(1) > img')
            .should('be.visible');

    });




    

    

    


    

});