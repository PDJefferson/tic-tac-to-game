
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
      return 'xUser Has Won'
    } else if (rowSum === -3) {
      return 'oUser has won'
    }
  }

  //check if there is 3 in per column per specific user
  for (let i = 0; i < 3; i++) {
    let rowSum = 0
    for (let j = 0; j < 3; j++) {
      if (checkSpecificUser('xUser', currentCellSelected, j, i)) {
        rowSum += 1
      } else if (checkSpecificUser('oUser', currentCellSelected, j, i)) {
        rowSum -= 1
      }
    }
    if (rowSum === 3) {
      return 'xUser Has Won'
    } else if (rowSum === -3) {
      return 'oUser has won'
    }
  }

  //check if there is a winner on the diagonals
  if (
    checkSpecificUser('xUser', currentCellSelected, 0, 0) &&
    checkSpecificUser('xUser', currentCellSelected, 1, 1) &&
    checkSpecificUser('xUser', currentCellSelected, 2, 2)
  ) {
    return 'xUser Has Won'
  } else if (
    checkSpecificUser('oUser', currentCellSelected, 0, 0) &&
    checkSpecificUser('oUser', currentCellSelected, 1, 1) &&
    checkSpecificUser('oUser', currentCellSelected, 2, 2)
  ) {
    return 'oUser Has Won'
  }
  //check if there is a winner on the diagonals
  if (
    checkSpecificUser('xUser', currentCellSelected, 2, 0) &&
    checkSpecificUser('xUser', currentCellSelected, 1, 1) &&
    checkSpecificUser('xUser', currentCellSelected, 0, 2)
  ) {
    return 'xUser Has Won'
  } else if (
    checkSpecificUser('oUser', currentCellSelected, 2, 0) &&
    checkSpecificUser('oUser', currentCellSelected, 1, 1) &&
    checkSpecificUser('oUser', currentCellSelected, 0, 2)
  ) {
    return 'oUser Has Won'
  }
}

function checkSpecificUser(userType, currentCellSelected, row, col) {
  if (currentCellSelected[row][col]?.key === userType) {
    return true
  }
  return false
}
