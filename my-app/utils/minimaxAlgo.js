import XComponent from '../components/game/XComponent'
import OComponent from '../components/game/OComponent'
import checkWinner from './winnerLogic'
import checkAllCellsTaken from './checkCellsTaken'
export default function minimaxAlgo(currentCellTaken, turn) {
  //getting a copy of the board to write on it
  const temporaryBoard = [...currentCellTaken]
  let score = minimax(temporaryBoard, 'xUser')
  return { i: score.i, j: score.j }
}
//recursively goes through every single position of the board, to find the most optimal position that will lead to win or worst case scenario, tie.
function minimax(temporaryBoard, player) {
  let result = checkWinner(temporaryBoard)
  //if the result leads to oUser( the current user playing against the ai)
  //winning then remove ten to the score,
  if (result && result === 'oUser') {
    return { score: -10 }
  } else if (result && result === 'xUser') {
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
          player === 'xUser' ? (
            <XComponent key="xUser" />
          ) : (
            <OComponent key="oUser" />
          )
        //if it is the ai, let the user pick a random position
        //and check what happens down that path
        if (player === 'xUser') {
          let result = minimax(temporaryBoard, 'oUser')
          move.score = result.score
        //if it is the user's pick switch to the ai's turn
        } else if (player === 'oUser') {
          let result = minimax(temporaryBoard, 'xUser')
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
  if (player === 'xUser') {
    let bestScore = -10000
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score
        bestMove = i
      }
    }
    //in the case of the user's move, we want to find the worst possible
    //outcome so find the worst possible score
  } else if (player === 'oUser') {
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
