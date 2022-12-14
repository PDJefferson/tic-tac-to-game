import Canvas from '../components/game/Canvas'
import React from 'react'
import { GAME_SETTINGS } from '../constants/game'
import { Grid, Button } from '@mui/material'
import GameDifficulty from '../components/game/GameDifficulty'
import GameStartUp from '../components/game/GameStartUp'
import RoomLobby from '../components/game/RoomLobby'
import AlertSnackBar from '../components/AlertSnackBar'
import sanitizeAfterGameMessage from '../utils/cleanWinnerMessage'
import AppContext from '../store/AppContext'
import { disableButtonTheme } from '../styles/muiThemeStyles'
export default function Home() {
  const [modality, setModality] = React.useState(null)
  const [difficulty, setDifficulty] = React.useState(null)
  const [turn, setTurn] = React.useState(false)
  const [canOnlineGameStart, setCanOnlineGameStart] = React.useState(false)
  const [roomName, setRoomName] = React.useState(null)
  const [memoizePositions, setMemoizePositions] = React.useState(new Array())
  const [currentIndex, setCurrentIndex] = React.useState(-1)
  const [size, setSize] = React.useState(0)
  const [winnerFound, setWinnerFound] = React.useState(false)
  const [winnerMessage, setWinnerMessage] = React.useState(null)
  const [boardElements, setBoardElements] = React.useState([
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ])
  const { socket } = React.useContext(AppContext)

  let hasGameBeenSetUp =
    (modality && difficulty) ||
    (modality && modality === GAME_SETTINGS.PLAYER_VS_PLAYER) ||
    canOnlineGameStart

  let sanitizeWinnerMessage = winnerMessage
    ? sanitizeAfterGameMessage(modality, winnerMessage)
    : null

  const resetGame = () => {
    if (roomName) {
      socket.emit('leaveRoom', { roomCode: roomName })
    }
    setModality(null)
    setDifficulty(null)
    setWinnerMessage(null)
    setMemoizePositions(new Array())
    setCurrentIndex(-1)
    setSize(0)
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
    if (currentIndex === size) return
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
        <AlertSnackBar
          passedMessage={sanitizeWinnerMessage.message}
          typeMessage={sanitizeWinnerMessage.alertType}
        />
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
          {(hasGameBeenSetUp || GAME_SETTINGS.ONLINE === modality) && (
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
              setSize={setSize}
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
              theme={disableButtonTheme}
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
              disabled={currentIndex + 1 === size}
              color="success"
              theme={disableButtonTheme}
            >
              NEXT MOVE
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  )
}
