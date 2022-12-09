export default function checkAllCellsTaken(elementsToAdd) {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (elementsToAdd[i][j] === undefined) {
        return false
      }
    }
  }
  return true
}
