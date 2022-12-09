import { Typography, Button, Grid } from '@mui/material'
import React from 'react'
import { GAME_SETTINGS } from '../../constants/game'

export default function DisplayWinner({ message, goBackToGame }) {
  let results =
    message === GAME_SETTINGS.O_USER
      ? `${message} wins`
      : message === GAME_SETTINGS.X_USER
      ? `${message} wins`
      : message
  return (
    <Grid>
      <Typography
        sx={{ fontSize: 18 }}
        color="white"
        align="center"
        variant="body2"
        marginTop={2}
        paddingTop={2}
        paddingBottom={2}
        marginBottom={2}
      >
        {results}
      </Typography>
      <Button variant="contained" onClick={() => goBackToGame()} sx={{ mb: 3 }}>
        AGAIN
      </Button>
    </Grid>
  )
}
