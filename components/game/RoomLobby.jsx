import React from 'react'
import {
  ButtonBase,
  Card,
  CardContent,
  Typography,
  CardActions,
  Paper,
  Button,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import WaitingProgress from '../WaitingProgress'
import { GAME_SETTINGS } from '../../constants/game'
import { styled } from '@mui/material/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow, { tableRowClasses } from '@mui/material/TableRow'
import { disableButtonTheme } from '../../styles/muiThemeStyles'
import CustomModal from '../CustomModal'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#fafafa',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  [`&.${tableRowClasses.selected}`]: {
    backgroundColor: '#e7eaf6',
  },
}))

export default function RoomLobby({ socket, startGame, resetGame }) {
  const [isBackDropShown, setIsBackDropShown] = React.useState(false)
  const [appendToRoom, setAppendToRoom] = React.useState(0)
  const [rooms, setRooms] = React.useState(new Array())
  const [populateRoom, setPopulateRoom] = React.useState(false)
  const [roomChosen, setRoomChosen] = React.useState(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  //listens to this socket event which will trigger whenever
  //a room has two users to start playing
  React.useEffect(() => {
    socket?.on('startGame', (roomCode) => {
      startGame(roomCode)
    })
    return () => socket.off('startGame')
  })

  //get the rooms
  React.useEffect(() => {
    if (rooms.length === 0 && !populateRoom) {
      socket.emit('getRooms')
      setPopulateRoom(true)
    }
    socket.on('listRooms', ({ roomsAvailable }) => {
      setRooms(roomsAvailable)
    })
    return () => {
      socket.off('listRooms')
    }
  }, [rooms, populateRoom])

  //if the room is full then create a new room
  React.useEffect(() => {
    socket?.on('roomFull', async (prevRoom) => {
      setAppendToRoom(
        Number(prevRoom.substring(GAME_SETTINGS.APPEND_ROOM.length)) + 1
      )
      await socket.emit(
        'joinRoom',
        `${GAME_SETTINGS.APPEND_ROOM}${appendToRoom}`
      )
    })
    return () => {
      socket.off('roomFull')
      socket.off('joinRoom')
    }
  })

  const joinQueue = (e) => {
    //if the backdrop is showing , that means we have already call the emit
    //event to create a room so return
    if (isBackDropShown) return
    socket.emit('joinRoom', `${GAME_SETTINGS.APPEND_ROOM}${appendToRoom}`)
    //update the room list
    socket.emit('getRooms')
    setIsBackDropShown(true)
  }

  const joinCustomRoom = (room, size = 0) => {
    setIsBackDropShown(true)
    //checks if the size is 0, that mean the current user has created the room
    if (size === 0) {
      setIsModalOpen(false)
      //join the custom room
      socket.emit('joinRoom', `${GAME_SETTINGS.APPEND_ROOM}${room}`)
      setRoomChosen({ room: room, size: 1 })

      //emit the message to update the rooms available
      socket.emit('getRooms')
      return
    }
    //the user join an already exists room
    socket.emit('joinRoom', room)
  }
  const leaveRoom = () => {
    setIsBackDropShown(false)
    //if a room was chosen then leave that room
    if (appendToRoom === 0 && roomChosen) {
      socket.emit('leaveRoom', {
        roomCode: `${GAME_SETTINGS.APPEND_ROOM}${roomChosen.room}`,
      })
      socket.emit('getRooms')
      setRoomChosen(null)
      return
    }
    //otherwise leave the room where the curr user got enqueue
    socket.emit('leaveRoom', {
      roomCode: `${GAME_SETTINGS.APPEND_ROOM}${appendToRoom}`,
    })
    socket.emit('getRooms')
    setAppendToRoom(0)
  }

  return (
    <>
      {isModalOpen && (
        <CustomModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          joinRoom={joinCustomRoom}
        />
      )}
      {isBackDropShown && (
        <WaitingProgress
          isBackDropShown={isBackDropShown}
          setIsBackdropShown={leaveRoom}
        />
      )}
      <Card
        sx={{
          minWidth: 360,
          maxWidth: 400,
          minHeight: 300,
          backgroundColor: '#252525',
        }}
        variant="outlined"
      >
        <CardContent>
          <Typography
            sx={{ fontSize: 18, cursor: 'pointer' }}
            color="text.secondary"
            align="center"
            variant="body1"
            marginTop={4}
            backgroundColor="white"
            paddingTop={2}
            paddingBottom={2}
            marginBottom={2}
            onClick={(e) => joinQueue(e)}
            disabled={isBackDropShown}
          >
            {isBackDropShown
              ? 'WAITING FOR ANOTHER USER TO JOIN...'
              : 'JOIN/CREATE RANDOM ROOM'}
          </Typography>
          {rooms.length > 0 && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 360 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>ROOMS</StyledTableCell>
                    <StyledTableCell align="right">
                      CURRENT PLAYERS
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map((room) => (
                    <StyledTableRow
                      key={room.room}
                      hover
                      selected={roomChosen?.room === room.room}
                      disabled={room.size === 2}
                      onClick={(e) =>
                        room.size === 2
                          ? null
                          : setRoomChosen(roomChosen === room ? null : room)
                      }
                      sx={{
                        cursor: room.size === 2 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {room.room}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {`${room.size}/2`}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
        <CardActions
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            alignSelf: 'end',
          }}
        >
          <Button
            size="small"
            variant="contained"
            disabled={!roomChosen}
            theme={disableButtonTheme}
            onClick={(e) => joinCustomRoom(roomChosen.room, roomChosen.size)}
          >
            JOIN ROOM
          </Button>
          <Button
            size="small"
            variant="contained"
            theme={disableButtonTheme}
            onClick={(e) => setIsModalOpen(true)}
          >
            CREATE CUSTOM ROOM
          </Button>
        </CardActions>
      </Card>
    </>
  )
}
