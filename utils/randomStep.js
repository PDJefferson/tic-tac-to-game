export default function randomPositionNotTaken(board) {
  let i, j
  do {
    i = Math.floor(Math.random() * (2 - 0 + 1)) + 0
    j = Math.floor(Math.random() * (2 - 0 + 1)) + 0
  } while (board[i][j])
  return { i, j }
}
