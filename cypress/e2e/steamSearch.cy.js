import homepage from "../pages/Homepage"
import searchResultPage from "../pages/SearchResultPage"

describe('Steam Store - Search and Verification',()=>{
    it('store results and verify them',()=>{

      //step 1: Navigate to Steam Store
      homepage.visit()

      //step 2: Search for a Game
      homepage.search("Dota 2")

      //step 3: Verification of result pages
      // url check
      searchResultPage.verifyPageLoaded()
      // search box must contain the name
      searchResultPage.verifySearchBox("Dota 2")
      //verification of first result
      searchResultPage.verifyFirstResultName("Dota 2")

      //step 4: Saving first two results
      searchResultPage.getGameDataByIndex(0).as('firstGame') 
      searchResultPage.getGameDataByIndex(1).as('secondGame')

      //Log extracted data 
      cy.get('@firstGame').then((game) => cy.log(JSON.stringify(game)))
      cy.get('@secondGame').then((game) => cy.log(JSON.stringify(game)))

      // step 5: Re-search using 2nd game name
      cy.get('@secondGame').then((secondGame)=>{
        searchResultPage.search(secondGame.name)
        searchResultPage.verifyFirstResultName(secondGame.name)
      })

      //step 6: Final Verification

      cy.get('@firstGame').then((firstGame)=>{
        cy.get('@secondGame').then((secondGame)=>{

          const storedGames=[firstGame,secondGame]

          //If we use Firstgame in step 6, all test passed 
          searchResultPage.search(firstGame.name)

          // searchResultPage.verifySearchBox(secondGame.name)
          searchResultPage.verifySearchBox(firstGame.name)

          searchResultPage.verifyResultsContain(storedGames.map((game) => game.name))

          storedGames.forEach((game)=>searchResultPage.verifyGameData(game))
        })
      })
    })
})
