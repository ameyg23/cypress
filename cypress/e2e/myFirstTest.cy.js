describe ('My First Test',()=>{
    it('Verify positive title', ()=>{
        cy.visit("https://www.saucedemo.com/")
        cy.title().should('eq','Swag Labs')
    })


    it('verify title negative case', ()=>{
        cy.visit("https://www.saucedemo.com/")
        cy.title().should('eq',"Sauce demo")

    })
})