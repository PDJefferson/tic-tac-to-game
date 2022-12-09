import { GAME_SETTINGS } from "../constants/game"
export default function checkWinner(currentCellSelected) {
  //check if there is 3 in line per row per specific user
  for (let i = 0; i < 3; i++) {
    let rowSum = 0
    for (let j = 0; j < 3; j++) {
      if (checkSpecificUser(GAME_SETTINGS.X_USER, currentCellSelected, i, j)) {
        rowSum += 1
      } else if (checkSpecificUser(GAME_SETTINGS.O_USER, currentCellSelected, i, j)) {
        rowSum -= 1
      }
    }
    if (rowSum === 3) {
      return GAME_SETTINGS.X_USER
    } else if (rowSum === -3) {
      return GAME_SETTINGS.O_USER
    }
  }

  //check if there is 3 in per column per specific user
  for (let i = 0; i < 3; i++) {
    let colSum = 0
    for (let j = 0; j < 3; j++) {
      if (checkSpecificUser(GAME_SETTINGS.X_USER, currentCellSelected, j, i)) {
        colSum += 1
      } else if (checkSpecificUser(GAME_SETTINGS.O_USER, currentCellSelected, j, i)) {
        colSum -= 1
      }
    }
    if (colSum === 3) {
      return GAME_SETTINGS.X_USER
    } else if (colSum === -3) {
      return GAME_SETTINGS.O_USER
    }
  }

  //check if there is a winner on the diagonals
  if (
    checkSpecificUser(GAME_SETTINGS.X_USER, currentCellSelected, 0, 0) &&
    checkSpecificUser(GAME_SETTINGS.X_USER, currentCellSelected, 1, 1) &&
    checkSpecificUser(GAME_SETTINGS.X_USER, currentCellSelected, 2, 2)
  ) {
    return GAME_SETTINGS.X_USER
  } else if (
    checkSpecificUser(GAME_SETTINGS.O_USER, currentCellSelected, 0, 0) &&
    checkSpecificUser(GAME_SETTINGS.O_USER, currentCellSelected, 1, 1) &&
    checkSpecificUser(GAME_SETTINGS.O_USER, currentCellSelected, 2, 2)
  ) {
    return GAME_SETTINGS.O_USER
  }
  //check if there is a winner on the diagonals
  if (
    checkSpecificUser(GAME_SETTINGS.X_USER, currentCellSelected, 2, 0) &&
    checkSpecificUser(GAME_SETTINGS.X_USER, currentCellSelected, 1, 1) &&
    checkSpecificUser(GAME_SETTINGS.X_USER, currentCellSelected, 0, 2)
  ) {
    return GAME_SETTINGS.X_USER
  } else if (
    checkSpecificUser(GAME_SETTINGS.O_USER, currentCellSelected, 2, 0) &&
    checkSpecificUser(GAME_SETTINGS.O_USER, currentCellSelected, 1, 1) &&
    checkSpecificUser(GAME_SETTINGS.O_USER, currentCellSelected, 0, 2)
  ) {
    return GAME_SETTINGS.O_USER
  }
  return undefined
}

function checkSpecificUser(userType, currentCellSelected, row, col) {
  return currentCellSelected[row][col]?.key === userType
}
