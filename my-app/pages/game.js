import Canvas from '../components/game/Canvas'
import React from 'react'
import { GAME_SETTINGS } from '../constants/game'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material'
import GameDifficulty from '../components/game/GameDifficulty'
import GameStartUp from '../components/game/GameStartUp'
import DisplayWinner from '../components/game/DisplayWinner'

export default function Home() {
  const [modality, setModality] = React.useState(null)
  const [difficulty, setDifficulty] = React.useState(null)
  const [winnerMessage, setWinnerMessage] = React.useState(null)
  const [turn, setTurn] = React.useState(false)

  let hasGameBeenSetUp =
    (modality && difficulty) ||
    (modality && modality === GAME_SETTINGS.PLAYER_VS_PLAYER)
  const afterGame = (message) => {
    setWinnerMessage(message)
  }
  const resetGame = () => {
    setModality(null)
    setDifficulty(null)
    setWinnerMessage(null)
    hasGameBeenSetUp = false
  }

  const goBackToGame = () => {
    setTurn(!turn)
    setWinnerMessage(null)
  }
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '89vh' }}
      sx={{ background: 'black', margin: 0, padding: 0 }}
    >
      {hasGameBeenSetUp && (
        <Button
          background="white"
          onClick={(e) => resetGame()}
          variant="contained"
          sx={{ margin: 5 }}
        >
          return
        </Button>
      )}
      <Grid
        container
        item
        alignItems="center"
        sx={{ border: 5, borderRadius: 1, borderColor: 'white', padding: 5 }}
        direction="row"
        width="60%"
        height={'520px'}
        align="center"
        alignSelf={'center'}
        justifyContent="center"
        textAlign="center"
      >
        {winnerMessage && (
          <DisplayWinner message={winnerMessage} goBackToGame={goBackToGame} />
        )}
        {!modality && (
          <GameStartUp modality={modality} setModality={setModality} />
        )}
        {modality === GAME_SETTINGS.PLAYER_VS_COMPUTER && !difficulty && (
          <GameDifficulty setDifficulty={setDifficulty} />
        )}
        {hasGameBeenSetUp && !winnerMessage && (
          <Canvas
            difficulty={difficulty}
            modality={modality}
            winnerFound={afterGame}
            turn={turn}
          />
        )}
      </Grid>
    </Grid>
  )
}
