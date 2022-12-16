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
import LeaderBoard from '../components/leaderboard/LeaderBoard'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import useHttp from '../hooks/use-http'
import { updateUser } from '../routes/api/users'

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
  const [hasUserBeenUpdated, setHasUserBeenUpdated] = React.useState(false)
  const { socket } = React.useContext(AppContext)
  //getting the current user who has been authenticated
  const { data: session } = useSession(AppContext)

  const router = useRouter()

  const {
    sendRequest,
    data: updatedData,
    status,
    error,
  } = useHttp(updateUser, false)

  //if the user wants to play online then make him sign in
  if (!session && modality === GAME_SETTINGS.ONLINE) {
    router.push('/signin')
  }

  let hasGameBeenSetUp = React.useMemo(() => {
    return (
      (modality && difficulty) ||
      (modality && modality === GAME_SETTINGS.PLAYER_VS_PLAYER) ||
      canOnlineGameStart
    )
  }, [modality, difficulty, canOnlineGameStart])

  let sanitizeWinnerMessage = React.useMemo(() => {
    return winnerMessage
      ? sanitizeAfterGameMessage(modality, winnerMessage)
      : null
  }, [winnerMessage, modality])

  //store the wins or loses
  if (
    session &&
    winnerMessage &&
    (winnerMessage === GAME_SETTINGS.X_USER ||
      winnerMessage === GAME_SETTINGS.O_USER) &&
    !hasUserBeenUpdated &&
    GAME_SETTINGS.ONLINE === modality
  ) {
    let wins =
      winnerMessage === GAME_SETTINGS.X_USER
        ? session?.user23?.wins + 1
        : session?.user23?.wins
    let loses =
      winnerMessage === GAME_SETTINGS.O_USER
        ? session?.user23?.loses + 1
        : session?.user23?.loses
    sendRequest({ id: session.user23._id, wins, loses })
    setHasUserBeenUpdated(true)
  }

  const resetGame = () => {
    if (roomName) {
      socket.emit('leaveRoom', { roomCode: roomName })
    }
    setHasUserBeenUpdated(false)
    setModality(null)
    setDifficulty(null)
    setWinnerMessage(null)
    setMemoizePositions(new Array())
    setCurrentIndex(-1)
    setSize(0)
    setCanOnlineGameStart(null)
    hasGameBeenSetUp = false
    sanitizeWinnerMessage = null
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
    setHasUserBeenUpdated(false)
    setWinnerMessage(null)
    setMemoizePositions(new Array())
    setCurrentIndex(-1)
    setSize(0)
    setTurn(!turn)
    sanitizeWinnerMessage = null
    setWinnerFound(false)
    setBoardElements([
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ])
  }

  const startOnlineGame = (roomCode) => {
    setHasUserBeenUpdated(false)
    setRoomName(roomCode)
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
        minHeight="92vh"
        sx={{ background: 'black', margin: 0, padding: 0 }}
      >
        <Grid
          container
          item
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Grid
            container
            item
            direction="row"
            alignItems="center"
            justifyContent="space-around"
          >
            {(hasGameBeenSetUp || GAME_SETTINGS.ONLINE === modality) && (
              <Grid container item direction="column" xs={1} md={1} sm={1}>
                <Button onClick={(e) => resetGame()} variant="contained">
                  return
                </Button>
              </Grid>
            )}
            {winnerFound && (
              <Grid container item direction="column" xs={1} md={1} sm={1}>
                <Button onClick={(e) => goBackToGame()} variant="contained">
                  again
                </Button>
              </Grid>
            )}
          </Grid>
          <Grid
            container
            item
            direction="row"
            spacing={1}
            justifyContent={'space-around'}
          >
            {winnerFound && <LeaderBoard />}
            <Grid
              container
              item
              alignItems="center"
              sx={{
                border: 5,
                borderRadius: 1,
                borderColor: 'white',
                backgroundColor: winnerFound && 'grey',
              }}
              sm={10}
              xs={10}
              md={7}
              direction="row"
              minWidth={'400px'}
              minHeight={'580px'}
              justifyContent="center"
              textAlign="center"
            >
              {modality === GAME_SETTINGS.ONLINE &&
                session &&
                !canOnlineGameStart && (
                  <RoomLobby
                    socket={socket}
                    startGame={startOnlineGame}
                    resetGame={resetGame}
                  />
                )}
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
          </Grid>
          <Grid
            container
            direction="row"
            alignItems="center"
            marginTop={2}
            marginBottom={2}
            justifyContent="space-around"
          >
            <Grid container item xs={2} md={2} sm={2} direction="column">
              {winnerFound && GAME_SETTINGS.PLAYER_VS_COMPUTER === modality && (
                <Button
                  onClick={(e) => prevMove(e)}
                  variant="contained"
                  disabled={currentIndex < 0}
                  color="error"
                  theme={disableButtonTheme}
                >
                  PREVIOUS MOVE
                </Button>
              )}
            </Grid>
            <Grid container item xs={2} md={2} sm={2} direction="column">
              {winnerFound && GAME_SETTINGS.PLAYER_VS_COMPUTER === modality && (
                <Button
                  onClick={(e) => nextMove(e)}
                  variant="contained"
                  disabled={currentIndex + 1 === size}
                  color="success"
                  theme={disableButtonTheme}
                >
                  NEXT MOVE
                </Button>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
