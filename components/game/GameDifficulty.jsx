import { Grid, CardContent, Typography, Card } from '@mui/material'
import React from 'react'
import { GAME_SETTINGS } from '../../constants/game'

export default function GameDifficulty({ setDifficulty }) {
  return (
    <Grid
      container
      item
      align="center"
      xs={4}
      md={4}
      sm={3}
      justifyContent="center"
    >
      <Card
        sx={{
          minWidth: 300,
          maxWidth: 400,
          minHeight: 200,
          backgroundColor: 'gray',
        }}
        variant="outlined"
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 18, cursor: 'pointer' }}
            color="text.secondary"
            align="center"
            variant="body2"
            marginTop={2}
            backgroundColor="white"
            paddingTop={2}
            paddingBottom={2}
            marginBottom={2}
            onClick={(e) => setDifficulty(GAME_SETTINGS.EASY)}
          >
            EASY
          </Typography>
          <Typography
            sx={{ fontSize: 18, cursor: 'pointer' }}
            color="text.secondary"
            align="center"
            variant="body2"
            backgroundColor="white"
            paddingBottom={2}
            marginBottom={2}
            onClick={(e) => setDifficulty(GAME_SETTINGS.MEDIUM)}
          >
            <br></br>
            MEDIUM
          </Typography>
          <Typography
            sx={{ fontSize: 18, cursor: 'pointer' }}
            align="center"
            color="text.secondary"
            variant="body2"
            justifyItems={'center'}
            backgroundColor="white"
            paddingBottom={2}
            marginBottom={2}
            onClick={(e) => setDifficulty(GAME_SETTINGS.HARD)}
          >
            <br></br>
            HARD
            <br></br>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  )
}
