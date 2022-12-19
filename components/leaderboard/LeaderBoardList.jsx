import React from 'react'
import { CardContent, Typography, Grid, Box, Avatar } from '@mui/material'
import { getAllUsers } from '../../routes/api/users'
import useHttp from '../../hooks/use-http'

export default function LeaderBoardList() {
  const {
    sendRequest,
    status,
    data: userList,
    error,
  } = useHttp(getAllUsers, false)
  React.useEffect(() => {
    sendRequest()
  }, [sendRequest])

  if (status === 'pending') {
    return <div>waiting</div>
  }

  if (error) {
    return <div style={{ color: 'white' }}> {error}</div>
  }
  if (userList) {
    return (
      <>
        {userList.map((user, index) => (
          <Grid
            key={user._id}
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
                background: `${user.color}`,
              }}
            >
              <Grid
                container
                item
                margin={2}
                direction="row"
                justifyContent={'space-between'}
              >
                <Grid
                  container
                  xs={1}
                  item
                  direction="column"
                  alignSelf="center"
                >
                  <Typography
                    variant="body1"
                    color="black"
                    sx={{ fontWeight: 'bold' }}
                    textAlign={'center'}
                  >
                    {index + 1}
                  </Typography>
                </Grid>
                <Grid
                  container
                  xs={1}
                  item
                  direction="column"
                  alignSelf={'center'}
                >
                  <Avatar
                    src={user.image}
                    width="45px"
                    height="50px"
                    alt="user profile"
                    loading="lazy"
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
                    {user.name}
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
                    {`${user.wins} wins`}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        ))}
      </>
    )
  }
}
