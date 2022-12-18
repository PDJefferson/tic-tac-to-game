import React from 'react'
import { CardContent, Typography, Grid, Box } from '@mui/material'
import LeaderBoardList from './LeaderBoardList'

export default function LeaderBoard() {
  return (
    <Grid
      container
      item
      xs={10}
      sm={10}
      md={4}
      direction="row"
      minHeight={'580px'}
      minWidth={'320px'}
      sx={{
        border: 5,
        borderRadius: 1,
        borderColor: 'white',
      }}
      justifyContent={'center'}
    >
      <Grid
        container
        item
        xs={10}
        md={10}
        spacing={0}
        marginTop={2}
        direction="row"
        justifyContent={'center'}
      >
        <Typography
          variant="h5"
          color="white"
          textAlign={'center'}
        >
          LEADERBOARD
        </Typography>
      </Grid>
      <LeaderBoardList />
    </Grid>
  )
}
