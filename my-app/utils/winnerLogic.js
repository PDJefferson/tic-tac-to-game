export default function checkWinner(currentCellSelected) {
  //check if there is 3 in line per row per specific user
  for (let i = 0; i < 3; i++) {
    let rowSum = 0
    for (let j = 0; j < 3; j++) {
      if (checkSpecificUser('xUser', currentCellSelected, i, j)) {
        rowSum += 1
      } else if (checkSpecificUser('oUser', currentCellSelected, i, j)) {
        rowSum -= 1
      }
    }
    if (rowSum === 3) {
      return 'xUser'
    } else if (rowSum === -3) {
      return 'oUser'
    }
  }

  //check if there is 3 in per column per specific user
  for (let i = 0; i < 3; i++) {
    let colSum = 0
    for (let j = 0; j < 3; j++) {
      if (checkSpecificUser('xUser', currentCellSelected, j, i)) {
        colSum += 1
      } else if (checkSpecificUser('oUser', currentCellSelected, j, i)) {
        colSum -= 1
      }
    }
    if (colSum === 3) {
      return 'xUser'
    } else if (colSum === -3) {
      return 'oUser'
    }
  }

  //check if there is a winner on the diagonals
  if (
    checkSpecificUser('xUser', currentCellSelected, 0, 0) &&
    checkSpecificUser('xUser', currentCellSelected, 1, 1) &&
    checkSpecificUser('xUser', currentCellSelected, 2, 2)
  ) {
    return 'xUser'
  } else if (
    checkSpecificUser('oUser', currentCellSelected, 0, 0) &&
    checkSpecificUser('oUser', currentCellSelected, 1, 1) &&
    checkSpecificUser('oUser', currentCellSelected, 2, 2)
  ) {
    return 'oUser'
  }
  //check if there is a winner on the diagonals
  if (
    checkSpecificUser('xUser', currentCellSelected, 2, 0) &&
    checkSpecificUser('xUser', currentCellSelected, 1, 1) &&
    checkSpecificUser('xUser', currentCellSelected, 0, 2)
  ) {
    return 'xUser'
  } else if (
    checkSpecificUser('oUser', currentCellSelected, 2, 0) &&
    checkSpecificUser('oUser', currentCellSelected, 1, 1) &&
    checkSpecificUser('oUser', currentCellSelected, 0, 2)
  ) {
    return 'oUser'
  }
  return undefined
}

function checkSpecificUser(userType, currentCellSelected, row, col) {
  return currentCellSelected[row][col]?.key === userType
}
