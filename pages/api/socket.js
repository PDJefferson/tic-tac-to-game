import { Server } from 'socket.io'
import { GAME_SETTINGS } from '../../constants/game'
const usersJoined = new Map()

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
      //check if a user has join a room
      socket.on('joinRoom', async ({ roomCode, user }) => {
        console.log(usersJoined.get(roomCode), 'check')
        //get the users in this specific room
        const connectedSockets = io.sockets.adapter.rooms.get(roomCode)
        //get all rooms
        const socketRooms = Array.from(socket.rooms.values()).filter(
          (r) => r !== socket.id
        )
        let roomsAvailable = getRoomsAvailable(io.sockets)
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
          //then make the user leave the room
          if (usersJoined.get(roomCode) > 0 &&
            usersJoined.get(roomCode)[0].user._id === user._id) {
            console.log('email match so show the message')
            socket.to(roomCode).emit('isSameUser', {
              message: 'Cannot play against yourself',
            })
            await socket.leave(roomCode)
            await usersJoined.get(roomCode)[0].socket.leave(roomCode)
            socket.emit('isSameUser', {
              message: 'Cannot play against yourself',
            })
            //update the rooms open
            roomsAvailable = getRoomsAvailable(io.sockets)
            //update the rooms open
            socket.emit('listRooms', { roomsAvailable })
            //remove the users data
            usersJoined.delete(roomCode)
          } else {
            console.log('joining user to room:', roomCode)
            await socket.join(roomCode)
            //check if there are no users that joined this specific room
            //to memoize the current user
            if (
              roomCode in usersJoined === false &&
              usersJoined.get(roomCode) === undefined
            ) {
              console.log(
                Array.from(usersJoined.keys()),
                'setting a new room' + roomCode + (roomCode in usersJoined),
                user.name
              )
              let userList = new Array()
              userList.push({ user: user, socket: socket })
              usersJoined.set(roomCode, userList)
            }
            console.error(usersJoined.get(roomCode))
            //if the room has two users, then start the game
            if (io.sockets.adapter.rooms.get(roomCode)?.size === 2) {
              console.log('room where the game is being hosted is', roomCode)
              //send this message to everyone
              socket.emit('listRooms', { roomsAvailable })
              const hostedUser = usersJoined.get(roomCode)[0]
              // Store the data for both users in the map
              usersJoined.set(roomCode, [
                {
                  user: hostedUser.user,
                  socket: hostedUser.socket,
                },
                { user: user, socket: socket },
              ])
              //send the info of the last user who joined the room to the user who hosted
              socket.broadcast
                .to(roomCode)
                .emit('startGame', { roomCode, user, run: true })
            }
          }
        }
      })

      //starts the game to the last user who joined
      socket.on('startGameLastUser', ({ roomCode, user }) => {
        socket.broadcast
          .to(roomCode)
          .emit('startGame', { roomCode, user, run: false })
      })

      socket.on('getRooms', () => {
        //get rooms available
        let roomsAvailable = getRoomsAvailable(io.sockets)
        //emit message to all connected sockets with the rooms available
        socket.emit('listRooms', { roomsAvailable })
      })

      //listens to leave room which gets trigger when a user leaves a specific room
      socket.on('leaveRoom', ({ roomCode }) => {
        console.log('user has left room', roomCode)
        console.log(socket.adapter.rooms)
        //send a message to the other user that is still in the match and
        //update it about the other user leaving
        socket.broadcast.to(roomCode).emit('onOtherUserLeaving', true)
        socket.leave(roomCode)
        if (usersJoined.size > 0 && usersJoined.get(roomCode)) {
          //make both users leave the room
          usersJoined.get(roomCode)[0]?.socket?.leave(roomCode)
          usersJoined.get(roomCode)[1]?.socket?.leave(roomCode)
          usersJoined.delete(roomCode)
        }
      })

      //play a move in the board
      socket.on('play', ({ row, col, roomCode, opponent }) => {
        console.log(`play at ${row} ${col} to ${roomCode} vs ${opponent}`)
        //update the other user screen
        socket.broadcast.to(roomCode).emit('updateGame', { row, col, opponent })
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
            if (usersJoined.size > 0 && usersJoined.get(value)) {
              //if one user leaves the room make both leave by default
              //and remove the memoize data
              usersJoined.delete(value)
            }
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
