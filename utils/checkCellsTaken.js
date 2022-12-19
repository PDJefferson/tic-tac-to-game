export default function checkAllCellsTaken(elementsToAdd) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      //if there is empty cell, that means there is still a spot to choose in the screen
      if (elementsToAdd[i][j] === undefined) {
        return false
      }
    }
  }
  //we have gone through every single position in the board, so return true
  return true
}
