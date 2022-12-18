import React, { memo } from 'react'
import { Box, CardContent, Typography, Card, Grid, Avatar } from '@mui/material'
import useTimeComponent from '../../hooks/use-timeComponent'
function DisplayUserInfo({
  startGame,
  currPlayer,
  adversary,
  duration,
  roomCode,
}) {
  const [showComponent, timeRemaining] = useTimeComponent({
    duration,
    roomCode,
    onFinish: startGame,
  })

  return (
    showComponent && (
      <Box
        sx={{
          minHeight: 340,
          minWidth: 360,
          maxWidth: 500,
          background: '#252525',
          display: 'flex',
        }}
        variant="outlined"
      >
        <Grid
          container
          item
          direction="row"
          justifyContent="center"
          spacing={8}
        >
          <Grid item sx={4} direction="col" marginTop={5}>
            <Typography
              sx={{ fontSize: 18 }}
              color="white"
              align="center"
              variant="body1"
            >
              YOU ARE PLAYING AGAINST:
            </Typography>
          </Grid>
          <Grid container item sx={4}>
            <Grid container direction="row" justifyContent="center" spacing={3}>
              <Grid item sx={2} alignSelf="center">
                <Avatar
                  src={currPlayer.image}
                  width="45px"
                  height="50px"
                  alt="user profile"
                  loading="lazy"
                />
              </Grid>
              <Grid item sx={2} alignSelf="center">
                <Typography
                  variant="body1"
                  color="white"
                  sx={{ fontWeight: 'bold' }}
                  textAlign={'center'}
                >
                  {currPlayer.name}
                </Typography>
              </Grid>

              <Grid item sx={2} alignSelf="center">
                <Typography
                  variant="body1"
                  color="white"
                  sx={{ fontWeight: 'bold' }}
                  textAlign={'center'}
                >
                  VS.
                </Typography>
              </Grid>
              <Grid item sx={2} alignSelf="center">
                <Avatar
                  src={adversary.image}
                  width="45px"
                  height="50px"
                  alt="user profile"
                  loading="lazy"
                />
              </Grid>
              <Grid item sx={2} alignSelf="center">
                <Typography
                  variant="body1"
                  color="white"
                  sx={{ fontWeight: 'bold' }}
                  textAlign={'center'}
                >
                  {adversary.name}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={4}>
            <Typography
              sx={{ fontSize: 18 }}
              color="white"
              align="center"
              variant="body1"
            >
              {`GAME STARTS IN ${timeRemaining}`}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  )
}

export default memo(DisplayUserInfo)
