import minimaxAlgo from './minimaxAlgo'
import randomPositionNotTaken from './randomStep'

export default function randomizeALgoSelection(board) {
  let randomChoice = Math.floor(Math.random() * (1 - 0 + 1)) + 0
  return randomChoice === 1 ? minimaxAlgo(board) : randomPositionNotTaken(board)
}
