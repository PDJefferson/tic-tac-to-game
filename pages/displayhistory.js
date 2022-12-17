import { getSession } from 'next-auth/react'
import Data from '../models/Data'
import React from 'react'
import { Grid, Button, Typography, IconButton, Icon } from '@mui/material'
import classes from '../styles/Canvas.module.css'
import { RESPONSIVE_LAYOUT } from '../constants/responsive'
import { useWindowSize } from '../hooks/use-WindowsSize'
import OComponent from '../components/game/OComponent'
import XComponent from '../components/game/XComponent'
import { GAME_SETTINGS } from '../constants/game'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import ComputerIcon from '@mui/icons-material/Computer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import ContrastIcon from '@mui/icons-material/Contrast'
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn'
import { useRouter } from 'next/router'

export default function Home({ data }) {
  const router = useRouter()
  const [info, setInfo] = React.useState({})
  const [curWidth, curHeight] = useWindowSize()
  const [maxIndex, setMaxIndex] = React.useState(-1)
  const [currentIndex, setCurrentIndex] = React.useState(-1)

  const [boardElements, setBoardElements] = React.useState([
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ])
  React.useEffect(() => {
    const data2 = JSON.parse(data)
    setInfo(data2)
    data2.memoizePositions?.map((e) => {
      setBoardElements((boardElements) => {
        boardElements[e.i][e.j] =
          e.key === 'xUser' ? (
            <XComponent key={GAME_SETTINGS.X_USER} />
          ) : (
            <OComponent key={GAME_SETTINGS.O_USER} />
          )
        return boardElements
      })
    })
    setMaxIndex(data2.memoizePositions?.length - 1)
    setCurrentIndex(data2.memoizePositions?.length - 1)
    console.log(data2.memoizePositions?.length)
  }, [])

  let responsiveNess = React.useMemo(() => {
    return curWidth <= RESPONSIVE_LAYOUT.XS_SCREEN_WIDTH
      ? { width: '110px', height: '185px' }
      : curWidth <= RESPONSIVE_LAYOUT.SM_SCREEN_WIDTH
      ? { width: '130px', height: '190px' }
      : curWidth >= RESPONSIVE_LAYOUT.XL_SCREEN_WIDTH
      ? { width: '240px', height: '280px' }
      : { width: '160px', height: '190px' }
  }, [curWidth])

  return (
    <>
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
            spacing={1}
            justifyContent={'space-around'}
          >
            <Grid item>
              <TableBody sx={{ mt: -10 }}>
                <TableRow>
                  <TableCell sx={{ borderBottom: 'none', mr: 20 }} align="left">
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: '/game',
                        })
                      }}
                    >
                      <KeyboardReturnIcon sx={{ color: 'white' }} />
                    </IconButton>
                  </TableCell>
                  <TableCell
                    sx={{ color: 'white', borderBottom: 'none' }}
                    align="left"
                  >
                    {info.modality === 'online' && (
                      <PermIdentityIcon sx={{ color: 'green' }} />
                    )}
                    {info.modality === 'pvc' && (
                      <ComputerIcon sx={{ color: 'green' }} />
                    )}
                  </TableCell>
                  <TableCell
                    sx={{ color: 'white', borderBottom: 'none' }}
                    align="left"
                  >
                    {info.modality === 'online' && info.opponent.name}
                    {info.modality === 'pvc' && info.difficulty}
                  </TableCell>
                  <TableCell
                    sx={{ color: 'white', borderBottom: 'none' }}
                    align="right"
                  >
                    {info.userWin === 'true' && (
                      <AddIcon sx={{ color: 'green' }} />
                    )}
                    {info.userWin === 'false' && (
                      <RemoveIcon sx={{ color: 'red' }} />
                    )}
                    {info.userWin === 'tie' && <ContrastIcon sx={{}} />}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Grid>

            <Grid container justifyContent="center">
              <Grid
                item
                sm={0}
                md={2}
                xl={3}
                sx={{ borderRight: 2, borderBottom: 2, borderColor: 'white' }}
                textAlign="center"
                className={classes['canvas-style']}
                padding="0"
                margin="0"
                minWidth={responsiveNess.width}
                minHeight={responsiveNess.height}
              >
                <br></br>
                <br></br>
                <br></br>
                {boardElements[0][0]}
                <br></br>
                <br></br>
              </Grid>
              <Grid
                item
                sm={0}
                md={2}
                xl={3}
                padding="0"
                margin="0"
                sx={{ borderRight: 2, borderBottom: 2, borderColor: 'white' }}
                textAlign="center"
                className={classes['canvas-style']}
                minWidth={responsiveNess.width}
                minHeight={responsiveNess.height}
              >
                <br></br>
                <br></br>
                <br></br>
                {boardElements[0][1]}
                <br></br>
                <br></br>
              </Grid>
              <Grid
                item
                sm={0}
                md={2}
                xl={3}
                padding="0"
                margin="0"
                sx={{ borderBottom: 2, borderColor: 'white' }}
                textAlign="center"
                className={classes['canvas-style']}
                minWidth={responsiveNess.width}
                minHeight={responsiveNess.height}
              >
                <br></br>
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
                sm={0}
                md={2}
                xl={3}
                padding="0"
                margin="0"
                sx={{ borderRight: 2, borderBottom: 2, borderColor: 'white' }}
                textAlign="center"
                className={classes['canvas-style']}
                minWidth={responsiveNess.width}
                minHeight={responsiveNess.height}
              >
                <br></br>
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
                sm={0}
                md={2}
                xl={3}
                sx={{ borderRight: 2, borderBottom: 2, borderColor: 'white' }}
                textAlign="center"
                alignContent={'center'}
                alignItems={'center'}
                className={classes['canvas-style']}
                minWidth={responsiveNess.width}
                minHeight={responsiveNess.height}
              >
                <br></br>
                <br></br>
                <br></br>
                {boardElements[1][1]}
                <br></br>
                <br></br>
              </Grid>
              <Grid
                item
                sm={0}
                md={2}
                xl={3}
                padding="0"
                margin="0"
                sx={{ borderBottom: 2, borderColor: 'white' }}
                textAlign="center"
                className={classes['canvas-style']}
                minWidth={responsiveNess.width}
                minHeight={responsiveNess.height}
              >
                <br></br>
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
                sm={0}
                md={2}
                xl={3}
                padding="0"
                margin="0"
                sx={{ borderRight: 2, borderColor: 'white' }}
                textAlign="center"
                className={classes['canvas-style']}
                minWidth={responsiveNess.width}
                minHeight={responsiveNess.height}
              >
                <br></br>
                <br></br>
                <br></br>
                {boardElements[2][0]}
                <br></br>
                <br></br>
              </Grid>
              <Grid
                item
                sm={0}
                md={2}
                xl={3}
                padding="0"
                margin="0"
                sx={{ borderRight: 2, borderColor: 'white' }}
                textAlign="center"
                className={classes['canvas-style']}
                minWidth={responsiveNess.width}
                minHeight={responsiveNess.height}
              >
                <br></br>
                <br></br>
                <br></br>
                {boardElements[2][1]}
                <br></br>
                <br></br>
              </Grid>
              <Grid
                item
                sm={0}
                md={2}
                xl={3}
                padding="0"
                margin="0"
                className={classes['canvas-style']}
                textAlign="center"
                minWidth={responsiveNess.width}
                minHeight={responsiveNess.height}
              >
                <br></br>
                <br></br>
                <br></br>
                {boardElements[2][2]}
                <br></br>
                <br></br>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sx={{ mt: 2, mb: 5 }}>
            <Button
              variant="outlined"
              disabled={currentIndex === 0}
              onClick={() => {
                //remove current index from board
                setBoardElements((boardElements) => {
                  let hold = info.memoizePositions[currentIndex]
                  boardElements[hold.i][hold.j] = undefined
                  return boardElements
                })
                //change current index = current index - 1
                setCurrentIndex(
                  (currentIndex) => (currentIndex = currentIndex - 1)
                )
              }}
              sx={{ mr: 2 }}
            >
              Previous
            </Button>
            <Button
              variant="outlined"
              disabled={maxIndex === currentIndex}
              onClick={() => {
                //add current index + 1 to the board
                setBoardElements((boardElements) => {
                  let hold = info.memoizePositions[currentIndex + 1]
                  boardElements[hold.i][hold.j] =
                    hold.key === 'xUser' ? (
                      <XComponent key={GAME_SETTINGS.X_USER} />
                    ) : (
                      <OComponent key={GAME_SETTINGS.O_USER} />
                    )
                  return boardElements
                })
                //change current index = current index + 1
                setCurrentIndex(
                  (currentIndex) => (currentIndex = currentIndex + 1)
                )
              }}
            >
              Next
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req })
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const { query } = context

  const getData = await Data.findOne({ _id: query.pid }).populate({
    path: 'opponent',
    select: 'name',
  })

  if (!getData) {
    return {
      redirect: {
        destination: '/game',
        permanent: false,
      },
    }
  }

  return {
    props: { data: JSON.stringify(getData) },
  }
}
