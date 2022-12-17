import { Server } from 'socket.io'
import { GAME_SETTINGS } from '../../constants/game'
const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('socket has already been initialized')
    res.end()
    return
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io
    //listen to any users on connection
    io.on('connection', (socket) => {
      console.log('User Connected')
      //check if a user has join a room
      socket.on('joinRoom', async ({ roomCode, user }) => {
        //get the users in this specific room
        const connectedSockets = io.sockets.adapter.rooms.get(roomCode)
        //get all rooms
        const socketRooms = Array.from(socket.rooms.values()).filter(
          (r) => r !== socket.id
        )
        //if the current room is full send a message to create a new one
        if (
          socketRooms.length > 0 ||
          (connectedSockets && connectedSockets?.size === 2)
        ) {
          console.log('room is full create a new room')
          socket.emit('roomFull', roomCode)
          //join the user to the room since is missing one  player
        } else {
          //if the same user is trying to join the room
          //then make the user leave the room and then re enter it
          if (
            connectedSockets &&
            [...connectedSockets].filter(
              (connectedSocket) => connectedSocket === socket.id
            )
          ) {
            console.log('user tried to join the same room twice')
            await socket.leave(roomCode)
          }
          console.log('joining user to room:', roomCode)
          await socket.join(roomCode)

          //if the room has two users, then start the game
          if (io.sockets.adapter.rooms.get(roomCode)?.size === 2) {
            let roomsAvailable = getRoomsAvailable(io.sockets)
            console.log('room where the game is being hosted is', roomCode)
            //send this message to everyone except the current user
            socket.broadcast.emit('listRooms', { roomsAvailable })
            socket.emit('startGame', { roomCode, user })
            socket.to(roomCode).emit('startGame', { roomCode, user })
          }
        }
      })

      socket.on('getRooms', () => {
        //get rooms available
        let roomsAvailable = getRoomsAvailable(io.sockets)
        //emit message to all connected sockets with the rooms available
        socket.emit('listRooms', { roomsAvailable })
      })
      //listens to leave room which  gets trigger when a user leaves an specific room
      socket.on('leaveRoom', ({ roomCode }) => {
        console.log('user has left room', roomCode)
        socket.leave(roomCode)
        console.log(socket.adapter.rooms)
        //send a message to the other user that is still in the match and
        //update it about the other user leaving
        socket.broadcast.to(roomCode).emit('onOtherUserLeaving', true)
      })

      //play a move in the board
      socket.on('play', ({ row, col, roomCode }) => {
        console.log(`play at ${row} ${col} to ${roomCode}`)
        //update the other user screen
        socket.broadcast.to(roomCode).emit('updateGame', { row, col })
        console.log(socket.adapter.rooms)
      })

      //ends the connection
      socket.on('disconnect', () => {
        console.log('User Disconnected')
      })

      //every 9 seconds check if a user has left a room to update the other user on that room
      setInterval(() => {
        io.sockets.adapter.rooms.forEach((key, value) => {
          if (
            key.size < 2 &&
            value
              .toString()
              .toLowerCase()
              .startsWith(GAME_SETTINGS.APPEND_ROOM.toLowerCase())
          ) {
            socket.broadcast.to(value).emit('onOtherUserLeaving', true)
          }
        })
      }, 9000)
    })
    res.end()
  }
}

function getRoomsAvailable(sockets) {
  let roomsAvailable = Array.from(sockets.adapter.rooms.keys()).filter((room) =>
    room
      .toString()
      .toLowerCase()
      .startsWith(GAME_SETTINGS.APPEND_ROOM.toLowerCase())
  )
  roomsAvailable = roomsAvailable.map((room) => ({
    room,
    //get amount of users in that room
    size: sockets.adapter.rooms.get(room).size,
  }))
  return roomsAvailable
}

export default SocketHandler
