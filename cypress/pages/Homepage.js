class Homepage{
    elements={
        searchInput: ()=> cy.get('[name="term"]')
    }

    visit(){
        cy.visit('/')
        this.elements.searchInput().should('be.visible')
    }

    search(term){
        this.elements.searchInput().type(`${term}{enter}`)
    }
}

export default new Homepage()