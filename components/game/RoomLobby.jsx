import React from 'react'
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Grid,
} from '@mui/material'
import WaitingProgress from '../WaitingProgress'

export default function RoomLobby({ socket, startGame, resetGame }) {
  const [isBackDropShown, setIsBackDropShown] = React.useState(false)
  const [appendToRoom, setAppendToRoom] = React.useState(0)

  //listens to this socket event which will trigger whenever
  //a room has two users to start playing
  React.useEffect(() => {
    socket.on('startGame', (start) => {
      console.log(start, appendToRoom)
      startGame(appendToRoom)
    })
    return () => socket.off('startGame')
  })

  //if the room is full then create a new room
  React.useEffect(() => {
    socket.on('roomFull', async (prevRoom) => {
      console.log(prevRoom.substring(10))
      setAppendToRoom(Number(prevRoom.substring(10)) + 1)
      await socket.emit('joinRoom', `roomJoined${appendToRoom}`)
    })
    console.count(appendToRoom)
    return () => {
      socket.off('roomFull')
      socket.off('joinRoom')
    }
  })

  const waitForOtherUser = (e) => {
    //if the backdrop is showing , that means we have already call the emit
    //event to create a room so return
    if (isBackDropShown) return
    socket.emit('joinRoom', `roomJoined${appendToRoom}`)
    setIsBackDropShown(true)
    return <WaitingProgress />
  }
  return (
    <Card
      sx={{
        minWidth: 400,
        maxWidth: 400,
        minHeight: 300,
        backgroundColor: 'gray',
      }}
      variant="outlined"
    >
      <CardContent>
        <br></br>
        <br></br>
        <br></br>
        <Typography
          sx={{ fontSize: 18, cursor: 'pointer' }}
          color="text.secondary"
          align="center"
          variant="body2"
          marginTop={4}
          backgroundColor="white"
          paddingTop={2}
          paddingBottom={2}
          marginBottom={2}
          onClick={(e) => waitForOtherUser(e)}
          disabled={isBackDropShown}
        >
          {isBackDropShown
            ? 'waiting for another user to join...'
            : 'join room'}
        </Typography>
      </CardContent>
    </Card>
  )
}
