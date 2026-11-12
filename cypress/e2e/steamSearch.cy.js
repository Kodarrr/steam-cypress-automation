const getGameData = (index) => {
  const game = {}

  cy.get('#search_resultsRows .search_result_row').eq(index).within(() => {
    // NAME
    cy.get('.title').invoke('text').then((text) => {
      game.name = text.trim()
    })

    // RELEASE DATE
    cy.get('.search_released').invoke('text').then((text) => {
      game.releaseDate = text.trim()
    })

    // PLATFORMS: TODO
    cy.get('.search_platforms').then(($var)=>{
        game.platforms = {
            windows : $var.find('.win').length>0,
            mac : $var.find('.mac').length>0,
            linux : $var.find('.linux').length>0

        }
    })
    // REVIEW: TODO
    // cy.get('.search_review_summary').invoke('text').then((text)=>{
    //     game.review = text
    // })
    cy.root().then(($row)=>{
        const $review = $row.find('.search_review_summary')
        game.review = $review.length?$review.attr('data-tooltip-html').split('<br>')[0].trim()
                       : "No Reviews"
        const $price = $row.find('.discount_final_price')
        game.price = $price.length ? $price.text().trim() : 'N/A'
    })
    // PRICE: TODO
    // cy.get('.discount_final_price').invoke('text').then((text)=>{
    //     game.price= text.trim()
    // })

  })

  return cy.wrap(game)
}

describe('Search box',()=>{
    it('search',()=>{
        cy.visit('https://store.steampowered.com/')
        cy.get('[name="term"]').type('dota 2{enter}')
        cy.url().should('include','term=dota+2')
        cy.get('[id="term"][name="displayterm"]').should('have.value','dota 2')
        cy.get('[id="search_resultsRows"] [class="search_result_row ds_collapse_flag  app_impression_tracked"]').eq(0).find('.title').should('have.text','Dota 2')
        getGameData(0).as('firstGame') 
        getGameData(1).as('secondGame')

        cy.get('@firstGame').then((game) => cy.log(JSON.stringify(game)))
        cy.get('@secondGame').then((game) => cy.log(JSON.stringify(game)))
    })
})
