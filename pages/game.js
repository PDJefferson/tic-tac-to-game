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
import { saveData, getData5 } from '../routes/api/users'
import History from '../components/History'
import { getSession } from 'next-auth/react'
import Data from '../models/Data'

export default function Home({ data }) {
  const [again, setAgain] = React.useState(false)
  const [modality, setModality] = React.useState(null)
  const [difficulty, setDifficulty] = React.useState(null)
  const [opponent, setOpponent] = React.useState('')
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
  //getting the current user who has been authenticated
  const { data: session } = useSession(AppContext)
  const router = useRouter()
  
  React.useEffect(() => {
    if (winnerFound) {
      if (GAME_SETTINGS.PLAYER_VS_PLAYER === modality) {
        return
      }
      let userWin = 'false'
      if (GAME_SETTINGS.PLAYER_VS_COMPUTER === modality) {
        if (winnerMessage === 'oUser') {
          userWin = 'true'
        } else if (winnerMessage === 'xUser') {
          userWin = 'false'
        } else {
          userWin = 'tie'
        }
      } else if (GAME_SETTINGS.ONLINE === modality) {
        if (winnerMessage === 'xUser') {
          userWin = 'true'
        } else if (winnerMessage === 'oUser') {
          userWin = 'false'
        } else {
          userWin = 'tie'
        }
      }
      let holdMemoizePositions = []
      memoizePositions.map((e) => {
        let inside = {
          i: e.i,
          j: e.j,
          key: e.object.key,
        }
        holdMemoizePositions.push(inside)
      })

      let data
      if (modality === GAME_SETTINGS.ONLINE) {
        data = {
          modality,
          userWin,
          holdMemoizePositions,
          opponent,
        }
      }
      if (modality === GAME_SETTINGS.PLAYER_VS_COMPUTER) {
        data = {
          modality,
          userWin,
          difficulty,
          holdMemoizePositions,
        }
      }

      if (session) {
        saveData(data)
      }
      setOpponent('')
    }
  }, [winnerFound])

  // const {
  //   sendRequest,
  //   data: updatedData,
  //   status,
  //   error,
  // } = useHttp(updateUser, false)

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

  const resetGame = async () => {
    setWinnerFound(false)
    setWinnerMessage(null)
    if (roomName) {
      socket.emit('leaveRoom', { roomCode: roomName })
    }
    setModality(null)
    setDifficulty(null)

    setMemoizePositions(new Array())
    setCurrentIndex(-1)
    setSize(0)
    setCanOnlineGameStart(false)
    hasGameBeenSetUp = false
    sanitizeWinnerMessage = null
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
    setWinnerFound(false)
    setWinnerMessage(null)
    if (modality === GAME_SETTINGS.ONLINE && roomName) {
      setCanOnlineGameStart(false)
      socket.emit('leaveRoom', { roomCode: roomName })
    }
    setMemoizePositions(new Array())
    setCurrentIndex(-1)
    setSize(0)
    setTurn(!turn)
    sanitizeWinnerMessage = null
    setBoardElements([
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
      [undefined, undefined, undefined],
    ])
  }

  const startOnlineGame = (roomCode) => {
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
            sx={{ mt: 2, mb: 1 }}
          >
            {hasGameBeenSetUp && (
              <Grid container item direction="column" xs={1} md={1} sm={1}>
                <Button
                  onClick={(e) => {
                    resetGame()
                    setAgain(true)
                  }}
                  variant="contained"
                >
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
                    session={session}
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
                  opponent={opponent}
                  setOpponent={setOpponent}
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
        {session && !modality && (
          <History data={data} again={again} setAgain={setAgain} />
        )}
      </Grid>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })

  if (session) {
    const getData = await Data.find({ user: session.user23._id })
      .sort({ dateUnix: -1 })
      .limit(5)
      .populate({
        path: 'opponent',
        select: 'name',
      })

    return { props: { data: JSON.stringify(getData) } }
  }

  return {
    props: {},
  }
}
