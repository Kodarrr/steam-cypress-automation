describe('Search box',()=>{
    it('search',()=>{
        cy.visit('https://store.steampowered.com/')
        cy.get('[name="term"]').type('dota 2{enter}')
        cy.url().should('include','https://store.steampowered.com/search?term=dota+2')
        cy.get('[id="term"][name="displayterm"]').should('have.value','dota 2')
    })
})
