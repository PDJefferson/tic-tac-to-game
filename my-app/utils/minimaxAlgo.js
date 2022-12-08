import XComponent from '../components/game/XComponent'
import OComponent from '../components/game/OComponent'
import checkWinner from './winnerLogic'
import checkAllCellsTaken from './checkCellsTaken'
import { GAME_SETTINGS } from '../constants/game'
export default function minimaxAlgo(currentCellTaken, turn) {
  //getting a copy of the board to write on it
  const temporaryBoard = [...currentCellTaken]
  let score = minimax(temporaryBoard, GAME_SETTINGS.X_USER)
  return { i: score.i, j: score.j }
}
//recursively goes through every single position of the board, to find the most optimal position that will lead to win or worst case scenario, tie.
function minimax(temporaryBoard, player) {
  let result = checkWinner(temporaryBoard)
  //if the result leads to oUser( the current user playing against the ai)
  //winning then remove ten to the score,
  if (result && result === GAME_SETTINGS.O_USER) {
    return { score: -10 }
  } else if (result && result === GAME_SETTINGS.X_USER) {
    //if the ai wins then add ten to it
    return { score: 10 }
  } else if (checkAllCellsTaken(temporaryBoard) === true) {
    //if it is a tie return 0
    return { score: 0 }
  }
  let moves = []
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      //if the cell has not been selected
      if (temporaryBoard[i][j] === undefined) {
        //store the current board position
        let move = {}
        move.i = i
        move.j = j

        //choose the component based on whether it is
        //the user moving or the ai
        temporaryBoard[i][j] =
          player === GAME_SETTINGS.X_USER ? (
            <XComponent key={GAME_SETTINGS.X_USER} />
          ) : (
            <OComponent key={GAME_SETTINGS.O_USER} />
          )
        //if it is the ai, let the user pick a random position
        //and check what happens down that path
        if (player === GAME_SETTINGS.X_USER) {
          let result = minimax(temporaryBoard, GAME_SETTINGS.O_USER)
          move.score = result.score
        //if it is the user's pick switch to the ai's turn
        } else if (player === GAME_SETTINGS.O_USER) {
          let result = minimax(temporaryBoard, GAME_SETTINGS.X_USER)
          move.score = result.score
        }
        //reset the board
        temporaryBoard[i][j] = undefined
        //memoize current moves
        moves.push(move)
      }
    }
  }
  //find the best scores
  let bestMove
  //if is the ai's moves maximize or find the best possible score
  //by backtracking every move from the end of the game until the start
  if (player === GAME_SETTINGS.X_USER) {
    let bestScore = -10000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
    //in the case of the user's move, we want to find the worst possible
    //outcome so find the worst possible score
  } else if (player === GAME_SETTINGS.O_USER) {
    let bestScore = 10000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
  }
  return moves[bestMove]
}
