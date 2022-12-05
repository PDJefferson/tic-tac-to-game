import XComponent from '../components/game/XComponent'
import OComponent from '../components/game/OComponent'
import checkWinner from './winnerLogic'
import checkAllCellsTaken from './checkCellsTaken'
export default function minimaxAlgo(currentCellTaken, turn) {
  //getting a copy of the board to write on it
  const temporaryBoard = [...currentCellTaken]
  //var to count the best score achievable from going through a random cell 
  //to ending the game
  let maxScore = -Infinity
  let bestMove
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      //if the cell has not been selected
      if (temporaryBoard[i][j] === undefined) {
        //temporarily placing the ai position
        temporaryBoard[i][j] = <XComponent key={'xUser'} />
        //running the algo recursively to find the optimal position
        //by going through every single position the ai can take
        let score = minimax(temporaryBoard, 0, false, turn)
        //resetting to default
        temporaryBoard[i][j] = undefined
        //replace the old score with the new one if we find a better position for the ai move
        if (score > maxScore) {
          maxScore = score
          bestMove = { i, j }
        }
      }
    }
  }

  //if the user has taken the mid position at first, take the top left corner since it is the 2nd best position
  return bestMove ? bestMove : { i: 0, j: 0 }
}
//recursively goes through every single position of the board, to find the most optimal position that will lead to win or worst case scenario, tie.
function minimax(temporaryBoard, depth, isFirst, turn) {
  let result = checkWinner(temporaryBoard)
  if (result) {
    //if the result leads to oUser( the current user playing against the ai) 
    //winning then return remove one to the score,
    if (result === 'oUser has won') {
      return -1
    } else if (result === 'xUser Has Won') { //if the ai wins then add one to it
      return 1
    }
  } else {
    //if it is a tie return 0
    if (checkAllCellsTaken(temporaryBoard) === true) {
      return 0
    }
    //if the ai goes first, check all possible plays
    if (isFirst) {
      let bestScore = -Infinity
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          //go through every position of the board
          if (temporaryBoard[i][j] === undefined) {
            temporaryBoard[i][j] = <XComponent key="xUser" />
            //recursively goes trough the path that will lead from taking the current cell
            let score = minimax(temporaryBoard, depth + 1, false, turn)
            temporaryBoard[i][j] = undefined
            bestScore = Math.max(score, bestScore)
          }
        }
      }
      return bestScore
    } else {
      //the algo also mimics the user positions to account for what could happen
      //if the user takes an specific cell while the ai has picked a x cell
      let bestScore = Infinity
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (temporaryBoard[i][j] === undefined) {
            temporaryBoard[i][j] = <OComponent key="oUser" />
            let score = minimax(temporaryBoard, depth + 1, true, turn)
            temporaryBoard[i][j] = undefined
            bestScore = Math.min(score, bestScore)
          }
        }
      }
      return bestScore
    }
  }
}
