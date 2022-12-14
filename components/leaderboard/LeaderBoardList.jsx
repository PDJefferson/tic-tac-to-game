import React from 'react'
import { CardContent, Typography, Grid, Box } from '@mui/material'
import { borderRadius, minWidth } from '@mui/system'
//temp var
const showLeaderBoard = [
  {
    id: 'random1',
    color: 'yellow',
    position: 1,
    name: 'Iman',
    img: 'https://cdn2.thecatapi.com/images/MjAyMTUwNA.jpg',
    wins: 2019,
  },
  {
    id: 'random2',
    color: 'yellow',
    position: 2,
    name: 'Jaysee',
    img: 'https://cdn2.thecatapi.com/images/1.jpg',
    wins: 30,
  },
  {
    id: 'random3',
    color: 'orange',
    position: 3,
    name: 'Jonathan',
    img: 'https://cdn2.thecatapi.com/images/2.jpg',
    wins: 10,
  },
]
export default function LeaderBoardList({ passedList = [] }) {
  return (
    <>
      {showLeaderBoard.map((position) => (
        <Grid
          key={position.id}
          container
          item
          spacing={0}
          xs={10}
          md={10}
          direction="row"
          justifyContent={'center'}
        >
          <Box
            elevation={3}
            marginBottom={2}
            sx={{
              minWidth: '278px',
              width: '380px',
              height: '80px',
              borderRadius: 5,
              background: `${position.color}`,
            }}
          >
            <Grid
              container
              item
              margin={2}
              direction="row"
              justifyContent={'space-between'}
            >
              <Grid container xs={1} item direction="column" alignSelf="center">
                <Typography
                  variant="body1"
                  color="black"
                  sx={{ fontWeight: 'bold' }}
                  textAlign={'center'}
                >
                  {position.position}
                </Typography>
              </Grid>
              <Grid
                container
                xs={1}
                item
                direction="column"
                alignSelf={'center'}
              >
                <img
                  src={position.img}
                  width="45px"
                  height="50px"
                  alt="cat"
                  loading="lazy"
                  style={{ borderRadius: '50%' }}
                />
              </Grid>

              <Grid
                container
                xs={4}
                item
                direction="column"
                alignSelf={'center'}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold' }}
                  color="black"
                  textAlign={'center'}
                >
                  {position.name}
                </Typography>
              </Grid>
              <Grid
                container
                xs={4}
                item
                direction="column"
                alignSelf={'center'}
              >
                <Typography variant="body1" color="black" textAlign="start">
                  {`${position.wins} wins`}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      ))}
      <Grid
        container
        item
        spacing={0}
        xs={10}
        md={10}
        direction="row"
        justifyContent={'center'}
      >
        <Box
          elevation={3}
          marginBottom={2}
          justifyContent="center"
          textAlign="center"
          sx={{
            minWidth: '278px',
            width: '380px',
            height: '80px',
            borderRadius: 5,
            background: `#58ABBD`,
          }}
        >
          <Typography
            variant="h5"
            alignSelf={'center'}
            color="#312244"
            marginTop={3.5}
            sx={{ fontWeight: 'bold', fontSize: '16.2624px' }}
          >
            Load More
          </Typography>
        </Box>
      </Grid>
    </>
  )
}
