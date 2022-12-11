import minimaxAlgo from "./minimaxAlgo"
import randomPositionNotTaken from "./randomStep"

export default function randomizeALgoSelection(board) {
    let randomChoice = Math.floor(Math.random() * (1 - 0 + 1)) + 0
    if(randomChoice === 1) {
        return minimaxAlgo(board)
    }
    return randomPositionNotTaken(board)
}