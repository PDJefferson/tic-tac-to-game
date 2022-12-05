import { Typography, Button, Grid } from '@mui/material'
import React from 'react'

export default function DisplayWinner({ message, goBackToGame }) {
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
        {message}
      </Typography>
      <Button
        variant="contained"
        onClick={() => goBackToGame()}
      >
        AGAIN
      </Button>
    </Grid>
  )
}
