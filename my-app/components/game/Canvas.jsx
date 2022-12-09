import React from 'react'
import { breadcrumbsClasses, Grid } from '@mui/material'
import OComponent from './OComponent'
import XComponent from './XComponent'
import classes from '../../styles/Canvas.module.css'
import checkWinner from '../../utils/winnerLogic.js'
import checkAllCellsTaken from '../../utils/checkCellsTaken'
import { GAME_SETTINGS } from '../../constants/game'
import minimaxAlgo from '../../utils/minimaxAlgo'
import randomPositionNotTaken from '../../utils/randomStep'
export default function Canvas({
  boardElements,
  setBoardElements,
  modality,
  difficulty,
  turn,
  roomCode,
  socket,
  winnerFound,
  setWinnerFound,
  // winnerFound = () => {},
}) {
  const [switchTurns, setSwitchTurns] = React.useState(
    GAME_SETTINGS.ONLINE === modality ? true : turn
  )
  // const [boardElements, setBoardElements] = React.useState([
  //   [undefined, undefined, undefined],
  //   [undefined, undefined, undefined],
  //   [undefined, undefined, undefined],
  // ])
  const [checkIfWinner, setCheckIfWinner] = React.useState(false)

  // React.useEffect(() => {
  //   //checks if there is a winner.
  //   if (checkIfWinner) {
  //     setCheckIfWinner(false)
  //     let winner = checkWinner(boardElements)
  //     //if a winner does exists show winner.
  //     if (winner) {

  //       setWinnerFound(true)
  //       // otherwise continue the game
  //     } else {
  //       let allCellsSTaken = checkAllCellsTaken(boardElements)
  //       //unless all the cells get selected; that means, it is a tie.
  //       if (allCellsSTaken) {

  //         setWinnerFound(true)
  //       }
  //     }
  //   }
  // }, [boardElements, checkIfWinner])

  React.useEffect(() => {
    let hold = false
    if (checkIfWinner) {
      setCheckIfWinner(false)
      let winner = checkWinner(boardElements)
      //if a winner does exists show winner.
      hold = winner
      if (winner) {
        setWinnerFound(true)
        // otherwise continue the game
      } else {
        let allCellsSTaken = checkAllCellsTaken(boardElements)
        //unless all the cells get selected; that means, it is a tie.
        if (allCellsSTaken) {
          setWinnerFound(true)
        }
      }
    }

    let timeout
    //if the user is against a computer and is the computers turn
    if (switchTurns && GAME_SETTINGS.PLAYER_VS_COMPUTER === modality && !hold) {
      //make computer choose its position
      let moveToTake = getAlgoStepsBasedOnDifficulty(difficulty, boardElements)
      timeout = setTimeout(() => {
        if (moveToTake) {
          //append computer position
          setBoardElements((boardElements) => {
            boardElements[moveToTake.i][moveToTake.j] = switchTurns ? (
              <XComponent key={GAME_SETTINGS.X_USER} />
            ) : (
              <OComponent key={GAME_SETTINGS.O_USER} />
            )
            return boardElements
          })
          //switch turns
          setSwitchTurns((prevState) => (prevState = false))
          setCheckIfWinner((prevState) => (prevState = true))
        }
      }, 200)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [switchTurns, boardElements])

  //listen to an update to the game from the other user
  React.useEffect(() => {
    socket.on('updateGame', ({ row, col }) => {
      console.log('use Effect', row, col)
      setBoardElements((boardElements) => {
        boardElements[row][col] = <OComponent key={GAME_SETTINGS.O_USER} />
        return boardElements
      })
      setSwitchTurns(true)
      setCheckIfWinner(true)
    })
    return () => socket.off('updateGame')
  })

  //if the other user leaves then make this user win by default
  React.useEffect(() => {
    socket.on('onOtherUserLeaving', (flag) => {
      winnerFound('Won by default since other user left')
    })
    return () => socket.off('onOtherUserLeaving')
  })

  //sets the game modality
  const gameModality = (row, col) => {
    switch (modality) {
      case GAME_SETTINGS.PLAYER_VS_COMPUTER:
        playerVsComputer(row, col)
        break
      case GAME_SETTINGS.PLAYER_VS_PLAYER:
        playerVsPlayer(row, col)
        break
      case GAME_SETTINGS.ONLINE:
        online(row, col)
        break
      default:
        alert('not such a modality')
        break
    }
  }

  const playerVsComputer = (row, col) => {
    if (switchTurns) return
    //append users position
    setBoardElements((boardElements) => {
      boardElements[row][col] = <OComponent key={GAME_SETTINGS.O_USER} />

      return boardElements
    })

    //switch turns
    setSwitchTurns((prevState) => (prevState = true))
    //check who wins
    setCheckIfWinner(true)
  }
  const playerVsPlayer = (row, col) => {
    //append item to current cell selected
    setBoardElements((boardElements) => {
      boardElements[row][col] = switchTurns ? (
        <XComponent key={GAME_SETTINGS.X_USER} />
      ) : (
        <OComponent key={GAME_SETTINGS.O_USER} />
      )
      return boardElements
    })

    //switch turns
    setSwitchTurns(!switchTurns)
    setCheckIfWinner(true)
  }

  const online = (row, col) => {
    if (switchTurns) {
      //append item to current cell selected
      setBoardElements((boardElements) => {
        boardElements[row][col] = <XComponent key={GAME_SETTINGS.X_USER} />
        return boardElements
      })
      setSwitchTurns(false)
      setCheckIfWinner(true)
      //emit the new changes to the dom to the user
      socket.emit('play', { row, col, roomCode })
    }
  }

  const appendXorO = (e, row, col) => {
    //if someone has selected the cell, return
    if (boardElements[row][col]) {
      return
    }
    gameModality(row, col)
  }

  return (
    <>
      {/*first row*/}
      <Grid container justifyContent="center">
        <Grid
          item
          xs={2}
          sx={{ borderRight: 2, borderBottom: 2, borderColor: 'white' }}
          textAlign="center"
          className={classes['canvas-style']}
          onClick={(e) => {
            if (!winnerFound) {
              appendXorO(e, 0, 0)
            }
          }}
          padding="0"
          margin="0"
          minWidth="150px"
          minHeight="150px"
        >
          <br></br>
          <br></br>
          {boardElements[0][0]}
          <br></br>
          <br></br>
        </Grid>
        <Grid
          item
          xs={2}
          padding="0"
          margin="0"
          sx={{ borderRight: 2, borderBottom: 2, borderColor: 'white' }}
          textAlign="center"
          className={classes['canvas-style']}
          // onClick={(e) => appendXorO(e, 0, 1)}
          onClick={(e) => {
            if (!winnerFound) {
              appendXorO(e, 0, 1)
            }
          }}
          minWidth="150px"
          minHeight="150px"
        >
          <br></br>
          <br></br>
          {boardElements[0][1]}
          <br></br>
          <br></br>
        </Grid>
        <Grid
          item
          xs={2}
          padding="0"
          margin="0"
          sx={{ borderBottom: 2, borderColor: 'white' }}
          textAlign="center"
          className={classes['canvas-style']}
          // onClick={(e) => appendXorO(e, 0, 2)}
          onClick={(e) => {
            if (!winnerFound) {
              appendXorO(e, 0, 2)
            }
          }}
          minWidth="150px"
          minHeight="150px"
        >
          <br></br>
          <br></br>
          {boardElements[0][2]}
          <br></br>
          <br></br>
        </Grid>
      </Grid>
      {/*second row*/}
      <Grid container justifyContent="center">
        <Grid
          item
          xs={2}
          padding="0"
          margin="0"
          sx={{ borderRight: 2, borderBottom: 2, borderColor: 'white' }}
          textAlign="center"
          className={classes['canvas-style']}
          // onClick={(e) => appendXorO(e, 1, 0)}
          onClick={(e) => {
            if (!winnerFound) {
              appendXorO(e, 1, 0)
            }
          }}
          minWidth="150px"
          minHeight="150px"
        >
          <br></br>
          <br></br>
          {boardElements[1][0]}
          <br></br>
          <br></br>
        </Grid>
        <Grid
          item
          padding="0"
          margin="0"
          xs={2}
          sx={{ borderRight: 2, borderBottom: 2, borderColor: 'white' }}
          textAlign="center"
          className={classes['canvas-style']}
          // onClick={(e) => appendXorO(e, 1, 1)}
          onClick={(e) => {
            if (!winnerFound) {
              appendXorO(e, 1, 1)
            }
          }}
          minWidth="150px"
          minHeight="150px"
        >
          <br></br>
          <br></br>
          {boardElements[1][1]}
          <br></br>
          <br></br>
        </Grid>
        <Grid
          item
          xs={2}
          padding="0"
          margin="0"
          sx={{ borderBottom: 2, borderColor: 'white' }}
          textAlign="center"
          className={classes['canvas-style']}
          // onClick={(e) => appendXorO(e, 1, 2)}
          onClick={(e) => {
            if (!winnerFound) {
              appendXorO(e, 1, 2)
            }
          }}
          minWidth="150px"
          minHeight="150px"
        >
          <br></br>
          <br></br>
          {boardElements[1][2]}
          <br></br>
          <br></br>
        </Grid>
      </Grid>
      {/*third row*/}
      <Grid container justifyContent="center">
        <Grid
          item
          xs={2}
          padding="0"
          margin="0"
          sx={{ borderRight: 2, borderColor: 'white' }}
          textAlign="center"
          className={classes['canvas-style']}
          // onClick={(e) => appendXorO(e, 2, 0)}
          onClick={(e) => {
            if (!winnerFound) {
              appendXorO(e, 2, 0)
            }
          }}
          minWidth="150px"
          minHeight="150px"
        >
          <br></br>
          <br></br>
          {boardElements[2][0]}
          <br></br>
          <br></br>
        </Grid>
        <Grid
          item
          xs={2}
          padding="0"
          margin="0"
          sx={{ borderRight: 2, borderColor: 'white' }}
          textAlign="center"
          className={classes['canvas-style']}
          // onClick={(e) => appendXorO(e, 2, 1)}
          onClick={(e) => {
            if (!winnerFound) {
              appendXorO(e, 2, 1)
            }
          }}
          minWidth="150px"
          minHeight="150px"
        >
          <br></br>
          <br></br>
          {boardElements[2][1]}
          <br></br>
          <br></br>
        </Grid>
        <Grid
          item
          xs={2}
          padding="0"
          margin="0"
          className={classes['canvas-style']}
          // onClick={(e) => appendXorO(e, 2, 2)}
          onClick={(e) => {
            if (!winnerFound) {
              appendXorO(e, 2, 2)
            }
          }}
          textAlign="center"
          minWidth="150px"
          minHeight="150px"
        >
          <br></br>
          <br></br>
          {boardElements[2][2]}
          <br></br>
          <br></br>
        </Grid>
      </Grid>
    </>
  )
}

function getAlgoStepsBasedOnDifficulty(difficulty, board) {
  switch (difficulty) {
    case GAME_SETTINGS.EASY:
      return randomPositionNotTaken(board)
      break
    case GAME_SETTINGS.MEDIUM:
      console.error('I still have not come out with an algo for this')
      return randomPositionNotTaken(board)
      break
    case GAME_SETTINGS.HARD:
      return minimaxAlgo(board)
      break
    default:
      console.error('Such difficulty does not exist')
      throw new Error('game difficulty is not part of the game')
      break
  }
}
