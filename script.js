const container = document.querySelector("#container");
const messageText = document.getElementById("gameMessage")
const restartButton = document.getElementById("restart")
const p1ScoreText = document.getElementById("XScore")
const p2ScoreText = document.getElementById("OScore")

//Create gameboard with factory function, IIFE 
const gameBoard = (function() {
    let board = [['','',''],['','',''],['','','']]

    function display() {
        while (container.firstChild) { 
            container.firstChild.remove()
        }

        for (let i=0 ; i<3 ; i++){
            const gridRow = document.createElement("div")
            gridRow.classList.add("gridRow")
            for (let j=0 ; j<3 ; j++){
                const gridItem = document.createElement("div")
                gridItem.classList.add("gridItem")
                gridItem.setAttribute("value", `${i},${j}`)
                gridRow.appendChild(gridItem)
  
                const gridIcon = document.createElement("p")
                gridIcon.innerHTML = board[i][j]
                gridItem.appendChild(gridIcon)
            }
            container.appendChild(gridRow)
        } 
    }

    function isTileValid(positionX, positionY){
        return board[positionX][positionY] == "" ? true : false
    }

    function placeTile (player, tilePosX, tilePosY){
        const tileType = player.tileType
        board[tilePosX][tilePosY] = tileType
        display()
    }

    function checkIfBoardFull(){
        if (board.flat(Infinity).includes('')) return false
        else return true
    }

    function resetBoard(){
        board = [['','',''],['','',''],['','','']]
        display()
    }

    return {display, isTileValid, placeTile, checkIfBoardFull, resetBoard}
})()

//Create game logic object with factory function, IIFE 
const controller = (function() { 
    const player1 = createPlayer('X')
    const player2 = createPlayer('O')
    let currentPlayer = player1

    restartButton.addEventListener("click", resetGame)

    gameBoard.display()
    startTurn()

    function startTurn() {
        messageText.innerHTML = currentPlayer.tileType + " make your selection"

        container.addEventListener("click", _clickHandler)

        function _clickHandler (event){
        const targetID = event.target.getAttribute("value")
            if (targetID){ //if click is on a tile
                const tilePos = targetID.split(','); //Split the tile elements's value attributes for X and Y
                const tilePosX = tilePos[0]
                const tilePosY = tilePos[1]

                if (gameBoard.isTileValid(tilePosX,tilePosY)){ //validates if tile is emty
                    container.removeEventListener("click", _clickHandler)
                    makeTileSelection(tilePosX, tilePosY)
                }
            }
        }
    }

    function makeTileSelection(xVal,yVal){ //places the tile on the board
        gameBoard.placeTile (currentPlayer, xVal, yVal)
        currentPlayer.recordTile(xVal, yVal) //records the tile placement of the player
        if (currentPlayer.checkForWin()) triggerWin()
        else if (gameBoard.checkIfBoardFull()) triggerTie()
        else switchTurn()
    }

    function switchTurn(){
        currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1
        startTurn()
    }

    function triggerWin(){
        messageText.innerHTML =  "you're winner " + currentPlayer.tileType + " !"
        currentPlayer.addScore()
        console.log(currentPlayer.getScore())
        p1ScoreText.innerText=player1.getScore()
        p2ScoreText.innerText=player2.getScore()
    }

    function triggerTie(){
        messageText.innerHTML =  "yo wtf"
    }

    function resetGame(){
        gameBoard.resetBoard()
        player1.resetTilePlacements()
        player2.resetTilePlacements()
        startTurn()
    }
})()

function createPlayer (tileType) {
    let placedTiles = [] //keeps tracks of all tiles this player as placed
    let totalScore = 0;

    function recordTile(xVal,yVal){
        placedTiles.push({x: xVal, y: yVal})
    }

    function checkForWin(){
        let xCounter = [0, 0 ,0]
        let yCounter = [0, 0, 0]
        let iCounter = 0
        let jCounter = 0

        for (index in placedTiles){
            xCounter[placedTiles[index].x]++
            yCounter[placedTiles[index].y]++

            if (placedTiles[index].x === placedTiles[index].y) iCounter++    
            if ((Number(placedTiles[index].x) + Number(placedTiles[index].y)) === 2 ) jCounter++
        }
        if (xCounter.concat(yCounter).includes(3) || iCounter >= 3 || jCounter >= 3) return true
    }
    function addScore(){
        totalScore++
    }
    function getScore(){
        return totalScore
    }
    function resetTilePlacements(){
        placedTiles = []
        xCounter = [0, 0 ,0]
        yCounter = [0, 0, 0]
        iCounter = 0
        jCounter = 0
    }
    return {tileType, recordTile, checkForWin, addScore, getScore, resetTilePlacements}
}