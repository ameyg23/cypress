describe('cssLocators', ()=>{
    it('practicing css locators',()=>{
        cy.visit("https://tutorialsninja.com/demo/")
        cy.get("[name='search']").type("MacBook")
        cy.get("button[class='btn btn-default btn-lg']").click()

        // CSS Selectors
// -------------
// tag
// id
// tag class
// tag attribute
// tag class attribute
//
// Examples:
// tag#id
// tag.class
// tag[attribute='value']
// tag.class[attribute='value']
    })
})