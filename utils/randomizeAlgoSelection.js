import minimaxAlgo from './minimaxAlgo'
import randomPositionNotTaken from './randomStep'
const select = [0, 1]
export default function randomizeALgoSelection(board) {
  let randomChoice = Math.floor(Math.random() * select.length)
  return select[randomChoice] === 1 ? minimaxAlgo(board) : randomPositionNotTaken(board)
}
