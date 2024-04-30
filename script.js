const xInput = document.getElementById("xInput")
const yInput = document.getElementById("yInput")
const messageText = document.getElementById("gameMessage")
const button = document.getElementById("button")

//Create gameboard with factory function, IIFE 
const gameBoard = (function() {
    const board = [['_','_','_'],['_','_','_'],['_','_','_']]

    function display() {
        console.log("Current board")
        console.log(board[0])
        console.log(board[1])
        console.log(board[2])
    }

    function isTileValid(positionX, positionY){
        return board[positionY][positionX] === '_' ? true : false
    }

    function placeTile (player, positionX, positionY){
        const tileType = player.tileType
        board[positionY][positionX] = tileType
    }

    return {display, isTileValid, placeTile}
})()

//Create game logic object with factory function, IIFE 
const controller = (function() { 
    const player1 = createPlayer('X')
    const player2 = createPlayer('O')
    let currentPlayer = player1

    startTurn()

    function startTurn() {
        gameBoard.display()
        messageText.innerHTML = currentPlayer.tileType + " make your selection"
        button.addEventListener("click", (event) => {
            makeTileSelection(xInput.value, yInput.value)
        })
    }

    function switchTurn(){
        //currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1
        startTurn()
    }

    function makeTileSelection(xVal,yVal){
        if (gameBoard.isTileValid(xVal,yVal)){
            gameBoard.placeTile (currentPlayer, xVal, yVal)
            currentPlayer.recordTile(xVal, yVal)
            currentPlayer.checkForWin()
            switchTurn()
        }
    }
})()

function createPlayer (tileType) {
    const placedTiles = []

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
            if (placedTiles[index].x + placedTiles[index].y === 2) jCounter++
        }

        console.log(xCounter)
        console.log(yCounter)
        console.log(iCounter)
        console.log(jCounter)
    }

    return {tileType, recordTile, checkForWin}
}