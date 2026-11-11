describe('Fundamentals', () => {
  it('navbar showing correctly', () => {
    cy.visit('https://store.steampowered.com/')
    cy.get('input[name="term"][role="combobox"]').should('be.visible')
  })
})