import Canvas from '../components/game/Canvas'
import React from 'react'
import { GAME_SETTINGS } from '../constants/game'
import { Grid, Button } from '@mui/material'
let socket
import GameDifficulty from '../components/game/GameDifficulty'
import GameStartUp from '../components/game/GameStartUp'
import DisplayWinner from '../components/game/DisplayWinner'
import RoomLobby from '../components/game/RoomLobby'
import io from 'socket.io-client'
import AlertSnackBar from '../components/AlertSnackBar'
import sanitizeAfterGameMessage from '../utils/cleanWinnerMessage'
export default function Home() {
  const [modality, setModality] = React.useState(null)
  const [difficulty, setDifficulty] = React.useState(null)
  const [turn, setTurn] = React.useState(false)
  const [canOnlineGameStart, setCanOnlineGameStart] = React.useState(false)
  const [roomName, setRoomName] = React.useState(null)
  const [memoizePositions, setMemoizePositions] = React.useState(new Array())
  const [currentIndex, setCurrentIndex] = React.useState(-1)
  const [index, setIndex] = React.useState(0)
  const [winnerFound, setWinnerFound] = React.useState(false)
  const [winnerMessage, setWinnerMessage] = React.useState(null)
  const [boardElements, setBoardElements] = React.useState([
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ])

  //initializes the socket connection
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()
    socket.on('connect', () => {
      console.log('connected')
    })
  }
  //starts the socket connection
  React.useEffect(() => {
    async function initializeSocket() {
      socketInitializer()
    }
    initializeSocket()
  }, [])

  let hasGameBeenSetUp =
    (modality && difficulty) ||
    (modality && modality === GAME_SETTINGS.PLAYER_VS_PLAYER) ||
    canOnlineGameStart

  let sanitizeWinnerMessage = (winnerMessage) ? sanitizeAfterGameMessage(modality, winnerMessage): null;
  // const afterGame = (message) => {
  //   setWinnerMessage(message)
  // }

  const resetGame = () => {
    socket.emit('leaveRoom', { roomCode: roomName })
    setModality(null)
    setDifficulty(null)
    setWinnerMessage(null)
    setMemoizePositions(new Array())
    setCurrentIndex(-1)
    setIndex(0)
    setCanOnlineGameStart(null)
    hasGameBeenSetUp = false
    setWinnerFound(false)
    setBoardElements([
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ])
  }

  const goBackToGame = () => {
    //if the game modality is online then
    //on play again take it to the room lobby to find
    //someone to play with, temp solution
    if (modality === GAME_SETTINGS.ONLINE) {
      setCanOnlineGameStart(false)
      socket.emit('leaveRoom', { roomCode: roomName })
    }
    setWinnerMessage(null)
    setMemoizePositions(new Array())
    setTurn(!turn)
    // setWinnerMessage(null)
    setWinnerFound(false)
    setBoardElements([
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ])
  }

  const startOnlineGame = (roomCode) => {
    setRoomName(`roomJoined${roomCode}`)
    setCanOnlineGameStart(true)
  }

  const prevMove = (e) => {
    setBoardElements((board) => {
      board[memoizePositions[currentIndex]?.i][
        memoizePositions[currentIndex]?.j
      ] = undefined
      return board
    })
    setCurrentIndex((currentIndex) => (currentIndex = currentIndex - 1))
  }
  const nextMove = (e) => {
    if (currentIndex === index) return
    setBoardElements((board) => {
      board[memoizePositions[currentIndex + 1]?.i][
        memoizePositions[currentIndex + 1]?.j
      ] = memoizePositions[currentIndex + 1]?.object
      return board
    })
    setCurrentIndex((currentIndex) => (currentIndex = currentIndex + 1))
  }
  return (
    <>
      {winnerFound && winnerMessage && (
        <AlertSnackBar passedMessage={sanitizeWinnerMessage.message} typeMessage={sanitizeWinnerMessage.alertType} />
      )}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={0}
        style={{ minHeight: '89vh' }}
        sx={{ background: 'black', margin: 0, padding: 0 }}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          {hasGameBeenSetUp && (
            <Button
              background="white"
              onClick={(e) => resetGame()}
              variant="contained"
              sx={{ margin: 5 }}
            >
              return
            </Button>
          )}
          {winnerFound && (
            <Button
              background="white"
              onClick={(e) => goBackToGame()}
              variant="contained"
              sx={{ margin: 5 }}
            >
              again
            </Button>
          )}
        </Grid>
        <Grid
          container
          item
          alignItems="center"
          sx={{
            border: 5,
            borderRadius: 1,
            borderColor: 'white',
            padding: 5,
            backgroundColor: winnerFound && 'grey',
          }}
          direction="row"
          width="60%"
          minWidth={'400px'}
          align="center"
          alignSelf={'center'}
          justifyContent="center"
          textAlign="center"
        >
          {modality === GAME_SETTINGS.ONLINE && !canOnlineGameStart && (
            <RoomLobby
              socket={socket}
              startGame={startOnlineGame}
              resetGame={resetGame}
            />
          )}
          {/* {winnerMessage && (
          <DisplayWinner
            message={winnerMessage}
            goBackToGame={goBackToGame}
            sx={{}}
          />
        )} */}
          {!modality && (
            <GameStartUp modality={modality} setModality={setModality} />
          )}
          {modality === GAME_SETTINGS.PLAYER_VS_COMPUTER && !difficulty && (
            <GameDifficulty setDifficulty={setDifficulty} />
          )}
          {hasGameBeenSetUp && (
            <Canvas
              roomCode={roomName}
              socket={socket}
              difficulty={difficulty}
              modality={modality}
              winnerFound={winnerFound}
              setWinnerFound={setWinnerFound}
              turn={turn}
              boardElements={boardElements}
              setBoardElements={setBoardElements}
              setMemoizePositions={setMemoizePositions}
              setCurrentIndex={setCurrentIndex}
              setIndex={setIndex}
              setWinnerMessage={setWinnerMessage}
            />
          )}
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          {winnerFound && GAME_SETTINGS.PLAYER_VS_COMPUTER === modality && (
            <Button
              backgroundColor="white"
              onClick={(e) => prevMove(e)}
              variant="contained"
              sx={{ margin: 5 }}
              disabled={currentIndex < 0}
              color="error"
            >
              PREVIOUS MOVE
            </Button>
          )}
          {winnerFound && GAME_SETTINGS.PLAYER_VS_COMPUTER === modality && (
            <Button
              backgroundColor="white"
              onClick={(e) => nextMove(e)}
              variant="contained"
              sx={{ margin: 5 }}
              disabled={currentIndex + 1 === index}
              color="success"
            >
              NEXT MOVE
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  )
}
