import { GAME_SETTINGS } from '../constants/game'
export default function sanitizeAfterGameMessage(modality, winnerMessage) {
  switch (modality) {
    case GAME_SETTINGS.PLAYER_VS_PLAYER:
      return playerVsPlayerMessage(winnerMessage)
      break
    case GAME_SETTINGS.PLAYER_VS_COMPUTER:
      return playerVsComputerMessage(winnerMessage)
    case GAME_SETTINGS.ONLINE:
      return onlineMessage(winnerMessage)
    default:
      throw new Error('No such a modality')
      break
  }
}

function playerVsPlayerMessage(message) {
  if (GAME_SETTINGS.O_USER === message) {
    return { message: `${message} wins`, alertType: 'info' }
  } else if (GAME_SETTINGS.X_USER === message) {
    return { message: `${message} wins`, alertType: 'info' }
  } else {
    return { message: message, alertType: 'info' }
  }
}

function onlineMessage(message) {
  if (GAME_SETTINGS.O_USER === message) {
    return { message: `You lost the game`, alertType: 'error' }
  } else if (GAME_SETTINGS.X_USER === message) {
    return { message: `You won the game`, alertType: 'success' }
  } else {
    return { message: message, alertType: 'info' }
  }
}

function playerVsComputerMessage(message) {
  if (GAME_SETTINGS.O_USER === message) {
    return { message: `You won the game`, alertType: 'success' }
  } else if (GAME_SETTINGS.X_USER === message) {
    return { message: `You lost the game`, alertType: 'error' }
  } else {
    return { message: message, alertType: 'info' }
  }
}
