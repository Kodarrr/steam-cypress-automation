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

const extractGameData = (row)=>{
  const game={}
  row.within(()=>{
    //Name extract
    cy.get('.title').invoke('text').then((text) => {
      game.name = text.trim()
    })
    //release date
    cy.get('.search_released').invoke('text').then((text) => {
      game.releaseDate = text.trim()
    })
    //platforms
    cy.get('.search_platforms').then(($var)=>{
        game.platforms = {
            windows : $var.find('.win').length>0,
            mac : $var.find('.mac').length>0,
            linux : $var.find('.linux').length>0

        }
    })
    //review,price
    cy.root().then(($row)=>{
        const $review = $row.find('.search_review_summary')
        game.review = $review.length?$review.attr('data-tooltip-html').split('<br>')[0].trim()
                       : "No Reviews"
        const $price = $row.find('.discount_final_price')
        game.price = $price.length ? $price.text().trim() : 'N/A'
    })
  })
  return cy.wrap(game)
}

const getGameDataByIndex=(index)=>{
  return extractGameData(cy.get('#search_resultsRows .search_result_row').eq(index))
}

const getGameDataByName = (game_name)=>{
  return extractGameData(cy.contains(`${'#search_resultsRows .search_result_row'} .title`, new RegExp(`^${game_name}$`)).closest('.search_result_row'))
}

describe('Search box',()=>{
    it('search',()=>{
        cy.visit('/')
        cy.get('[name="term"]').type('Dota 2{enter}')
        cy.url().should('include','term=Dota+2')
        cy.get('[id="term"][name="displayterm"]').should('have.value','Dota 2')
        cy.get('[id="search_resultsRows"] [class="search_result_row ds_collapse_flag  app_impression_tracked"]').eq(0).find('.title').should('have.text','Dota 2')
        getGameData(0).as('firstGame') 
        getGameData(1).as('secondGame')

        cy.get('@firstGame').then((game) => cy.log(JSON.stringify(game)))
        cy.get('@secondGame').then((game) => cy.log(JSON.stringify(game)))

        cy.get('@secondGame').then((game)=>{
            //name
            
            cy.get('[id="term"]').clear().type(`${game.name}{enter}`)

            cy.get('#search_resultsRows .search_result_row')
            .first()
            .find('.title')
            .should('have.text', game.name)
            
        })

        cy.get('@firstGame').then((firstGame)=>{
          cy.get('@secondGame').then((secondGame)=>{
            //serach box check
            cy.get('[id="term"]').should('have.value',secondGame.name)

            const storedGames=[firstGame,secondGame]
            // 6.2 Both stored games are present in the result list
            cy.get(`${'#search_resultsRows .search_result_row'} .title`).then(($titles) => {
              const resultTitles = [...$titles].map((el) => el.innerText.trim())

              storedGames.forEach((storedGame) => {
                expect(resultTitles, `Results for "${secondGame.name}"`).to.include(storedGame.name)
              })
            })

            storedGames.forEach((storedGame)=>{
              getGameDataByName(storedGame.name).then((curr_game)=>{
                expect(curr_game).to.deep.equal(storedGame)
              })
            })
          })
        })
    })
})
