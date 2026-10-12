describe('xpath Locators', ()=>{
    it('praccticing xpath locators',()=>{
        cy.visit("https://tutorialsninja.com/demo/")
        cy.xpath("//input[@name='search']").type("MacBook")
        cy.xpath("//button[@class='btn btn-default btn-lg']").click()
    })
})