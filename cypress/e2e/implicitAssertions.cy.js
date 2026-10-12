describe('Assertions', () =>{
    it('Practicing implicit assertions', ()=>{
        cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login")

    
        /*cy.url().should('include','orangehrmlive.com')
        cy.url().should('eq','https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        cy.url().should('contain','orangehrmlive.com')*/

        //chaining assertions using and keyword
        /*cy.url().should('include','orangehrmlive.com')
        .and('eq','https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
        .and('contain','orangehrmlive.com')*/

        //Title assertions
       /* cy.title().should('include','Orange')
        .should('eq','OrangeHRM')
        .and('contain','HRM')*/

        /* cy.get('.orangehrm-login-branding > img')
            .should('be.visible')
            .and('exist')*/

         // Number of links
       /* cy.xpath('//a')
         .should('have.length', 13)*/

           // Enter username
        cy.get("input[placeholder='Username']")
            .type("Admin")

        // Verify username value
        cy.get("input[placeholder='Username']")
            .should('have.value', 'Admin')



    })
})