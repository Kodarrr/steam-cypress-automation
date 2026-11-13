const ROWS='#search_resultsRows .search_result_row'
class SearchResultPage{
    elements={
        searchInput : ()=> cy.get('[id="term"][name="displayterm"]'),
        rows : ()=> cy.get(ROWS)
    }
    verifyPageLoaded(){
        cy.url().should('include','/search')
    }
    verifySearchBox(term){
        this.elements.searchInput().should('have.value',term)
    }

    extractGameData(row){
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

    getGameDataByIndex(index){
        return this.extractGameData(this.elements.rows().eq(index))
    }

    getGameDataByName (gameName){
        return this.extractGameData(cy.contains(`${ROWS} .title`, new RegExp(`^${gameName}$`)).closest('.search_result_row'))
    }

    verifyFirstResultName(name){
        this.elements.rows().eq(0).find('.title').should('have.text',name)
    }

    search(term){
        cy.intercept('GET','/search/results*').as('searchResults')
        this.elements.searchInput().clear().type(`${term}{enter}`)
        cy.wait('@searchResults').its('response.statusCode').should('eq',200)
    }

    verifyResultsContain(gameNames) {
        cy.get(`${ROWS} .title`).then(($titles) => {
            const resultTitles = [...$titles].map((el) => el.innerText.trim())

            gameNames.forEach((name) => {
            expect(resultTitles, `"${name}" not found.`).to.include(name)
            })
        })
    }

    verifyGameData(storedGame){
        this.getGameDataByName(storedGame.name).then((data)=>{
            expect(data).to.deep.equal(storedGame)
        })
    }

    
}

export default new SearchResultPage()